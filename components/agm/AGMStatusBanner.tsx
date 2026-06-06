'use client';

import { AGMWindow } from '@/lib/types';

interface Props {
  agm: AGMWindow;
}

const STATUS_CONFIG: Record<
  AGMWindow['status'],
  { icon: string; label: string; description: string; bg: string; color: string }
> = {
  upcoming: {
    icon: '📅',
    label: 'AGM Upcoming',
    description: 'Nominations open soon.',
    bg: '#E3F2FD',
    color: '#1565C0',
  },
  nominations_open: {
    icon: '📝',
    label: 'Nominations Open',
    description: 'Submit your nomination or nominate a neighbour.',
    bg: '#FFF3E0',
    color: '#E65100',
  },
  voting_open: {
    icon: '🗳',
    label: 'Voting is Open',
    description: 'Cast your vote — one vote per household.',
    bg: '#E8F5E9',
    color: '#2E7D32',
  },
  closed: {
    icon: '✅',
    label: 'AGM Closed',
    description: 'Voting has ended. Results are available below.',
    bg: '#F3E5F5',
    color: '#6A1B9A',
  },
};

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AGMStatusBanner({ agm }: Props) {
  const cfg = STATUS_CONFIG[agm.status];

  return (
    <div
      className="rounded-2xl px-4 py-3 flex items-start gap-3"
      style={{ backgroundColor: cfg.bg }}
    >
      <span className="text-2xl flex-shrink-0 mt-0.5">{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-extrabold text-sm" style={{ color: cfg.color }}>
          {cfg.label}
        </p>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: cfg.color }}>
          {cfg.description}
        </p>

        {/* Timeline chips */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {agm.status === 'upcoming' && (
            <span className="text-xs bg-white/60 rounded-full px-2 py-0.5" style={{ color: cfg.color }}>
              Nominations open: {formatDate(agm.nominationsOpenAt)}
            </span>
          )}
          {agm.status === 'nominations_open' && (
            <span className="text-xs bg-white/60 rounded-full px-2 py-0.5" style={{ color: cfg.color }}>
              Closes: {formatDate(agm.nominationsCloseAt)}
            </span>
          )}
          {agm.status === 'voting_open' && (
            <span className="text-xs bg-white/60 rounded-full px-2 py-0.5" style={{ color: cfg.color }}>
              Voting closes: {formatDate(agm.votingCloseAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
