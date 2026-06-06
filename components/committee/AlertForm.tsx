'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AlertCategory, LocalAlert } from '@/lib/types';
import { publishAlert } from '@/lib/services/noticeboardService';

const CATEGORIES: AlertCategory[] = [
  'Crime', 'Safety', 'Load Shedding', 'Water Outage', 'Road Closure', 'Other',
];

const SEVERITIES: { value: LocalAlert['severity']; label: string; icon: string }[] = [
  { value: 'info', label: 'Info', icon: 'ℹ️' },
  { value: 'warning', label: 'Warning', icon: '⚠️' },
  { value: 'critical', label: 'Critical', icon: '🚨' },
];

interface Props {
  authorId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AlertForm({ authorId, onSuccess, onCancel }: Props) {
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<AlertCategory>('Safety');
  const [severity, setSeverity] = useState<LocalAlert['severity']>('warning');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await publishAlert({ message, category, severity, authorId });
    setLoading(false);

    if ('error' in result) {
      toast.error(result.error);
      return;
    }

    toast.success('Alert sent!');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
          Severity
        </label>
        <div className="flex gap-2">
          {SEVERITIES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSeverity(s.value)}
              className="flex-1 py-2 rounded-xl text-xs font-bold border-2 flex items-center justify-center gap-1 transition-colors"
              style={{
                borderColor: severity === s.value ? 'var(--primary)' : '#E5E7EB',
                backgroundColor: severity === s.value ? 'var(--primary-bg)' : 'white',
                color: severity === s.value ? 'var(--primary)' : '#374151',
              }}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-colors"
              style={{
                borderColor: category === c ? 'var(--primary)' : '#E5E7EB',
                backgroundColor: category === c ? 'var(--primary-bg)' : 'white',
                color: category === c ? 'var(--primary)' : '#374151',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
          Alert Message (max 280 chars)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the alert clearly and concisely…"
          required
          maxLength={280}
          rows={3}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] resize-none"
        />
        <p className="text-right text-xs text-gray-400 mt-0.5">{message.length}/280</p>
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border-2 border-gray-200 font-bold py-3 rounded-xl text-sm text-gray-600"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {loading ? 'Sending…' : '🚨 Send Alert'}
        </button>
      </div>
    </form>
  );
}
