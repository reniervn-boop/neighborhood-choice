'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAGM } from '@/lib/hooks/useAGM';
import { submitVote, checkHasVoted } from '@/lib/services/agmService';
import NominationCard from '@/components/agm/NominationCard';
import LoadingScreen from '@/components/LoadingScreen';
import { Nomination } from '@/lib/types';
import { canVoteInMeeting, getMembershipStatusSummary } from '@/lib/constitution';

export default function VotePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { agm, nominations, loading: agmLoading, refresh } = useAGM();

  // votes: { [position]: nomineeId }
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [votedPositions, setVotedPositions] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState<string | null>(null);

  if (authLoading || agmLoading) return <LoadingScreen message="Loading voting booth…" />;
  if (!user) { router.push('/auth/login'); return null; }

  // Constitution § 5.4.1: Only paying members can vote
  if (!canVoteInMeeting(user)) {
    const status = getMembershipStatusSummary(user);
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-3">{status.icon}</div>
        <p className="font-extrabold text-gray-900 mb-1">Cannot Vote</p>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          {status.status}: {status.description}
          <br />
          <br />
          Per the SX7RA Constitution § 5.4, only paying members in good standing can vote.
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

  if (!agm || agm.status !== 'voting_open') {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-3">🚫</div>
        <p className="font-extrabold text-gray-900 mb-1">Voting is not open</p>
        <p className="text-gray-500 text-sm mb-6">
          {!agm ? 'No active AGM.' : 'Voting window is not currently open.'}
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

  if (!user.physicalAddress) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-3">🏠</div>
        <p className="font-extrabold text-gray-900 mb-2">Physical address required</p>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          To vote, your physical address must be on file. This ensures one vote per household.
          Update it in your Profile settings.
        </p>
        <button
          onClick={() => router.push('/profile')}
          className="text-white font-bold px-6 py-3 rounded-xl text-sm"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Update Profile
        </button>
      </div>
    );
  }

  // Group accepted nominations by position
  const byPosition: Record<string, Nomination[]> = {};
  for (const nom of nominations.filter((n) => n.accepted === true)) {
    if (!byPosition[nom.position]) byPosition[nom.position] = [];
    byPosition[nom.position].push(nom);
  }

  const handleVote = async (position: string, nomineeId: string) => {
    if (!user.physicalAddress) return;
    setSubmitting(position);

    const alreadyVoted = await checkHasVoted(agm.id, position, user.physicalAddress);
    if (alreadyVoted) {
      toast('You have already voted for this position from your address.');
      setVotedPositions((prev) => new Set([...prev, position]));
      setSubmitting(null);
      return;
    }

    const result = await submitVote({
      agmId: agm.id,
      position,
      nomineeId,
      physicalAddress: user.physicalAddress,
    });

    setSubmitting(null);

    if ('error' in result) {
      toast.error(result.error);
      return;
    }

    toast.success(`Vote cast for ${position}!`);
    setVotedPositions((prev) => new Set([...prev, position]));
    refresh();
  };

  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.push('/agm')}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm"
        >
          ←
        </button>
        <div>
          <h1 className="font-extrabold text-gray-900">Voting Booth</h1>
          <p className="text-xs text-gray-400">{agm.title} — 1 vote per household</p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Address notice */}
        <div className="bg-blue-50 rounded-xl px-3 py-2">
          <p className="text-xs text-blue-700 font-semibold leading-relaxed">
            🏠 Voting from: <span className="font-bold">{user.physicalAddress}</span>
            <br />
            Your vote is tied to your physical address. Each address may vote once per position.
          </p>
        </div>

        {agm.positions.map((position) => {
          const posNoms = byPosition[position] ?? [];
          const hasVoted = votedPositions.has(position);
          const selected = votes[position];

          return (
            <div key={position}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-extrabold text-gray-700 text-sm uppercase tracking-wider">
                  {position}
                </h2>
                {hasVoted && (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    ✓ Voted
                  </span>
                )}
              </div>

              {posNoms.length === 0 ? (
                <p className="text-gray-400 text-xs italic">No accepted nominations.</p>
              ) : (
                <div className="space-y-2">
                  {posNoms.map((nom) => (
                    <div
                      key={nom.id}
                      onClick={() => !hasVoted && setVotes((v) => ({ ...v, [position]: nom.nomineeId }))}
                      className="cursor-pointer"
                    >
                      <div
                        className="rounded-2xl border-2 transition-colors overflow-hidden"
                        style={{
                          borderColor:
                            selected === nom.nomineeId && !hasVoted
                              ? 'var(--primary)'
                              : '#E5E7EB',
                        }}
                      >
                        <NominationCard
                          nomination={nom}
                          isVotingOpen={!hasVoted}
                          hasVoted={hasVoted}
                          onVote={() => handleVote(position, nom.nomineeId)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Confirm vote button if selection made */}
              {selected && !hasVoted && posNoms.length > 0 && (
                <button
                  onClick={() => handleVote(position, selected)}
                  disabled={submitting === position}
                  className="mt-3 w-full text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {submitting === position
                    ? 'Casting vote…'
                    : `Confirm vote for ${posNoms.find((n) => n.nomineeId === selected)?.nomineeName}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
