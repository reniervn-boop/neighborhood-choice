'use client';

import { useState } from 'react';
import { CommunityProject, PaymentMethod } from '@/lib/types';
import { formatZAR } from '@/lib/validation/financeValidation';
import { getPaymentConfig } from '@/lib/services/financeService';
import { toast } from 'react-hot-toast';
import { auth } from '@/lib/firebase/config';

const METHOD_LABELS: Record<PaymentMethod, { label: string; icon: string; description: string }> = {
  payfast: { label: 'PayFast', icon: '💳', description: 'Credit card, EFT, SnapScan & more' },
  snapscan: { label: 'SnapScan', icon: '📷', description: 'Scan QR code in the SnapScan app' },
  stitch: { label: 'Stitch Pay', icon: '🏦', description: 'Instant EFT via banking app' },
  eft: { label: 'Manual EFT', icon: '📋', description: 'Transfer directly to our bank account' },
};

const PRESET_AMOUNTS = [100, 250, 500, 1000];

interface Props {
  project: CommunityProject;
  donorName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PaymentMethodSheet({
  project,
  donorName,
  onClose,
  onSuccess,
}: Props) {
  const [amountRand, setAmountRand] = useState<string>('');
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'amount' | 'method' | 'eft'>('amount');
  const [eftDetails, setEftDetails] = useState<Record<string, string> | null>(null);

  const cents = Math.round(parseFloat(amountRand || '0') * 100);
  const isValidAmount = cents >= 100;

  const handleProceed = async () => {
    if (!method || !isValidAmount) return;
    setLoading(true);

    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        toast.error('Your session has expired — please sign in again.');
        return;
      }

      // Create pending donation record. The server takes the donor's identity
      // from the token, not from this body.
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          projectId: project.id,
          amountCents: cents,
          method,
          anonymous,
          donorDisplayName: anonymous ? undefined : donorName,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.id) {
        toast.error(data.error ?? 'Could not initiate payment.');
        return;
      }

      if (method === 'eft') {
        const config = getPaymentConfig(method, project, cents, data.id);
        setEftDetails(config);
        setStep('eft');
        return;
      }

      if (method === 'snapscan') {
        const config = getPaymentConfig(method, project, cents, data.id);
        // Redirect to SnapScan deep link
        const snapUrl = `https://pos.snapscan.io/qr/${config.snapCode}?id=${data.id}&amount=${cents}`;
        window.open(snapUrl, '_blank');
        toast.success('Opening SnapScan…');
        onSuccess?.();
        onClose();
        return;
      }

      if (method === 'payfast') {
        const config = getPaymentConfig(method, project, cents, data.id);
        // Build PayFast form and submit
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://sandbox.payfast.co.za/eng/process'; // switch to live in prod
        Object.entries(config).forEach(([k, v]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = k;
          input.value = v;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        return;
      }

      // Stitch — open redirect URL
      if (method === 'stitch') {
        window.open(`/api/payments/stitch?donationId=${data.id}&amount=${cents}`, '_blank');
        toast.success('Opening Stitch Pay…');
        onSuccess?.();
        onClose();
        return;
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90dvh] overflow-y-auto sheet-safe">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-5 pb-8 pt-2 space-y-4">
          <div>
            <h2 className="font-extrabold text-gray-900 text-lg">Donate to Project</h2>
            <p className="text-sm text-gray-500">{project.title}</p>
          </div>

          {/* ── EFT Details ── */}
          {step === 'eft' && eftDetails && (
            <>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  EFT Bank Details
                </p>
                {Object.entries(eftDetails).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-500 capitalize">{k.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const text = Object.entries(eftDetails!)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join('\n');
                  navigator.clipboard.writeText(text);
                  toast.success('Bank details copied!');
                }}
                className="w-full border border-gray-200 font-bold py-3 rounded-xl text-sm text-gray-700"
              >
                📋 Copy Bank Details
              </button>
              <button
                onClick={() => { onSuccess?.(); onClose(); }}
                className="w-full text-white font-bold py-3 rounded-xl text-sm"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Done — I&rsquo;ve made the transfer
              </button>
            </>
          )}

          {/* ── Amount Step ── */}
          {step === 'amount' && (
            <>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Choose amount (ZAR)
                </p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {PRESET_AMOUNTS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setAmountRand(String(r))}
                      className="py-2 rounded-xl text-sm font-bold border-2 transition-colors"
                      style={{
                        borderColor:
                          amountRand === String(r) ? 'var(--primary)' : '#E5E7EB',
                        backgroundColor:
                          amountRand === String(r) ? 'var(--primary-bg)' : 'white',
                        color:
                          amountRand === String(r) ? 'var(--primary)' : '#374151',
                      }}
                    >
                      R{r}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                    R
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={amountRand}
                    onChange={(e) => setAmountRand(e.target.value)}
                    placeholder="Other amount"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded accent-[var(--primary)]"
                />
                <span className="text-sm text-gray-600">Donate anonymously</span>
              </label>

              <button
                onClick={() => setStep('method')}
                disabled={!isValidAmount}
                className="w-full text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Continue — {isValidAmount ? formatZAR(cents) : 'Enter amount'}
              </button>
            </>
          )}

          {/* ── Method Step ── */}
          {step === 'method' && (
            <>
              <button
                onClick={() => setStep('amount')}
                className="text-xs text-gray-400 font-semibold flex items-center gap-1"
              >
                ← Back
              </button>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Payment method
              </p>

              {project.paymentMethods.map((m) => {
                const info = METHOD_LABELS[m];
                return (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className="w-full text-left border-2 rounded-xl p-3 flex items-center gap-3 transition-colors"
                    style={{
                      borderColor: method === m ? 'var(--primary)' : '#E5E7EB',
                      backgroundColor: method === m ? 'var(--primary-bg)' : 'white',
                    }}
                  >
                    <span className="text-xl">{info.icon}</span>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{info.label}</p>
                      <p className="text-xs text-gray-500">{info.description}</p>
                    </div>
                    {method === m && (
                      <span className="ml-auto text-sm" style={{ color: 'var(--primary)' }}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={handleProceed}
                disabled={!method || loading}
                className="w-full text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {loading ? 'Processing…' : `Pay ${formatZAR(cents)} via ${method ? METHOD_LABELS[method].label : '…'}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
