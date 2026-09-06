'use client';

import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import DocumentReader from '@/components/governance/DocumentReader';
import { constitutionDocument } from '@/lib/data/governance/constitutionText';

/**
 * The Constitution, v2.13.A, in full.
 *
 * The "enforced in this app" panel below must stay in step with
 * lib/constitution.ts — it is a promise to members about what the app actually
 * checks, not a summary of the document.
 */

const ENFORCED_RULES: { rule: string; clause: string }[] = [
  {
    rule: 'Only paying members in good standing can vote at a General Meeting or AGM',
    clause: '5.4.1',
  },
  {
    rule: 'Your fee must be recorded on or before the date meeting notice goes out for you to vote at that meeting',
    clause: '5.4.1',
  },
  {
    rule: 'One vote per paying member, capped at two voting members per residential address',
    clause: '5.1.2',
  },
  {
    rule: 'Business Members vote once, through their designated representative',
    clause: '5.1.2',
  },
  {
    rule: 'Proxies must be written, signed, dated and lodged 24 hours before the meeting',
    clause: '5.4.2',
  },
  {
    rule: 'Only paying members in good standing can stand for the Committee or be nominated as Directors',
    clause: '5.1.3',
  },
  {
    rule: 'Meeting quorum is the GREATER of 25% of paying members or 10 paying members',
    clause: '7.4.1',
  },
  {
    rule: 'At a properly adjourned meeting, the members present are a quorum whatever their number',
    clause: '7.4.3',
  },
  { rule: 'Special resolutions need 75% of the voting rights exercised', clause: '7.5.3' },
  {
    rule: 'Annual fee falls due 1 July, with the financial year running 1 July – 30 June',
    clause: '5.3.2 / 8.5',
  },
  {
    rule: 'Membership lapses only once 12 months have passed AND an AGM has been held',
    clause: '5.3.5',
  },
  {
    rule: 'Suspension or expulsion requires 14 days’ written notice and a chance to respond',
    clause: '5.6.2',
  },
];

export default function ConstitutionPage() {
  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="Constitution" showBack backHref="/governance" />

      <div className="px-4 py-5 max-w-2xl mx-auto">
        <DocumentReader doc={constitutionDocument} />

        {/* What the app itself enforces */}
        <div className="mt-5 p-4 rounded-2xl border border-gray-200 bg-white">
          <p className="font-extrabold text-gray-900 text-sm mb-1">
            Key rules enforced in this app
          </p>
          <p className="text-gray-400 text-xs mb-3">
            These are checked in code, not just written down.
          </p>
          <ul className="space-y-2">
            {ENFORCED_RULES.map(({ rule, clause }) => (
              <li key={clause + rule} className="flex items-start gap-2 text-xs text-gray-600">
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>
                  {rule}{' '}
                  <span className="text-gray-400 whitespace-nowrap">(cl. {clause})</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Where this sits in the document set */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link
            href="/governance/moi"
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 transition-transform active:scale-[0.98]"
          >
            <span className="text-xl">🏛️</span>
            <span className="min-w-0">
              <span className="block font-bold text-gray-900 text-sm">
                Memorandum of Incorporation
              </span>
              <span className="block text-gray-400 text-xs">
                Prevails where the two conflict
              </span>
            </span>
          </Link>
          <Link
            href="/governance/jurisdiction"
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 transition-transform active:scale-[0.98]"
          >
            <span className="text-xl">🗺️</span>
            <span className="min-w-0">
              <span className="block font-bold text-gray-900 text-sm">
                Area of jurisdiction
              </span>
              <span className="block text-gray-400 text-xs">Annexure A — boundary and maps</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
