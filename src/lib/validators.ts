import { z } from "zod";

// ── Auth ────────────────────────────────────────────────────

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  role: z.enum(["USER", "ADVOCATE"]).default("USER"),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
});

// ── Chat ────────────────────────────────────────────────────

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(5000).trim(),
  userId: z.string().optional(),
  caseId: z.string().optional(),
  party: z.enum(["PLAINTIFF", "DEFENDANT"]).optional().default("PLAINTIFF"),
});

// ── Bookings ────────────────────────────────────────────────

export const createBookingSchema = z.object({
  advocateId: z.string().min(1),
  matterId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  time: z.string().regex(/^\d{1,2}:\d{2}\s?(AM|PM)$/i, "Invalid time format"),
  duration: z.number().int().min(30).max(180).default(60),
  consultationType: z.enum(["VIDEO", "PHONE", "IN_PERSON"]).default("VIDEO"),
  userNotes: z.string().max(1000).optional(),
});

export const updateBookingSchema = z.object({
  bookingId: z.string().min(1),
  status: z.enum(["CANCELLED", "RESCHEDULED"]).optional(),
  cancelReason: z.string().max(500).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
});

// ── Payments ────────────────────────────────────────────────

export const createPaymentOrderSchema = z.object({
  bookingId: z.string().min(1),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  bookingId: z.string().min(1),
});

// ── Documents ───────────────────────────────────────────────

export const generateDocumentSchema = z.object({
  matterId: z.string().min(1),
  type: z.enum([
    "LEGAL_NOTICE",
    "COMPLAINT",
    "AFFIDAVIT",
    "SETTLEMENT_DEED",
    "VAKALATNAMA",
    "REPLY_NOTICE",
  ]),
  additionalContext: z.string().max(2000).optional(),
});

export const createDocumentRecordSchema = z.object({
  caseId: z.string().optional(),
  matterId: z.string().optional(),
  docType: z.string().min(1).max(100),
  details: z.string().min(1).max(5000),
});

export const updateDocumentRecordSchema = z.object({
  docId: z.string().min(1),
  content: z.string().max(50000).optional(),
  title: z.string().min(1).max(200).optional(),
});

// ── Messages ────────────────────────────────────────────────

export const createMessageSchema = z.object({
  text: z.string().min(1).max(5000).trim(),
});

// ── Matters ─────────────────────────────────────────────────

export const createMatterSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  description: z.string().min(10).max(5000).trim(),
  jurisdiction: z.string().min(2).max(100).trim(),
  category: z.string().max(100).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
});

export const updateMatterSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["ACTIVE", "RESOLVED", "SETTLED", "CLOSED", "PENDING_REVIEW"]).optional(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  title: z.string().min(3).max(200).trim().optional(),
});

// ── Hearings ────────────────────────────────────────────────

export const createHearingSchema = z.object({
  caseId: z.string().min(1),
  hearingDate: z.string().datetime({ offset: true }),
  hearingTime: z.string().regex(/^\d{1,2}:\d{2}$/),
  courtName: z.string().min(2).max(200).trim(),
  courtNumber: z.string().max(50).optional(),
  judgeName: z.string().max(100).optional(),
  purpose: z.string().min(2).max(200).trim(),
  notes: z.string().max(2000).optional(),
});

// ── User profile ─────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  city: z.string().max(100).trim().optional(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-()]{10,15}$/, "Invalid phone number")
    .optional(),
});

// ── Subscriptions ────────────────────────────────────────────

export const createSubscriptionSchema = z.object({
  planId: z.string().min(1),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]).default("MONTHLY"),
});

// ── Utility ─────────────────────────────────────────────────

/** Parse & return validated data or throw a 400-safe error */
export function parseBody<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const messages = result.error.issues.map(
      (i) => `${i.path.join(".")}: ${i.message}`
    );
    throw new ValidationError(messages);
  }
  return result.data;
}

export class ValidationError extends Error {
  public readonly messages: string[];
  constructor(messages: string[]) {
    super(messages.join("; "));
    this.name = "ValidationError";
    this.messages = messages;
  }
}
