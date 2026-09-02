import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature || "")
  );
}

// ── POST /api/payments/webhook ─────────────────────────────
export async function POST(req: Request) {
  const signature = req.headers.get("x-razorpay-signature") || "";
  const rawBody   = await req.text();

  if (!WEBHOOK_SECRET) {
    if (process.env.NODE_ENV === "production") {
      console.error("[Webhook] Missing RAZORPAY_WEBHOOK_SECRET in production");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }
  } else if (!verifyWebhookSignature(rawBody, signature)) {
    console.error("[Webhook] Invalid Razorpay signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event?.event as string;
  const payment   = event?.payload?.payment?.entity;
  const refund    = event?.payload?.refund?.entity;

  console.log(`[Webhook] Received: ${eventType}`);

  try {
    switch (eventType) {
      case "payment.captured": {
        if (!payment?.order_id) break;
        // Idempotent: only update if not already PAID
        const booking = await prisma.booking.findFirst({
          where: { razorpayOrderId: payment.order_id, paymentStatus: { not: "PAID" } },
        });
        if (booking) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus:     "PAID",
              razorpayPaymentId: payment.id,
            },
          });
          console.log(`[Webhook] Booking ${booking.confirmationCode} marked PAID`);
        }
        break;
      }

      case "payment.failed": {
        if (!payment?.order_id) break;
        await prisma.booking.updateMany({
          where: { razorpayOrderId: payment.order_id, paymentStatus: "PENDING" },
          data:  { paymentStatus: "FAILED" },
        });
        console.log(`[Webhook] Payment failed for order: ${payment.order_id}`);
        break;
      }

      case "refund.created": {
        if (!refund?.payment_id) break;
        await prisma.booking.updateMany({
          where: { razorpayPaymentId: refund.payment_id },
          data:  { paymentStatus: "REFUNDED" },
        });
        console.log(`[Webhook] Refund created for payment: ${refund.payment_id}`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event: ${eventType}`);
    }
  } catch (err) {
    console.error("[Webhook] Handler error:", err);
    // Return 200 even on internal errors to prevent Razorpay retries
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}
