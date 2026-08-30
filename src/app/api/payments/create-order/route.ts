import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseBody, createPaymentOrderSchema, verifyPaymentSchema, ValidationError } from "@/lib/validators";
import crypto from "crypto";

const RAZORPAY_KEY_ID     = process.env.RAZORPAY_KEY_ID     || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

// ── Helper: create Razorpay order via REST API ─────────────
async function createRazorpayOrder(amountPaise: number, receipt: string) {
  const credentials = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount:   amountPaise,
      currency: "INR",
      receipt,
      notes: { source: "LexNova" },
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Razorpay order creation failed: ${JSON.stringify(err)}`);
  }
  return res.json();
}

// ── POST /api/payments/create-order ───────────────────────
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id as string;

    const body = await req.json();
    const { bookingId } = parseBody(createPaymentOrderSchema, body);

    // Load booking and verify ownership
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { advocate: { select: { name: true } } },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    if (booking.userId !== userId) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    if (booking.paymentStatus === "PAID") {
      return NextResponse.json({ error: "This booking is already paid." }, { status: 409 });
    }

    // Create Razorpay order (amount in paise)
    const amountPaise = Math.round(booking.consultationFee * 100);
    const order = await createRazorpayOrder(amountPaise, booking.confirmationCode);

    // Persist order ID
    await prisma.booking.update({
      where: { id: bookingId },
      data:  { razorpayOrderId: order.id },
    });

    return NextResponse.json({
      orderId:       order.id,
      amount:        order.amount,
      currency:      order.currency,
      keyId:         RAZORPAY_KEY_ID,
      bookingId,
      confirmationCode: booking.confirmationCode,
      advocateName:  booking.advocate.name,
      description:   `LexNova Consultation — ${booking.confirmationCode}`,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.messages },
        { status: 400 }
      );
    }
    console.error("[PaymentOrder] Error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order." },
      { status: 500 }
    );
  }
}
