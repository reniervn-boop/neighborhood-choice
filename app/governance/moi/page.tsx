'use client';

import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import DocumentReader from '@/components/governance/DocumentReader';
import { moiDocument } from '@/lib/data/governance/moiText';

export default function MoiPage() {
  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="MOI" showBack backHref="/governance" />

      <div className="px-4 py-5 max-w-2xl mx-auto">
        {/* The precedence rule is the single most important thing a reader needs
            to know before reading either document. */}
        <div
          className="rounded-2xl p-3 mb-4 border"
          style={{ backgroundColor: 'var(--primary-bg)', borderColor: 'rgba(204,18,18,0.2)' }}
        >
          <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--primary-dark)' }}>
            The MOI outranks the Constitution. Where the two conflict, clause 1.2.5.2 of
            the MOI says the MOI prevails.
          </p>
        </div>

        <DocumentReader doc={moiDocument} />

        <Link
          href="/constitution"
          className="mt-4 flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 transition-transform active:scale-[0.98]"
        >
          <span className="text-xl">📜</span>
          <span className="min-w-0">
            <span className="block font-bold text-gray-900 text-sm">Constitution</span>
            <span className="block text-gray-400 text-xs">
              The day-to-day rules, read beneath this document
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
