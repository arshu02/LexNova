/**
 * Supabase Storage client for cloud file management.
 * Replaces local public/ folder with access-controlled, CDN-backed storage.
 */

const SUPABASE_URL          = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Bucket names
export const BUCKETS = {
  DOCUMENTS: "documents",   // private — user legal docs
  EVIDENCE:  "evidence",    // private — case evidence files
  AVATARS:   "avatars",     // public  — advocate profile photos
} as const;

type Bucket = (typeof BUCKETS)[keyof typeof BUCKETS];

// Signed URL expiry (seconds)
const SIGNED_URL_EXPIRY = 7 * 24 * 60 * 60; // 7 days

// ── Low-level fetch wrapper ─────────────────────────────────

async function supabaseStorageRequest(
  method: string,
  path: string,
  body?: BodyInit | null,
  headers: Record<string, string> = {}
): Promise<Response> {
  const res = await fetch(`${SUPABASE_URL}/storage/v1${path}`, {
    method,
    headers: {
      apikey:        SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      ...headers,
    },
    body,
  });
  return res;
}

// ── Upload a file ───────────────────────────────────────────

export interface UploadResult {
  path: string;
  bucket: Bucket;
  fullPath: string;
  url?: string; // only set for public buckets
}

export async function uploadFile(
  bucket: Bucket,
  path: string,
  file: Blob | Buffer | ArrayBuffer,
  mimeType: string
): Promise<UploadResult> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error("Supabase Storage is not configured.");
  }

  let body: BodyInit;
  if (file instanceof Blob) {
    body = file;
  } else if (file instanceof Buffer) {
    body = new Uint8Array(file) as unknown as BodyInit;
  } else {
    body = new Uint8Array(file) as unknown as BodyInit;
  }

  const res = await supabaseStorageRequest(
    "POST",
    `/object/${bucket}/${path}`,
    body,
    { "Content-Type": mimeType }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed (${res.status}): ${err}`);
  }

  const fullPath = `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;

  return {
    path,
    bucket,
    fullPath,
    url: bucket === BUCKETS.AVATARS ? `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}` : undefined,
  };
}

// ── Get a signed URL (for private buckets) ──────────────────

export async function getSignedUrl(
  bucket: Bucket,
  path: string,
  expiresIn = SIGNED_URL_EXPIRY
): Promise<string> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error("Supabase Storage is not configured.");
  }

  const res = await supabaseStorageRequest(
    "POST",
    `/object/sign/${bucket}/${path}`,
    JSON.stringify({ expiresIn }),
    { "Content-Type": "application/json" }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create signed URL (${res.status}): ${err}`);
  }

  const data = await res.json();
  return `${SUPABASE_URL}/storage/v1${data.signedURL}`;
}

// ── Delete a file ───────────────────────────────────────────

export async function deleteFile(bucket: Bucket, path: string): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return;

  const res = await supabaseStorageRequest(
    "DELETE",
    `/object/${bucket}`,
    JSON.stringify({ prefixes: [path] }),
    { "Content-Type": "application/json" }
  );

  if (!res.ok) {
    console.error(`[Storage] Delete failed for ${bucket}/${path}:`, await res.text());
  }
}

// ── Generate a unique storage path ─────────────────────────

export function storagePath(
  userId: string,
  matterId: string,
  filename: string
): string {
  const timestamp = Date.now();
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${userId}/${matterId}/${timestamp}_${safe}`;
}
