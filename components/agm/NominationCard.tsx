'use client';

import { Nomination } from '@/lib/types';

interface Props {
  nomination: Nomination;
  voteCount?: number;
  showVoteCount?: boolean;
  onVote?: () => void;
  hasVoted?: boolean;
  isVotingOpen?: boolean;
}

export default function NominationCard({
  nomination,
  voteCount,
  showVoteCount,
  onVote,
  hasVoted,
  isVotingOpen,
}: Props) {
  const acceptedBadge =
    nomination.accepted === true
      ? { label: 'Accepted', bg: '#E8F5E9', color: '#2E7D32' }
      : nomination.accepted === false
      ? { label: 'Declined', bg: '#FFEBEE', color: '#C62828' }
      : { label: 'Pending', bg: '#FFF3E0', color: '#E65100' };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-extrabold text-gray-900 text-sm">{nomination.nomineeName}</p>
          <p className="text-xs text-gray-400">{nomination.nomineeUnitBlock}</p>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: acceptedBadge.bg, color: acceptedBadge.color }}
        >
          {acceptedBadge.label}
        </span>
      </div>

      {/* Motivation */}
      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
        {nomination.motivation}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        {showVoteCount && voteCount !== undefined && (
          <span className="text-xs font-bold text-gray-500">
            🗳 {voteCount} vote{voteCount !== 1 ? 's' : ''}
          </span>
        )}

        {isVotingOpen && nomination.accepted === true && onVote && (
          <button
            onClick={onVote}
            disabled={hasVoted}
            className="text-xs font-bold px-4 py-2 rounded-xl text-white disabled:opacity-50 ml-auto"
            style={{ backgroundColor: hasVoted ? '#9E9E9E' : 'var(--primary)' }}
          >
            {hasVoted ? '✓ Voted' : 'Vote'}
          </button>
        )}
      </div>
    </div>
  );
}
