'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useDocuments } from '@/lib/hooks/useDocuments';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';
import {
  DocumentCategory,
  DocumentClassification,
  LibraryDocument,
} from '@/lib/types';

const CLASSIFICATION_BADGE: Record<
  DocumentClassification,
  { label: string; color: string; bg: string }
> = {
  public: { label: 'Public', color: '#15803d', bg: '#dcfce7' },
  members: { label: 'Members', color: '#1d4ed8', bg: '#dbeafe' },
  committee: { label: 'Committee', color: '#b45309', bg: '#fef3c7' },
};

const CATEGORY_ORDER: DocumentCategory[] = [
  'Constitution & MOI',
  'Minutes',
  'BOD Decision',
  'Financial Statement',
  'Project Report',
  'CIPC',
  'Template',
  'Other',
];

const CATEGORY_ICON: Record<DocumentCategory, string> = {
  Minutes: '📝',
  'BOD Decision': '⚖️',
  'Financial Statement': '💰',
  'Project Report': '📊',
  'Constitution & MOI': '📜',
  CIPC: '🏛️',
  Template: '📄',
  Other: '📁',
};

function formatSize(bytes?: number): string {
  if (!bytes) return '';
  const mb = bytes / 1024 / 1024;
  return mb < 1 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${mb.toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { documents, loading } = useDocuments(user);
  const [category, setCategory] = useState<DocumentCategory | 'all'>('all');

  const grouped = useMemo(() => {
    const filtered =
      category === 'all' ? documents : documents.filter((d) => d.category === category);
    const map = new Map<DocumentCategory, LibraryDocument[]>();
    for (const doc of filtered) {
      const arr = map.get(doc.category) ?? [];
      arr.push(doc);
      map.set(doc.category, arr);
    }
    return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => ({
      category: c,
      docs: map.get(c)!,
    }));
  }, [documents, category]);

  if (authLoading) return <LoadingScreen message="Loading documents…" />;
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const presentCategories = CATEGORY_ORDER.filter((c) =>
    documents.some((d) => d.category === c),
  );

  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="Documents" showBack backHref="/" />

      <div className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 py-5">
        <p className="text-gray-500 text-sm mb-4">
          Minutes, BOD decisions, financial statements, reports and association
          templates. What you can see depends on your membership.
        </p>

        {/* Category filter chips */}
        {presentCategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
            <Chip active={category === 'all'} onClick={() => setCategory('all')} label="All" />
            {presentCategories.map((c) => (
              <Chip
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
                label={`${CATEGORY_ICON[c]} ${c}`}
              />
            ))}
          </div>
        )}

        {loading && (
          <p className="text-center py-12 text-gray-400 text-sm">Loading…</p>
        )}

        {!loading && documents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📁</div>
            <p className="font-extrabold text-gray-900 mb-1">No documents yet</p>
            <p className="text-gray-500 text-sm">
              The committee will publish minutes, statements and templates here.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {grouped.map(({ category: cat, docs }) => (
            <section key={cat}>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                {CATEGORY_ICON[cat]} {cat}
              </h2>
              <div className="space-y-2">
                {docs.map((doc) => (
                  <DocRow key={doc.id} doc={doc} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors"
      style={{
        backgroundColor: active ? 'var(--primary)' : 'white',
        color: active ? 'white' : '#6b7280',
        border: active ? 'none' : '1px solid #e5e7eb',
      }}
    >
      {label}
    </button>
  );
}

function DocRow({ doc }: { doc: LibraryDocument }) {
  const href = doc.fileUrl || doc.externalUrl;
  const badge = CLASSIFICATION_BADGE[doc.classification];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 transition-transform active:scale-[0.98]"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'var(--primary-bg)' }}
      >
        <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-bold text-gray-900 text-sm truncate">{doc.title}</p>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
            style={{ color: badge.color, backgroundColor: badge.bg }}
          >
            {badge.label}
          </span>
        </div>
        {doc.description && (
          <p className="text-gray-400 text-xs mt-0.5 truncate">{doc.description}</p>
        )}
        <p className="text-gray-400 text-[11px] mt-0.5">
          {new Date(doc.createdAt).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
          {doc.fileUrl ? ` · ${formatSize(doc.sizeBytes) || 'File'}` : ' · Link'}
        </p>
      </div>
      <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}
