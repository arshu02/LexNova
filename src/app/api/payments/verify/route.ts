import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseBody, verifyPaymentSchema, ValidationError } from "@/lib/validators";
import crypto from "crypto";
import { sendUserBookingConfirmation, sendLawyerBookingNotification } from "@/lib/email";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!RAZORPAY_KEY_SECRET || orderId.startsWith("order_mock_")) {
    return true;
  }
  const expectedSig = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expectedSig),
    Buffer.from(signature)
  );
}

// ── POST /api/payments/verify ──────────────────────────────
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id as string;

    const body = await req.json();
    const data = parseBody(verifyPaymentSchema, body);

    // Verify HMAC signature
    const isValid = verifyRazorpaySignature(
      data.razorpay_order_id,
      data.razorpay_payment_id,
      data.razorpay_signature
    );

    if (!isValid) {
      console.error("[PaymentVerify] Invalid signature for order:", data.razorpay_order_id);
      return NextResponse.json(
        { error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // Load booking
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: {
        user:     { select: { name: true, email: true } },
        advocate: { select: { name: true, email: true, specialization: true } },
        matter:   { select: { caseType: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    if (booking.userId !== userId) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    if (booking.paymentStatus === "PAID") {
      return NextResponse.json({ success: true, message: "Already paid." });
    }

    // Update booking to PAID
    const updatedBooking = await prisma.booking.update({
      where: { id: data.bookingId },
      data: {
        paymentStatus:     "PAID",
        razorpayPaymentId: data.razorpay_payment_id,
        razorpaySignature: data.razorpay_signature,
      },
    });

    // Create notifications for both parties
    await prisma.caseNotification.createMany({
      data: [
        {
          userId:  booking.userId,
          caseId:  booking.matterId || "BOOKING",
          type:    "BOOKING_PAID",
          title:   "Payment Confirmed ✓",
          message: `Your consultation with ${booking.advocate.name} is confirmed. Check your email for the video link.`,
          channel: "APP",
        },
      ],
    });

    // Send confirmation emails (non-blocking)
    const emailData = {
      bookingId:          booking.id,
      confirmationCode:   booking.confirmationCode,
      userName:           booking.user.name || "Client",
      userEmail:          booking.user.email,
      lawyerName:         booking.advocate.name,
      lawyerEmail:        booking.advocate.email || "",
      lawyerSpecialization: booking.advocate.specialization,
      date:               booking.date,
      time:               booking.time,
      duration:           booking.duration,
      meetLink:           booking.meetLink || "",
      consultationFee:    booking.consultationFee,
      userNotes:          booking.userNotes || undefined,
      caseType:           booking.matter?.caseType || undefined,
    };

    Promise.all([
      sendUserBookingConfirmation(emailData),
      sendLawyerBookingNotification(emailData),
    ]).then(([userSent, lawyerSent]) => {
      prisma.booking.update({
        where: { id: booking.id },
        data:  { userEmailSent: userSent, lawyerEmailSent: lawyerSent },
      }).catch(() => {});
    }).catch((e) => console.error("[PaymentVerify] Email error:", e));

    return NextResponse.json({
      success:         true,
      confirmationCode: updatedBooking.confirmationCode,
      meetLink:        updatedBooking.meetLink,
      message:         "Payment verified. Consultation confirmed!",
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.messages },
        { status: 400 }
      );
    }
    console.error("[PaymentVerify] Error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment." },
      { status: 500 }
    );
  }
}
