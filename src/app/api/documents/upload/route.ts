/**
 * POST /api/documents/upload
 *
 * Secure file upload endpoint for legal documents and evidence.
 * Enforces: auth, matter ownership, MIME validation, file size limits,
 * safe filename sanitization, private storage, signed URL response,
 * document record creation, and audit logging.
 *
 * Security posture:
 * - Never trust the client-supplied Content-Type
 * - Whitelist MIME types by reading file magic bytes (server-side check)
 * - Sanitize all filenames
 * - Store in private bucket only — no public URLs
 * - Return short-lived signed download URL (1 hour)
 * - Log every upload to AuditLog
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import {
  requireAuth,
  canAccessMatter,
  internalErrorResponse,
  forbiddenResponse,
  notFoundResponse,
} from '@/lib/auth-helpers';
import { uploadFile, getSignedUrl, storagePath, BUCKETS } from '@/lib/storage';
import { logAuditEvent } from '@/lib/audit-logger';

// ── Configuration ──────────────────────────────────────────────

/** Maximum upload size: 20 MB */
const MAX_SIZE_BYTES = 20 * 1024 * 1024;

/** Maximum filename length after sanitization */
const MAX_FILENAME_LENGTH = 200;

/**
 * Allowed MIME types for legal documents.
 * Tuple: [mimeType, fileExtensions[], magicBytes (hex prefix)]
 *
 * Magic byte validation prevents content-type spoofing.
 * e.g. a .js file renamed to .pdf will fail the magic byte check.
 */
const ALLOWED_TYPES: Array<{
  mime: string;
  extensions: string[];
  magic: string; // hex prefix of first bytes
}> = [
  { mime: 'application/pdf',     extensions: ['pdf'],        magic: '25504446' }, // %PDF
  { mime: 'image/jpeg',          extensions: ['jpg', 'jpeg'], magic: 'ffd8ff'   },
  { mime: 'image/png',           extensions: ['png'],         magic: '89504e47' },
  { mime: 'image/webp',          extensions: ['webp'],        magic: '52494646' },
  {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extensions: ['docx'],
    magic: '504b0304', // PK zip header (DOCX is a ZIP)
  },
  { mime: 'text/plain',          extensions: ['txt'],         magic: ''          }, // no fixed magic
];

// ── Helpers ────────────────────────────────────────────────────

/** Returns allowed mime types as a set for fast lookup */
const ALLOWED_MIMES = new Set(ALLOWED_TYPES.map((t) => t.mime));

/** Returns allowed extensions as a set */
const ALLOWED_EXTENSIONS = new Set(
  ALLOWED_TYPES.flatMap((t) => t.extensions)
);

/**
 * Validates file magic bytes against known signatures.
 * Empty magic means we skip byte validation for that type (e.g. plain text).
 */
function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const entry = ALLOWED_TYPES.find((t) => t.mime === mimeType);
  if (!entry) return false;
  if (!entry.magic) return true; // no magic bytes to validate

  const fileHex = buffer.subarray(0, 4).toString('hex').toLowerCase();
  return fileHex.startsWith(entry.magic.toLowerCase());
}

/**
 * Sanitizes a filename: strips path separators, control characters,
 * and non-ASCII characters that could cause filesystem or URL issues.
 */
