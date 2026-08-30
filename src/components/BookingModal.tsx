'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, Clock, Video, CheckCircle2, 
  Loader2, AlertCircle, Mail, Copy, ExternalLink, ShieldCheck, User 
} from 'lucide-react';

interface Advocate {
  id: string | number;
  name: string;
  type?: string;
  specialization?: string;
  consultationFee?: number;
  rating?: number;
  email?: string;
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
  '2:00 PM',  '3:00 PM',  '4:00 PM',  '5:00 PM'
];

function getNextDays(count: number): { 
  label: string; 
  value: string; 
  day: string 
}[] {
  const days = [];
  const date = new Date();
  let added = 0;
  while (added < count) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const value = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'short' 
      });
      const day = date.toLocaleDateString('en-IN', { 
        weekday: 'short' 
      });
      days.push({ label, value, day });
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
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState(session?.user?.name || '');
  const [clientEmail, setClientEmail] = useState(session?.user?.email || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const advocate = propAdvocate || propLawyer;

  if (!isOpen || !advocate) return null;

  const days = getNextDays(7);
  const fee = advocate.consultationFee || 999;
  const effectiveUserId = propUserId || (session?.user as any)?.id || "user_placeholder";
  const effectiveMatterId = propMatterId || propCaseId || null;

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time.');
      return;
    }

    if (!session?.user && (!clientEmail || !clientEmail.includes('@'))) {
      setError('Please enter a valid email address to receive your confirmation.');
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
          userEmail: clientEmail || session?.user?.email || 'client@lexnova.in',
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
        setError(data.error || 'Booking failed. Please try again.');
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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
        }}
      >

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {step === 'form' ? 'Book Consultation' : 'Booking Confirmed!'}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {advocate.name} · {advocate.type || advocate.specialization || 'Advocate'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* FORM STEP */}
        {step === 'form' && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* If user not logged in, collect name and email for confirmation */}
            {!session?.user && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Arjun Mehta"
                    style={{ fontSize: '12.5px', padding: '8px 10px', width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{ fontSize: '12.5px', padding: '8px 10px', width: '100%' }}
                  />
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '10px',
              }}>
                <Calendar size={13} color="var(--accent)" /> Select Date
              </label>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {days.map(d => {
                  const isSelected = selectedDate === d.value;
                  return (
                    <button 
                      key={d.value}
                      onClick={() => setSelectedDate(d.value)}
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                        color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)',
                        border: isSelected ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: '10.5px', opacity: 0.7, fontWeight: '500' }}>{d.day}</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', marginTop: '2px' }}>{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '10px',
              }}>
                <Clock size={13} color="var(--accent)" /> Select Time (IST)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {TIME_SLOTS.map(t => {
                  const isSelected = selectedTime === t;
                  return (
                    <button 
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      style={{
                        padding: '9px 4px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12px',
                        fontWeight: '600',
                        textAlign: 'center',
                        background: isSelected ? 'var(--accent)' : 'var(--bg-tertiary)',
                        color: isSelected ? 'white' : 'var(--text-secondary)',
                        border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
                display: 'block',
              }}>
                Brief Case Description (Optional)
              </label>
              <textarea 
                rows={2} 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Briefly describe your legal issue so the lawyer can prepare..."
                style={{
                  width: '100%',
                  fontSize: '13px',
                  padding: '10px 12px',
                  resize: 'none',
                }}
              />
            </div>

            {/* Fee Box */}
            <div style={{
              background: 'var(--accent-subtle)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#93C5FD' }}>
                <Video size={15} color="#93C5FD" />
                Video Consultation · 60 mins
              </div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>
                ₹{fee}
              </div>
            </div>

            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12.5px',
                color: 'var(--danger)',
                background: 'var(--danger-subtle)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={onClose}
                className="btn-ghost"
                style={{ flex: 1, padding: '10px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleBook} 
                disabled={loading}
                className="btn-accent"
                style={{ flex: 2, padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {loading ? <><Loader2 size={15} className="animate-spin" /> Booking...</> : `Confirm Booking · ₹${fee}`}
              </button>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
              A confirmation email with calendar link will be sent to your registered address.
            </p>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === 'success' && booking && (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--success-subtle)',
                  border: '1px solid var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  color: 'var(--success)',
                }}
              >
                <CheckCircle2 size={30} />
              </motion.div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Booking Confirmed!
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Your appointment is locked with {booking.advocateName}
              </p>
            </div>

            {/* Confirmation Code */}
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Confirmation Code
              </p>
              <p style={{
                fontSize: '28px',
                fontWeight: '700',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                letterSpacing: '6px',
                marginTop: '6px',
              }}>
                {booking.confirmationCode}
              </p>
            </div>

            {/* Booking Details */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '12.5px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Advocate</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{booking.advocateName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date & Time</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{booking.date} @ {booking.time} IST</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Fee</span>
                <span style={{ color: 'var(--success)', fontWeight: '600' }}>₹{booking.consultationFee}</span>
              </div>
            </div>

            {/* Meet Link Box */}
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
            }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                🎥 Video Call Link
              </p>
              <p style={{ fontSize: '11.5px', color: '#60A5FA', wordBreak: 'break-all', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                {booking.meetLink}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={copyMeetLink}
                  className="btn-ghost"
                  style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Copy size={13} /> {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <a 
                  href={booking.meetLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-accent"
                  style={{ flex: 1, padding: '8px', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <ExternalLink size={13} /> Join Call
                </a>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="btn-primary"
              style={{ width: '100%', padding: '11px', fontSize: '13px' }}
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
