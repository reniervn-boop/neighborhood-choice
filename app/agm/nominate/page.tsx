'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAGM } from '@/lib/hooks/useAGM';
import { submitNomination } from '@/lib/services/agmService';
import LoadingScreen from '@/components/LoadingScreen';
import { canStandForCommittee, getMembershipStatusSummary } from '@/lib/constitution';

export default function NominatePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { agm, loading: agmLoading, refresh } = useAGM();

  const [position, setPosition] = useState('');
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeUnitBlock, setNomineeUnitBlock] = useState('');
  const [motivation, setMotivation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authLoading || agmLoading) return <LoadingScreen message="Loading…" />;
  if (!user) { router.push('/auth/login'); return null; }

  // Constitution § 6.2.4: Only paying members can stand for committee
  if (!canStandForCommittee(user)) {
    const status = getMembershipStatusSummary(user);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-3">{status.icon}</div>
        <p className="font-extrabold text-gray-900 mb-1">Cannot Stand for Office</p>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          {status.status}: {status.description}
          <br />
          <br />
          Per the SX7RA Constitution § 6.2.4, only paying members in good standing can stand for committee election.
        </p>
        <div className="space-y-2 w-full">
          <button
            onClick={() => router.push('/constitution')}
            className="w-full text-white font-bold px-6 py-3 rounded-xl text-sm"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            📋 Read Constitution
          </button>
          <button
            onClick={() => router.push('/agm')}
            className="w-full text-gray-900 font-bold px-6 py-3 rounded-xl text-sm border border-gray-300"
          >
            Back to AGM
          </button>
        </div>
      </div>
    );
  }

  if (!agm || agm.status !== 'nominations_open') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-3">🚫</div>
        <p className="font-extrabold text-gray-900 mb-1">Nominations are closed</p>
        <p className="text-gray-500 text-sm mb-6">
          {!agm ? 'No active AGM.' : 'The nomination window has ended.'}
        </p>
        <button
          onClick={() => router.push('/agm')}
          className="text-white font-bold px-6 py-3 rounded-xl text-sm"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Back to AGM
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await submitNomination({
      agmId: agm.id,
      position,
      nomineeId: `manual_${Date.now()}`, // residents nominated by name rather than uid
      nomineeName: nomineeName.trim(),
      nomineeUnitBlock: nomineeUnitBlock.trim(),
      motivation: motivation.trim(),
      submittedBy: user.uid,
      availablePositions: agm.positions,
    });

    setSubmitting(false);

    if ('error' in result) {
      toast.error(result.error);
      return;
    }

    toast.success('Nomination submitted!');
    refresh();
    router.push('/agm');
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.push('/agm')}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm"
        >
          ←
        </button>
        <div>
          <h1 className="font-extrabold text-gray-900">Submit Nomination</h1>
          <p className="text-xs text-gray-400">{agm.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-5 space-y-4">
        {/* Position */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Position
          </label>
          <div className="space-y-2">
            {agm.positions.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPosition(p)}
                className="w-full text-left px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-colors"
                style={{
                  borderColor: position === p ? 'var(--primary)' : '#E5E7EB',
                  backgroundColor: position === p ? 'var(--primary-bg)' : 'white',
                  color: position === p ? 'var(--primary)' : '#374151',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Nominee details */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Nominee's Full Name
          </label>
          <input
            type="text"
            value={nomineeName}
            onChange={(e) => setNomineeName(e.target.value)}
            placeholder="e.g. Jane Smith"
            required
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Unit / Block
          </label>
          <input
            type="text"
            value={nomineeUnitBlock}
            onChange={(e) => setNomineeUnitBlock(e.target.value)}
            placeholder="e.g. Unit 4B"
            required
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Motivation (min 20 characters)
          </label>
          <textarea
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            placeholder="Why should this person serve in this role?"
            required
            rows={4}
            maxLength={500}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] resize-none"
          />
          <p className="text-right text-xs text-gray-400 mt-0.5">{motivation.length}/500</p>
        </div>

        <button
          type="submit"
          disabled={submitting || !position}
          className="w-full text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {submitting ? 'Submitting…' : 'Submit Nomination'}
        </button>
      </form>
    </div>
  );
}
