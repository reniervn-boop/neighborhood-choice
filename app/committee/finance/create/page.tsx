'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/hooks/useAuth';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';
import { createCommunityProject } from '@/lib/services/financeService';
import { CommunityProject, PaymentMethod } from '@/lib/types';

const CATEGORIES: CommunityProject['category'][] = [
  'Security', 'Infrastructure', 'Landscaping', 'Events', 'Maintenance', 'Other',
];
const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'payfast', label: 'PayFast' },
  { value: 'snapscan', label: 'SnapScan' },
  { value: 'stitch', label: 'Stitch' },
  { value: 'eft', label: 'EFT' },
];

export default function CreateProjectPage() {
  const router = useRouter();
  const { user, isCommittee, loading } = useAuth();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Security' as CommunityProject['category'],
    targetRand: '',
    scope: '',
    durationDays: '',
    startDate: '',
    endDate: '',
  });
  const [methods, setMethods] = useState<PaymentMethod[]>(['eft']);
  const [saving, setSaving] = useState(false);

  if (loading) return <LoadingScreen message="Loading…" />;
  if (!user || !isCommittee) {
    router.push('/');
    return null;
  }

  const toggleMethod = (m: PaymentMethod) =>
    setMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const handleSave = async () => {
    const targetCents = Math.round(parseFloat(form.targetRand || '0') * 100);
    if (!form.title.trim() || form.description.trim().length < 20) {
      toast.error('Title and a description (20+ chars) are required');
      return;
    }
    setSaving(true);
    const res = await createCommunityProject({
      title: form.title,
      description: form.description,
      category: form.category,
      targetAmountCents: targetCents,
      paymentMethods: methods,
      createdBy: user.uid,
      scope: form.scope || undefined,
      estimatedDurationDays: form.durationDays ? parseInt(form.durationDays, 10) : undefined,
      startDate: form.startDate ? new Date(form.startDate).getTime() : undefined,
      endDate: form.endDate ? new Date(form.endDate).getTime() : undefined,
    });
    setSaving(false);
    if ('error' in res) {
      toast.error(res.error);
      return;
    }
    toast.success('Project created');
    router.push('/finance');
  };

  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="New Project" showBack backHref="/committee" />
      <div className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 py-5 space-y-4">
        <Field label="Title" required>
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Speed Hump Installation — Acacia Rd"
            className="inp" />
        </Field>
        <Field label="Description" required>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3} placeholder="What is this project and why does it matter?" className="inp resize-none" />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as CommunityProject['category'] }))} className="inp">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Funding target (Rand)" required>
          <input type="number" inputMode="decimal" value={form.targetRand}
            onChange={(e) => setForm((f) => ({ ...f, targetRand: e.target.value }))}
            placeholder="e.g. 15000" className="inp" />
        </Field>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Planning (optional)</p>
          <Field label="Scope of work">
            <textarea value={form.scope} onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
              rows={2} placeholder="Deliverables, what's included…" className="inp resize-none" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date">
              <input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className="inp" />
            </Field>
            <Field label="End date">
              <input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="inp" />
            </Field>
          </div>
          <Field label="Estimated duration (days)">
            <input type="number" inputMode="numeric" value={form.durationDays}
              onChange={(e) => setForm((f) => ({ ...f, durationDays: e.target.value }))} placeholder="e.g. 30" className="inp" />
          </Field>
        </div>

        <Field label="Payment methods">
          <div className="flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <button key={m.value} type="button" onClick={() => toggleMethod(m.value)}
                className="px-3 py-1.5 rounded-full text-xs font-bold border-2"
                style={{
                  borderColor: methods.includes(m.value) ? 'var(--primary)' : '#e5e7eb',
                  backgroundColor: methods.includes(m.value) ? 'var(--primary-bg)' : 'white',
                  color: methods.includes(m.value) ? 'var(--primary)' : '#6b7280',
                }}>
                {m.label}
              </button>
            ))}
          </div>
        </Field>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3.5 rounded-xl text-white font-bold text-sm disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary)' }}>
          {saving ? 'Creating…' : 'Create Project'}
        </button>
      </div>

      <style jsx>{`
        :global(.inp) {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #111827;
          outline: none;
        }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span style={{ color: 'var(--primary)' }}>*</span>}
      </label>
      {children}
    </div>
  );
}
