'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, Clock, Video, CheckCircle2, 
  Loader2, AlertCircle, Mail, Copy, ExternalLink, ShieldCheck, User,
  Sparkles, Check, ChevronRight
} from 'lucide-react';
import { PaymentButton } from '@/components/PaymentModal';

interface Advocate {
  id: string | number;
  name: string;
  type?: string;
  specialization?: string;
  consultationFee?: number;
  rating?: number;
  email?: string;
  barNumber?: string;
  courts?: string | string[];
  [key: string]: any;
}

interface BookingModalProps {
  advocate?: Advocate | null;
  lawyer?: Advocate | null;
  isOpen?: boolean;
  userId?: string;
  matterId?: string;
  caseId?: string;
  onClose: () => void;
  onSuccess?: (booking: any) => void;
}

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

function getNextDays(count: number): { 
  label: string; 
  value: string; 
  day: string;
  dateNum: string;
  month: string;
}[] {
  const days = [];
  const date = new Date();
  let added = 0;
  while (added < count) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const value = date.toISOString().split('T')[0];
      const dateNum = String(date.getDate());
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const label = `${dateNum} ${month}`;
      days.push({ label, value, day, dateNum, month });
      added++;
    }
  }
  return days;
}

export default function BookingModal({ 
  advocate: propAdvocate,
  lawyer: propLawyer,
  isOpen = true,
  userId: propUserId,
  matterId: propMatterId,
  caseId: propCaseId,
  onClose,
  onSuccess 
}: BookingModalProps) {
  const { data: session } = useSession();
  const [step, setStep] = useState<'form' | 'success'>('form');
  
  const days = getNextDays(7);
  // Default to first available day and first slot for effortless UX
  const [selectedDate, setSelectedDate] = useState(days[0]?.value || '');
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1] || '11:00 AM');
  const [clientName, setClientName] = useState(session?.user?.name || '');
  const [clientEmail, setClientEmail] = useState(session?.user?.email || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Synchronize session values when available
  React.useEffect(() => {
    if (session?.user?.name && !clientName) {
      setClientName(session.user.name);
    }
    if (session?.user?.email && !clientEmail) {
      setClientEmail(session.user.email);
    }
  }, [session, clientName, clientEmail]);

  const advocate = propAdvocate || propLawyer;

  if (!isOpen || !advocate) return null;

  const fee = advocate.consultationFee || 999;
  const effectiveUserId = propUserId || (session?.user as any)?.id || "user_placeholder";
  const effectiveMatterId = propMatterId || propCaseId || null;

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time.');
      return;
    }

    const emailToUse = (clientEmail || session?.user?.email || '').trim();
    if (!session?.user && (!emailToUse || !emailToUse.includes('@'))) {
      setError('Please enter a valid email address to receive your consultation link and calendar invite.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: effectiveUserId,
          userName: clientName || session?.user?.name || 'Client',
          userEmail: emailToUse,
          advocateId: String(advocate.id),
          advocateName: advocate.name,
          advocateEmail: advocate.email,
          date: selectedDate,
          time: selectedTime,
          userNotes: notes,
          matterId: effectiveMatterId,
          consultationType: 'VIDEO',
          duration: 60,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || 'Booking failed. Please try again.');
        return;
      }

      setBooking(data.booking);
      setStep('success');
      onSuccess?.(data.booking);

    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyMeetLink = () => {
    navigator.clipboard.writeText(booking?.meetLink || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[520px] max-h-[92vh] overflow-y-auto bg-[#070A12] border border-white/[0.12] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col text-white"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/25 shrink-0 border border-white/10">
              {advocate.name.split(' ').filter(Boolean).slice(-1)[0]?.[0] || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {step === 'form' ? 'Book Strategy Consultation' : 'Booking Confirmed!'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-[#8D9CB0] mt-0.5">
                {advocate.name} · <span className="text-slate-300 font-medium">{advocate.specialization || advocate.type || 'Commercial Litigation'}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM STEP */}
        {step === 'form' && (
          <div className="p-6 space-y-5">

            {/* Authenticated or Guest Client Info Display */}
            {session?.user ? (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-300 font-bold">
                    {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                  </div>
                  <div>
                    <span className="text-white font-semibold block">{session.user.name || 'Client'}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{session.user.email}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck size={11} /> Verified Account
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={12} className="text-blue-400" />
                    <span>Client Details (For Video Invite)</span>
                  </span>
                  <a href="/auth/login" className="text-blue-400 hover:underline font-semibold">
                    Sign in with account →
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3 py-2 rounded-xl bg-[#04060B] border border-white/[0.1] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/70"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="alex@company.com"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#04060B] border border-white/[0.1] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/70"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Date Selection Grid / Carousel */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  <Calendar size={13} className="text-blue-400" />
                  <span>Select Consultation Date</span>
                </label>
                <span className="text-[11px] font-mono text-blue-400 font-semibold">
                  Upcoming Availability
                </span>
              </div>

              {/* Redesigned Date Cards with Vibrant Active States & Zero Clipping */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {days.map((d) => {
                  const isSelected = selectedDate === d.value;
                  return (
                    <button 
                      key={d.value}
                      type="button"
                      onClick={() => setSelectedDate(d.value)}
                      className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all ${
                        isSelected
                          ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/40 border-2 border-blue-400 scale-[1.02]'
                          : 'bg-[#04060B] text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08]'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute -top-1 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#38BDF8]" />
                      )}
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {d.day}
                      </span>
                      <span className="text-base font-extrabold font-mono mt-0.5 text-white">
                        {d.dateNum}
                      </span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-blue-200 font-semibold' : 'text-slate-400'}`}>
                        {d.month}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection Slots */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <Clock size={13} className="text-blue-400" />
                <span>Select Available Time Slot</span>
              </label>

              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((t) => {
                  const isSelected = selectedTime === t;
                  return (
                    <button 
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-mono font-semibold transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border border-blue-400/80 shadow-md shadow-blue-600/30 font-bold'
                          : 'bg-[#04060B] text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08]'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Case Notes / Description */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Brief Dispute Context (Optional)
              </label>
              <textarea 
                rows={2} 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your dispute, contract clauses, or claim so the lawyer can review before the call..."
                className="w-full bg-[#04060B] border border-white/[0.1] focus:border-blue-500/70 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Fee & Inclusions Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-500/25 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Video size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Encrypted Video Strategy Session</span>
                    <span className="text-[10px] font-mono text-blue-300 bg-blue-500/15 px-1.5 py-0.2 rounded">60 MINS</span>
                  </p>
                  <p className="text-[11px] text-[#8D9CB0]">
                    Google Meet / Video link included in calendar invite
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Fixed Fee</span>
                <span className="text-lg font-extrabold font-mono text-emerald-400">
                  ₹{fee}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1 space-y-1">
                  <p>{error}</p>
                  {error.toLowerCase().includes('sign in') && (
                    <a href="/auth/login" className="inline-block text-blue-400 hover:text-blue-300 font-bold underline text-[11px]">
                      Sign in to your account →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button 
                type="button"
                onClick={onClose}
                className="btn-ghost flex-1 h-11 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleBook} 
                disabled={loading}
                className="btn-glow-blue flex-[2] h-11 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Reserving Time Slot...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Booking · ₹{fee}</span>
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-[#6B7B94] text-center font-mono">
              🔒 256-bit Encrypted Consultation · Automatic calendar sync with counsel
            </p>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === 'success' && booking && (
          <div className="p-6 space-y-5">
            <div className="text-center py-2 space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 size={32} />
              </motion.div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Appointment Confirmed!
              </h3>
              <p className="text-xs text-[#8D9CB0]">
                Your strategy session with <strong className="text-white">{booking.advocateName}</strong> is reserved.
              </p>
            </div>

            {/* Confirmation Code Card */}
            <div className="p-4 rounded-2xl bg-[#04060B] border border-white/[0.08] text-center space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Booking Reference Code
              </span>
              <p className="text-2xl font-black font-mono text-blue-400 tracking-widest">
                {booking.confirmationCode || `BK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`}
              </p>
            </div>

            {/* Booking Details Summary */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Advocate Counsel:</span>
                <span className="text-white font-bold">{booking.advocateName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Date & Time:</span>
                <span className="text-white font-bold">{booking.date} @ {booking.time}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Consultation Fee:</span>
                <span className="text-emerald-400 font-bold">₹{booking.consultationFee || fee}</span>
              </div>
            </div>

            {/* Video Call Meet Link Box */}
            <div className="p-4 rounded-2xl bg-[#04060B] border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-400 font-bold flex items-center gap-1.5 font-mono">
                  <Video size={13} />
                  <span>VIDEO CONFERENCE LINK</span>
                </span>
                <span className="text-emerald-400 text-[10px] font-mono font-bold">READY</span>
              </div>

              <p className="text-xs font-mono text-slate-300 break-all bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
                {booking.meetLink || 'https://meet.google.com/lex-nova-conf'}
              </p>

              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={copyMeetLink}
                  className="btn-ghost flex-1 h-9 text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
                <a 
                  href={booking.meetLink || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-glow-blue flex-1 h-9 text-xs rounded-xl flex items-center justify-center gap-1.5 font-semibold"
                >
                  <ExternalLink size={13} />
                  <span>Join Call</span>
                </a>
              </div>
            </div>

            {/* Razorpay Payment Button if applicable */}
            {booking && booking.id && (
              <div>
                <PaymentButton
                  bookingId={booking.id}
                  amount={booking.consultationFee || fee}
                  advocateName={booking.advocateName || advocate.name}
                  userName={clientName || session?.user?.name || 'Client'}
                  userEmail={clientEmail || session?.user?.email || ''}
                  label={`Pay ₹${booking.consultationFee || fee} via Razorpay`}
                />
              </div>
            )}

            <button 
              type="button"
              onClick={onClose}
              className="btn-primary w-full h-11 text-xs font-bold rounded-xl"
            >
              Done & Return to Workspace
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
