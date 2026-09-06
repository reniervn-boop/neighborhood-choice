import Link from 'next/link';
import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import { roleDescriptions } from '@/lib/data/governance/roles';

export const metadata: Metadata = {
  title: 'Role descriptions — SX7RA',
  description:
    'What each elected and appointed office in the Sundowner Ext. 7 Residents Association is responsible for.',
};

const BODY_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  board: { label: 'Board', color: '#1d4ed8', bg: '#dbeafe' },
  committee: { label: 'Committee', color: '#b45309', bg: '#fef3c7' },
  both: { label: 'Board + Committee', color: '#15803d', bg: '#dcfce7' },
};

export default function RolesPage() {
  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="Role descriptions" showBack backHref="/governance" />

      <div className="px-4 py-5 max-w-2xl mx-auto">
        <p className="text-gray-500 text-sm mb-4">
          Eight roles make up the Board of Directors and the Operations Committee.
          Each description sets out who the role reports to, how it is filled, how
          long it runs and what it is accountable for.
        </p>

        <div
          className="rounded-2xl p-3 mb-5 border border-gray-200 bg-white"
        >
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong className="text-gray-900">Standing for election?</strong> Nominations
            open 30 days before the AGM and close 14 days before it. Read the role you
            are interested in first — several carry duties that are not obvious from the
            title.
          </p>
        </div>

        <div className="space-y-2">
          {roleDescriptions.map((role) => {
            const badge = BODY_LABEL[role.body];
            return (
              <Link
                key={role.slug}
                href={`/governance/roles/${role.slug}`}
                className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 transition-transform active:scale-[0.98]"
              >
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                  style={{ backgroundColor: 'var(--primary-bg)' }}
                  aria-hidden="true"
                >
                  {role.emoji}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{role.title}</span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ color: badge.color, backgroundColor: badge.bg }}
                    >
                      {badge.label}
                    </span>
                  </span>
                  <span className="block text-gray-400 text-xs mt-0.5">{role.blurb}</span>
                </span>
                <svg
                  className="w-5 h-5 text-gray-300 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>

        <p className="text-gray-400 text-xs mt-5 leading-relaxed">
          Roles are allocated by the Committee at its first meeting after the AGM, except
          Chairperson and Financial Director, which the Board allocates from among the
          Directors (Constitution cl. 6.5.6).
        </p>
      </div>
    </div>
  );
}
