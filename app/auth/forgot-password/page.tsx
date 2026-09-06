'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      if (code === 'auth/user-not-found') {
        toast.error('No account found with that email address.');
      } else {
        toast.error('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-base";
  const onFocusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--primary)';
    e.target.style.boxShadow = '0 0 0 2px #e8501a33';
  };
  const onBlurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#e5e7eb';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: 'var(--primary)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <Link
          href="/auth/login"
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      <div className="px-6 py-4 text-white">
        {/* Official logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-2xl px-5 py-3 shadow-lg shadow-black/20">
            <img src="/sx7ra-logo.svg" alt="SX7RA" className="w-44 h-auto" draggable={false} />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold">Reset Password</h1>
        <p className="text-white/70 text-sm mt-1">
          {sent ? "Check your inbox" : "We'll send you a reset link"}
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-t-3xl px-6 pt-6 pb-12 shadow-xl flex-1">
        {sent ? (
          <div className="flex flex-col items-center text-center pt-6 gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: '#e8501a22' }}
            >
              <svg className="w-8 h-8" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">Email sent!</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              A password reset link has been sent to <span className="font-semibold text-gray-700">{email}</span>.
              Check your inbox and follow the link to reset your password.
            </p>
            <p className="text-gray-400 text-xs">Didn&apos;t receive it? Check your spam folder.</p>

            <Link
              href="/auth/login"
              className="mt-4 w-full text-white font-bold py-4 rounded-xl text-base text-center block"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                onFocus={onFocusStyle}
                onBlur={onBlurStyle}
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-4 rounded-xl transition-opacity text-base shadow-sm mt-2 disabled:opacity-60"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : 'Send Reset Link'}
            </button>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm">
                Remember your password?{' '}
                <Link href="/auth/login" className="font-bold" style={{ color: 'var(--primary)' }}>
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
