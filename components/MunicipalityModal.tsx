'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { auth } from '@/lib/firebase/config';
import {
  ReportSummary,
  buildMailtoLink,
  buildDialerLink,
  formatCallerScript,
  formatEmailBody,
  formatEscalationTemplate,
  getAuthorityForCategory,
} from '@/lib/services/municipalityService';
import { createSubmission } from '@/lib/services/submissionService';
import { ReportCategory } from '@/lib/types';

interface Props {
  report: ReportSummary;
  userId: string;
  onClose: () => void;
  onSubmitted?: (authorityId: string, method: string) => void;
}

export default function MunicipalityModal({ report, userId, onClose, onSubmitted }: Props) {
  const authority = getAuthorityForCategory(report.category as ReportCategory);
  const [step, setStep] = useState<'info' | 'sending' | 'done'>('info');
  const [copied, setCopied] = useState(false);

  // ── Email approach (JRA / Joburg Water) ───────────────────────────────────

  const handleSendEmail = async () => {
    setStep('sending');
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        setStep('info');
        toast('Please sign in again, then use “Open Email App” below.');
        return;
      }

      const res = await fetch('/api/submit-to-municipality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ report }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        // API not configured — fall back to mailto
        setStep('info');
        toast('Auto-email not configured. Use "Open Email App" below.');
        return;
      }

      await createSubmission({
        reportId: report.id,
        authorityId: authority.id,
        authorityName: authority.name,
        method: 'email',
        submittedAt: Date.now(),
        submittedBy: userId,
        emailTo: authority.email,
        resendEmailId: data.emailId,
        status: 'pending_reference',
      });

      setStep('done');
      onSubmitted?.(authority.id, 'email');
      toast.success(`Email sent to ${authority.shortName} ✓`);
    } catch {
      setStep('info');
      toast('Could not send automatically — use "Open Email App" instead.');
    }
  };

  const handleMailtoClick = async () => {
    await createSubmission({
      reportId: report.id,
      authorityId: authority.id,
      authorityName: authority.name,
      method: 'mailto',
      submittedAt: Date.now(),
      submittedBy: userId,
      emailTo: authority.email,
      status: 'pending_reference',
    });
    onSubmitted?.(authority.id, 'mailto');
    setStep('done');
  };

  // ── Dialer approach (JMPD / City Power / City Parks) ─────────────────────

  const handleDialerClick = async () => {
    await createSubmission({
      reportId: report.id,
      authorityId: authority.id,
      authorityName: authority.name,
      method: 'dialer',
      submittedAt: Date.now(),
      submittedBy: userId,
      status: 'pending_reference',
    });
    onSubmitted?.(authority.id, 'dialer');
    setStep('done');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    toast.success(`${label} copied!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90dvh] overflow-y-auto sheet-safe">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{authority.icon}</span>
            <div>
              <h2 className="font-extrabold text-gray-900 leading-tight">{authority.shortName}</h2>
              <p className="text-xs text-gray-400">{authority.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-8 pt-4 space-y-4">
          {/* Report summary chip */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-0.5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Report</p>
            <p className="font-semibold text-gray-900 text-sm">{report.title}</p>
            <p className="text-xs text-gray-400">
              {report.category} · {report.location.address || `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
            </p>
          </div>

          {/* ── DONE ───────────────────────────────────────────── */}
          {step === 'done' && (
            <div className="text-center py-6">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="font-extrabold text-gray-900 mb-1">Submission logged!</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Your report has been forwarded to {authority.shortName}.
                When they reply with a reference number you can add it to the report.
              </p>
              <button
                onClick={onClose}
                className="w-full text-white font-bold py-3 rounded-xl"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Done
              </button>
            </div>
          )}

          {/* ── SENDING ────────────────────────────────────────── */}
          {step === 'sending' && (
            <div className="text-center py-10">
              <div
                className="inline-block w-10 h-10 rounded-full border-4 border-t-transparent animate-spin mb-4"
                style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}
              />
              <p className="text-gray-500 text-sm">Sending email to {authority.email}…</p>
            </div>
          )}

          {/* ── EMAIL method (JRA / Joburg Water) ──────────────── */}
          {step === 'info' && authority.method === 'email' && (
            <>
              <div className="rounded-xl p-3" style={{ backgroundColor: '#FFF3E0' }}>
                <p className="font-semibold text-sm" style={{ color: '#E65100' }}>📧 Email submission</p>
                <p className="text-gray-600 mt-0.5 text-xs leading-relaxed">{authority.methodNote}</p>
              </div>

              {/* Auto-send via Resend */}
              <button
                onClick={handleSendEmail}
                className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Automatically
              </button>

              <div className="relative flex items-center">
                <div className="flex-1 border-t border-gray-200" />
                <span className="px-3 text-xs text-gray-400 font-medium">or</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              {/* Mailto fallback */}
              <a
                href={buildMailtoLink(report, authority)}
                onClick={handleMailtoClick}
                className="block w-full text-center border-2 font-bold py-3.5 rounded-xl text-sm"
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
              >
                Open in Email App
              </a>

              <button
                onClick={() => copyToClipboard(formatEmailBody(report, authority), 'Email body')}
                className="w-full text-gray-500 border border-gray-200 font-semibold py-2.5 rounded-xl text-sm bg-white"
              >
                {copied ? '✓ Copied!' : 'Copy email content'}
              </button>

              {/* Also show portal link if available */}
              {authority.portalUrl && (
                <a
                  href={authority.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center border border-gray-200 font-semibold py-2.5 rounded-xl text-sm text-gray-600"
                >
                  {authority.portalLabel ?? 'Open Self-Service Portal'} ↗
                </a>
              )}

              <p className="text-xs text-gray-400 text-center">
                Will be sent to <span className="font-semibold">{authority.email}</span>
                {authority.phoneAlt && (
                  <span> · Also call <span className="font-semibold">{authority.phoneAlt}</span></span>
                )}
              </p>
            </>
          )}

          {/* ── DIALER method (JMPD / City Power / City Parks) ── */}
          {step === 'info' && authority.method === 'dialer' && (
            <>
              <div className="rounded-xl p-3" style={{ backgroundColor: '#E8F5E9' }}>
                <p className="font-semibold text-green-800 text-sm">📞 Phone report</p>
                <p className="text-gray-600 mt-0.5 text-xs leading-relaxed">{authority.methodNote}</p>
              </div>

              {/* Pre-formatted caller script (includes escalation template) */}
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your script</p>
                  <button
                    onClick={() => copyToClipboard(formatCallerScript(report), 'Script')}
                    className="text-xs font-bold"
                    style={{ color: 'var(--primary)' }}
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-mono whitespace-pre-wrap">
                  {formatCallerScript(report)}
                </p>
              </div>

              {/* Copy escalation template separately */}
              <button
                onClick={() => copyToClipboard(formatEscalationTemplate(report), 'Escalation template')}
                className="w-full border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm bg-white"
              >
                📋 Copy Escalation Template
              </button>

              {/* Self-service portal (City Power / Joburg Water) */}
              {authority.portalUrl && (
                <a
                  href={authority.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center border-2 font-bold py-3 rounded-xl text-sm"
                  style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  {authority.portalLabel ?? 'Open Self-Service Portal'} ↗
                </a>
              )}

              {/* Dial button — shows the human-readable number */}
              <a
                href={buildDialerLink(authority)}
                onClick={handleDialerClick}
                className="block w-full text-center text-white font-bold py-3.5 rounded-xl text-sm"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                📞 Call {authority.phoneAlt ?? authority.phone}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
