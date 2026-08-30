'use client';

import React, { useState } from 'react';
import { Loader2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface PaymentButtonProps {
  bookingId: string;
  amount: number;
  advocateName: string;
  userName?: string;
  userEmail?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (err: string) => void;
  className?: string;
  label?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function PaymentButton({
  bookingId,
  amount,
  advocateName,
  userName = 'Client',
  userEmail = '',
  onSuccess,
  onError,
  className = '',
  label = `Pay ₹${amount}`,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const handlePayment = async () => {
    setError(null);
    setLoading(true);

    try {
      // 1. Load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your connection.');
      }

      // 2. Create order on backend
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });

      if (!orderRes.ok) {
        const errJson = await orderRes.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to initialize payment.');
      }

      const orderData = await orderRes.json();

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'LexNova Legal OS',
        description: `Consultation with ${advocateName}`,
        order_id: orderData.orderId,
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: '#2563EB',
          backdrop_color: 'rgba(5, 5, 8, 0.85)',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            setLoading(true);
            // 4. Verify payment signature on backend
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }

            setPaid(true);
            onSuccess?.(response.razorpay_payment_id);
          } catch (verifyErr: any) {
            const msg = verifyErr.message || 'Payment verification failed.';
            setError(msg);
            onError?.(msg);
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (resp: any) => {
        const msg = resp?.error?.description || 'Payment transaction failed.';
        setError(msg);
        onError?.(msg);
        setLoading(false);
      });

      razorpay.open();
    } catch (err: any) {
      const msg = err.message || 'Payment failed.';
      setError(msg);
      onError?.(msg);
      setLoading(false);
    }
  };

  if (paid) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-[13px] font-semibold">
        <CheckCircle2 size={16} /> Paid & Confirmed
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={handlePayment}
        disabled={loading}
        className={
          className ||
          'inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold px-5 py-2.5 rounded-xl text-[13.5px] transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50'
        }
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Processing...
          </>
        ) : (
          <>
            <ShieldCheck size={16} /> {label}
          </>
        )}
      </button>
      {error && (
        <span className="text-[11px] text-red-400 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>
  );
}

export default PaymentButton;
