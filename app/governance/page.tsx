import Link from 'next/link';
import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import { roleDescriptions } from '@/lib/data/governance/roles';

export const metadata: Metadata = {
  title: 'Governance — SX7RA',
  description:
    'The founding documents of the Sundowner Ext. 7 Residents Association: Constitution, MOI, role descriptions and the area of jurisdiction.',
};

/**
 * The Constitution and MOI blurbs are literals rather than reads off the
 * document modules: importing those pulls ~150KB of clause text into this
 * page just to render a section count. Update them when a document version
 * changes — the reader pages remain the source of truth.
 */
interface HubItem {
  href: string;
  emoji: string;
  title: string;
  description: string;
  meta: string;
}

const ITEMS: HubItem[] = [
  {
    href: '/constitution',
    emoji: '📜',
    title: 'Constitution',
    description:
      'How the Association is set up and run: who may join, how members vote, ' +
      'how the Board and Operations Committee are elected, how meetings work, ' +
      'and how money is handled.',
    meta: 'v2.13.A · 18 sections',
  },
  {
    href: '/governance/moi',
    emoji: '🏛️',
    title: 'Memorandum of Incorporation',
    description:
      'The Association’s registered company document, filed with the CIPC. It ' +
      'outranks the Constitution wherever the two conflict, and sets the ' +
      'membership classes, meeting quorums and Board rules under the Companies Act.',
    meta: 'Amended and restated · 25 sections',
  },
  {
    href: '/governance/roles',
    emoji: '👥',
    title: 'Role descriptions',
    description:
      'What the Chairperson, Treasurer, Secretary, Directors and each portfolio ' +
      'holder are actually accountable for.',
    meta: `${roleDescriptions.length} roles`,
  },
  {
    href: '/governance/jurisdiction',
    emoji: '🗺️',
    title: 'Area of jurisdiction',
    description:
      'The suburb boundary in clause 2 of the Constitution, with Surveyor-General ' +
      'cadastral maps showing erf numbers.',
    meta: 'Annexure A · 6 maps',
  },
  {
    href: '/documents',
    emoji: '📁',
    title: 'Document library',
    description:
      'Minutes, BOD decisions, financial statements, project reports and templates ' +
      'published by the committee.',
    meta: 'Updated by the committee',
  },
  {
    href: '/agm',
    emoji: '🗳',
    title: 'AGM & voting',
    description:
      'Nominations, ballots and results — run against the rules in the Constitution.',
    meta: 'Members in good standing',
  },
];

export default function GovernancePage() {
  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="Governance" showBack backHref="/" />

      <div className="px-4 py-5 max-w-2xl mx-auto">
        <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: 'var(--brand-black)' }}>
          <p className="font-extrabold text-white text-sm">
            Sundowner Extension 7 Residents Association NPC
          </p>
          <p className="text-white/60 text-xs mt-1 leading-relaxed">
            Registration 2017/337616/08 · A non-profit company with members, registered
            under the Companies Act 71 of 2008.
          </p>
          <p className="text-white/40 text-[11px] mt-2 leading-relaxed">
            Membership is voluntary. The Association is not a homeowners’ association,
            body corporate or estate, and has no authority over private property.
          </p>
        </div>

        <div className="space-y-2">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 transition-transform active:scale-[0.98]"
            >
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ backgroundColor: 'var(--primary-bg)' }}
                aria-hidden="true"
              >
                {item.emoji}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-gray-900 text-sm">{item.title}</span>
                <span className="block text-gray-500 text-xs mt-1 leading-relaxed">
                  {item.description}
                </span>
                <span className="block text-gray-400 text-[11px] mt-1.5">{item.meta}</span>
              </span>
              <svg
                className="w-5 h-5 text-gray-300 flex-shrink-0 mt-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        <div className="mt-5 p-4 rounded-2xl border border-gray-200 bg-white">
          <p className="font-extrabold text-gray-900 text-sm mb-2">
            Which document wins?
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            The Companies Act comes first, then the MOI, then the Constitution, then
            role descriptions and committee resolutions. Where the Constitution and the
            MOI conflict, the MOI prevails (MOI cl. 1.2.5.2, Constitution cl. 15.1).
          </p>
        </div>
      </div>
    </div>
  );
}
