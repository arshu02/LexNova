/**
 * LexNova — Immutable Enterprise Audit Logger
 *
 * Writes append-only records to the dedicated AuditLog table.
 * Also emits structured JSON to stdout for SIEM / CloudWatch / Datadog ingestion.
 *
 * IMPORTANT: AuditLog records must NEVER be updated or deleted in normal operation.
 * Any modification of audit records is itself a security event that must be investigated.
 */

import prisma from '@/lib/prisma';

// ── Audit action vocabulary ────────────────────────────────────
export type AuditAction =
  // Auth
  | 'USER_LOGIN'
  | 'USER_LOGIN_FAILED'
  | 'USER_LOGOUT'
  | 'USER_REGISTERED'
  | 'EMAIL_VERIFIED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'ACCOUNT_LOCKED'
  // Matters
  | 'CASE_CREATED'
  | 'CASE_UPDATED'
  | 'CASE_VIEWED'
  | 'CASE_DELETED'
  | 'CASE_STATUS_CHANGED'
  | 'CASE_SHARED'
  // Documents
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_VIEWED'
  | 'DOCUMENT_DOWNLOADED'
  | 'DOCUMENT_DELETED'
  | 'DOCUMENT_GENERATED'
  | 'DOCUMENT_VERSION_CREATED'
  // AI
  | 'AI_ANALYSIS_DISPATCHED'
  | 'AI_ANALYSIS_COMPLETED'
  | 'AI_ANALYSIS_FAILED'
  // Consultations
  | 'CONSULTATION_BOOKED'
  | 'CONSULTATION_CANCELLED'
  | 'CONSULTATION_COMPLETED'
  // Payments
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_VERIFIED'
  | 'PAYMENT_FAILED'
  | 'REFUND_ISSUED'
  // Organizations
  | 'ORGANIZATION_MEMBER_INVITED'
  | 'ORGANIZATION_MEMBER_REMOVED'
  | 'API_KEY_GENERATED'
  | 'API_KEY_REVOKED'
  // Data & Privacy
  | 'DATA_EXPORT_REQUESTED'
  | 'ACCOUNT_DELETION_REQUESTED'
  // Admin
  | 'ADMIN_OVERRIDE'
  | 'ADMIN_USER_MODIFIED'
  | 'ADMIN_USER_BANNED'
  | 'ADMIN_USER_UNBANNED'
  | 'ADMIN_VERIFICATION_TOGGLE'
  | 'ADMIN_CASE_INSPECTED'
  | 'ADMIN_PROFILE_UPDATED'
  | 'ADMIN_PLAN_CHANGED'
  // Security
  | 'SECURITY_SUSPICIOUS_ACCESS'
  | 'SECURITY_RATE_LIMIT_EXCEEDED'
  | 'SECURITY_PERMISSION_DENIED';

// ── Audit entry schema ─────────────────────────────────────────
export interface AuditLogEntry {
  action:        AuditAction;
  userId?:       string;
  orgId?:        string;
  resourceId?:   string;
  resourceType?: string;
  ipAddress?:    string;
  userAgent?:    string;
  metadata?:     Record<string, any>;
  result?:       'SUCCESS' | 'FAILURE';
  correlationId?: string;
}

// ── Core audit logger ─────────────────────────────────────────
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  const timestamp = new Date().toISOString();

  // 1. Emit structured JSON for external log aggregation (SIEM, CloudWatch, etc.)
  console.log(
    JSON.stringify({
      level:     'AUDIT',
      timestamp,
      action:    entry.action,
      userId:    entry.userId    ?? null,
      orgId:     entry.orgId     ?? null,
      resourceId:   entry.resourceId   ?? null,
      resourceType: entry.resourceType ?? null,
      result:    entry.result    ?? 'SUCCESS',
      correlationId: entry.correlationId ?? null,
      metadata:  entry.metadata  ?? {},
    })
  );

  // 2. Persist to dedicated AuditLog table (non-blocking — failures should not break the primary flow)
  try {
    await prisma.auditLog.create({
      data: {
        action:       entry.action,
        userId:       entry.userId       ?? null,
        orgId:        entry.orgId        ?? null,
        resourceId:   entry.resourceId   ?? null,
        resourceType: entry.resourceType ?? null,
        ipAddress:    entry.ipAddress    ?? null,
        userAgent:    entry.userAgent    ?? null,
        metadata:     entry.metadata ? JSON.stringify(entry.metadata) : null,
        result:       entry.result       ?? 'SUCCESS',
        correlationId: entry.correlationId ?? null,
      },
    });
  } catch (dbErr) {
    // Audit logging failure must never crash the primary operation.
    // Log the failure to stderr so it is captured by log aggregation.
    console.error('[AuditLogger] Failed to persist audit record:', {
      action: entry.action,
      userId: entry.userId,
      error:  dbErr,
    });
  }
}

export default logAuditEvent;
