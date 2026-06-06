'use client';

import { User } from '@/lib/types';
import { getMembershipStatusSummary, daysUntilFeeDue, isFeeOverdue } from '@/lib/constitution';

interface MembershipStatusProps {
  user: User | null;
}

export default function MembershipStatus({ user }: MembershipStatusProps) {
  if (!user) return null;

  const status = getMembershipStatusSummary(user);
  const daysLeft = daysUntilFeeDue(user);
  const isOverdue = isFeeOverdue(user);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className="px-4 py-3 text-white"
        style={{
          backgroundColor:
            status.isGoodStanding ? 'var(--primary)' : 'var(--brand-black)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm">Membership Status</h3>
            <p className="text-xs text-white/70 mt-0.5">
              SX7RA Constitution Compliance
            </p>
          </div>
          <div className="text-3xl">{status.icon}</div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Status Badge */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Status
          </p>
          <div
            className={`inline-block px-3 py-2 rounded-lg text-sm font-semibold ${
              status.isGoodStanding
                ? 'bg-green-50 text-green-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {status.status}
          </div>
          {status.description && (
            <p className="text-xs text-gray-600 mt-2">{status.description}</p>
          )}
        </div>

        {/* Voting & Office Rights */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Rights & Privileges
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`text-lg ${status.canVote ? '✓' : '✗'}`}
                style={{
                  color: status.canVote
                    ? 'var(--primary)'
                    : 'var(--brand-black)',
                }}
              >
                {status.canVote ? '✓' : '✗'}
              </span>
              <span className={status.canVote ? 'text-gray-900' : 'text-gray-500'}>
                Can vote in AGM/General Meetings
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`text-lg ${status.canStandForOffice ? '✓' : '✗'}`}
                style={{
                  color: status.canStandForOffice
                    ? 'var(--primary)'
                    : 'var(--brand-black)',
                }}
              >
                {status.canStandForOffice ? '✓' : '✗'}
              </span>
              <span
                className={status.canStandForOffice ? 'text-gray-900' : 'text-gray-500'}
              >
                Can stand for committee election
              </span>
            </div>
          </div>
        </div>

        {/* Fee Status */}
        {user.membershipStatus === 'paying' && user.feeDueDate && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Annual Fee
            </p>
            {daysLeft > 0 ? (
              <div
                className={`p-3 rounded-lg ${
                  daysLeft <= 7 ? 'bg-amber-50' : 'bg-green-50'
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    daysLeft <= 7 ? 'text-amber-700' : 'text-green-700'
                  }`}
                >
                  Due in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Payment due annually on March 1st
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-red-50">
                <p className="text-sm font-semibold text-red-700">Overdue</p>
                <p className="text-xs text-gray-600 mt-1">
                  Please pay your annual membership fee to restore voting rights
                </p>
              </div>
            )}
          </div>
        )}

        {/* Suspension Info */}
        {user.membershipStatus === 'suspended' && user.suspensionReason && (
          <div className="p-3 rounded-lg bg-red-50">
            <p className="text-xs font-semibold text-red-700 uppercase tracking-widest mb-1">
              Suspension Reason
            </p>
            <p className="text-sm text-red-700">{user.suspensionReason}</p>
          </div>
        )}

        {/* Expulsion Info */}
        {user.membershipStatus === 'expelled' && user.suspensionReason && (
          <div className="p-3 rounded-lg bg-red-50">
            <p className="text-xs font-semibold text-red-700 uppercase tracking-widest mb-1">
              Expulsion Reason
            </p>
            <p className="text-sm text-red-700">{user.suspensionReason}</p>
            <p className="text-xs text-red-600 mt-2">
              Per Constitution § 5.6, you may appeal to the next General Meeting.
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-xs text-blue-900">
            <strong>Membership</strong> is voluntary and governed by the SX7RA Constitution.
            See the{' '}
            <a href="/constitution" className="underline font-semibold">
              full constitution
            </a>{' '}
            for details.
          </p>
        </div>
      </div>
    </div>
  );
}
