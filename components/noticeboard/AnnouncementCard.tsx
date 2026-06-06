'use client';

import { Announcement } from '@/lib/types';

const CATEGORY_COLORS: Record<Announcement['category'], { stripe: string; badge: string; text: string }> = {
  General:     { stripe: '#607D8B', badge: '#EFF2F3', text: '#455A64' },
  Security:    { stripe: '#C62828', badge: '#FFEBEE', text: '#C62828' },
  Maintenance: { stripe: '#E65100', badge: '#FFF3E0', text: '#E65100' },
  Event:       { stripe: '#6A1B9A', badge: '#F3E5F5', text: '#6A1B9A' },
  Finance:     { stripe: '#1565C0', badge: '#E3F2FD', text: '#1565C0' },
  Governance:  { stripe: '#060709', badge: '#F3F3F3', text: '#060709' },
};

interface Props {
  announcement: Announcement;
  onClick?: () => void;
}

export default function AnnouncementCard({ announcement, onClick }: Props) {
  const colors = CATEGORY_COLORS[announcement.category] ?? CATEGORY_COLORS.General;
  const isGovernance = announcement.category === 'Governance';

  const date = new Date(announcement.publishedAt).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      style={{ backgroundColor: isGovernance ? 'var(--brand-black)' : 'white' }}
    >
      {/* Category stripe */}
      <div className="h-1.5 w-full" style={{ backgroundColor: colors.stripe }} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={
              isGovernance
                ? { backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }
                : { backgroundColor: colors.badge, color: colors.text }
            }
          >
            {announcement.category}
          </span>
          {announcement.isPinned && (
            <span className={`text-xs font-medium ${isGovernance ? 'text-white/50' : 'text-gray-400'}`}>
              📌 Pinned
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-extrabold text-sm leading-snug mb-1"
          style={{ color: isGovernance ? 'white' : 'var(--brand-black)' }}
        >
          {announcement.title}
        </h3>

        {/* SX7RA wordmark watermark for Governance */}
        {isGovernance && (
          <p
            className="font-display text-4xl font-bold leading-none mb-2 select-none"
            style={{
              fontFamily: 'var(--font-anton), Impact, sans-serif',
              color: 'rgba(255,255,255,0.06)',
            }}
          >
            SX<span style={{ color: 'rgba(213,32,39,0.15)' }}>7</span>RA
          </p>
        )}

        {/* Plain-text preview */}
        <p
          className="text-xs leading-relaxed line-clamp-2"
          style={{ color: isGovernance ? 'rgba(255,255,255,0.6)' : '#6B7280' }}
        >
          {announcement.bodyText.slice(0, 120)}
          {announcement.bodyText.length > 120 ? '…' : ''}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span
            className="text-xs"
            style={{ color: isGovernance ? 'rgba(255,255,255,0.45)' : '#9CA3AF' }}
          >
            {announcement.authorName}
          </span>
          <span
            className="text-xs"
            style={{ color: isGovernance ? 'rgba(255,255,255,0.45)' : '#9CA3AF' }}
          >
            {date}
          </span>
        </div>

        {announcement.attachments.length > 0 && (
          <div className="mt-2">
            <span
              className="text-xs"
              style={{ color: isGovernance ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}
            >
              📎 {announcement.attachments.length} attachment
              {announcement.attachments.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
