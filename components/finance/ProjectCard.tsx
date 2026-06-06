'use client';

import { CommunityProject } from '@/lib/types';
import { formatZAR, fundingPercent } from '@/lib/validation/financeValidation';

const CATEGORY_ICONS: Record<CommunityProject['category'], string> = {
  Security: '🔒',
  Infrastructure: '🏗',
  Landscaping: '🌿',
  Events: '🎉',
  Maintenance: '🔧',
  Other: '📦',
};

const STATUS_BADGE: Record<
  CommunityProject['status'],
  { label: string; bg: string; color: string }
> = {
  active: { label: 'Active', bg: '#E8F5E9', color: '#2E7D32' },
  funded: { label: 'Funded 🎉', bg: '#E3F2FD', color: '#1565C0' },
  completed: { label: 'Completed ✓', bg: '#F3E5F5', color: '#6A1B9A' },
  cancelled: { label: 'Cancelled', bg: '#ECEFF1', color: '#546E7A' },
};

interface Props {
  project: CommunityProject;
  onDonate?: () => void;
}

export default function ProjectCard({ project, onDonate }: Props) {
  const percent = fundingPercent(project.raisedAmountCents, project.targetAmountCents);
  const badge = STATUS_BADGE[project.status];
  const icon = CATEGORY_ICONS[project.category];
  const canDonate = project.status === 'active';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Cover image or colour band */}
      {project.coverImageUrl ? (
        <img
          src={project.coverImageUrl}
          alt={project.title}
          className="w-full h-28 object-cover"
        />
      ) : (
        <div
          className="w-full h-14 flex items-center justify-center text-3xl"
          style={{ backgroundColor: 'var(--primary-bg)' }}
        >
          {icon}
        </div>
      )}

      <div className="p-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-extrabold text-gray-900 text-sm leading-snug flex-1">
            {project.title}
          </h3>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
          {project.description}
        </p>

        {/* Progress bar */}
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-bold text-gray-700">
            {formatZAR(project.raisedAmountCents)} raised
          </span>
          <span className="text-gray-400">
            of {formatZAR(project.targetAmountCents)} ({percent}%)
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${percent}%`,
              backgroundColor: percent >= 100 ? '#2E7D32' : 'var(--primary)',
            }}
          />
        </div>

        {/* Donate button */}
        {canDonate && onDonate && (
          <button
            onClick={onDonate}
            className="mt-4 w-full text-white font-bold py-3 rounded-xl text-sm"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            💛 Donate Now
          </button>
        )}
      </div>
    </div>
  );
}