function sanitizeFilename(raw: string): string {
  return raw
    .replace(/[/\\:*?"<>|]/g, '_')  // path separators and shell special chars
    .replace(/[\x00-\x1f\x7f]/g, '') // control characters
    .replace(/\.{2,}/g, '.')          // prevent path traversal via ..
    .slice(0, MAX_FILENAME_LENGTH)
    .trim() || 'document';
}

/**
 * Extracts the file extension from a filename.
 * Returns lower-case extension without the leading dot.
 */
function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Computes SHA-256 hash of file content for integrity verification.
 */
function computeContentHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// ── POST /api/documents/upload ────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Require authentication
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  // 2. Parse multipart form data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request', message: 'Expected multipart/form-data.' },
      { status: 400 }
    );
  }

  const file      = formData.get('file') as File | null;
  const matterId  = formData.get('matterId') as string | null;
  const docType   = (formData.get('docType') as string) || 'EVIDENCE';
  const title     = (formData.get('title') as string) || '';
  const isEvidence = formData.get('isEvidence') === 'true';

  if (!file) {
    return NextResponse.json(
      { error: 'Missing file', message: 'No file was provided in the upload.' },
      { status: 400 }
    );
  }

  if (!matterId) {
    return NextResponse.json(
      { error: 'Missing matterId', message: 'A matterId is required to associate this document.' },
      { status: 400 }
    );
  }

  // 3. Verify matter ownership
  const authorized = await canAccessMatter(user.id, user.role, matterId);
  if (!authorized) {
    return forbiddenResponse('You are not authorized to upload documents to this matter.');
  }

  // Confirm matter exists
  const matter = await prisma.matter.findUnique({
    where:  { id: matterId },
    select: { id: true },
  });
  if (!matter) {
    return notFoundResponse('Matter');
  }

  // 4. File size check
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      {
        error:   'File too large',
        message: `Maximum upload size is ${MAX_SIZE_BYTES / (1024 * 1024)} MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`,
      },
      { status: 413 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      { error: 'Empty file', message: 'The uploaded file is empty.' },
      { status: 400 }
    );
  }

  // 5. Filename and extension validation
  const rawFilename = file.name || 'document';
  const safeFilename = sanitizeFilename(rawFilename);
  const extension = getExtension(safeFilename);

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return NextResponse.json(
      {
        error:   'File type not allowed',
        message: `File extension '.${extension}' is not permitted. Allowed: ${[...ALLOWED_EXTENSIONS].join(', ')}.`,
      },
      { status: 415 }
    );
  }

  // 6. MIME type validation (client-reported vs. whitelist)
  const clientMime = file.type.split(';')[0].trim().toLowerCase();
  if (!ALLOWED_MIMES.has(clientMime)) {
    return NextResponse.json(
      {
        error:   'MIME type not allowed',
        message: `File type '${clientMime}' is not permitted for legal documents.`,
      },
      { status: 415 }
    );
  }

  // 7. Magic byte validation (server-side content verification)
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  if (!validateMagicBytes(fileBuffer, clientMime)) {
    await logAuditEvent({
      action:       'DOCUMENT_UPLOADED',
      userId:       user.id,
      resourceType: 'DOCUMENT',
      result:       'FAILURE',
      metadata: {
        reason:    'magic_byte_mismatch',
        filename:  safeFilename,
        claimedMime: clientMime,
        matterId,
      },
    });

    return NextResponse.json(
      {
        error:   'Invalid file content',
        message: 'The file content does not match its claimed type. Upload rejected for security.',
      },
      { status: 415 }
    );
  }

  // 8. Compute content hash for integrity
  const contentHash = computeContentHash(fileBuffer);

  // 9. Build storage path and upload to private bucket
  const bucket = isEvidence ? BUCKETS.EVIDENCE : BUCKETS.DOCUMENTS;
  const path   = storagePath(user.id, matterId, safeFilename);

  let uploadResult;
  try {
    uploadResult = await uploadFile(bucket, path, fileBuffer, clientMime);
  } catch (uploadErr: any) {
    console.error('[DocumentUpload] Storage upload failed:', uploadErr);
    return internalErrorResponse('File upload failed. Please try again.');
  }

  // 10. Create document record in DB
  const docTitle = title.trim() || safeFilename.replace(/_/g, ' ');

  let document;
  try {
    document = await prisma.document.create({
      data: {
        title:        docTitle,
        type:         docType,
        fileUrl:      uploadResult.fullPath,
        storagePath:  uploadResult.path,
        storageBucket: bucket,
        mimeType:     clientMime,
        sizeBytes:    file.size,
        matterId,
        uploaderId:   user.id,
      },
    });

    // Create initial version record
    await prisma.documentVersion.create({
      data: {
        documentId:  document.id,
        version:     1,
        title:       docTitle,
        storagePath: uploadResult.path,
        sizeBytes:   file.size,
        contentHash,
        createdById: user.id,
        changeNote:  'Initial upload',
      },
    });
  } catch (dbErr) {
    console.error('[DocumentUpload] DB record creation failed:', dbErr);
    return internalErrorResponse('Document record creation failed.');
  }

  // 11. Generate signed download URL (1 hour validity)
  let signedUrl: string | null = null;
  try {
    signedUrl = await getSignedUrl(bucket, path, 3600);
  } catch {
    // Non-fatal — document is uploaded, URL can be fetched separately
    console.warn('[DocumentUpload] Could not generate signed URL immediately.');
  }

  // 12. Audit log the successful upload
  await logAuditEvent({
    action:       'DOCUMENT_UPLOADED',
    userId:       user.id,
    orgId:        user.orgId ?? undefined,
    resourceId:   document.id,
    resourceType: 'DOCUMENT',
    result:       'SUCCESS',
    metadata: {
      filename:    safeFilename,
      mimeType:    clientMime,
      sizeBytes:   file.size,
      matterId,
      bucket,
      contentHash,
    },
  });

  return NextResponse.json(
    {
      success:    true,
      document: {
        id:         document.id,
        title:      docTitle,
        type:       docType,
        mimeType:   clientMime,
        sizeBytes:  file.size,
        matterId,
        signedUrl,
        signedUrlExpiresIn: 3600,
        createdAt:  document.createdAt,
      },
    },
    { status: 201 }
  );
}
