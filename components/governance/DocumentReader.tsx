'use client';

import { useMemo, useState } from 'react';
import { DocBlock, DocSection, GovernanceDocument } from '@/lib/data/governance/types';

/**
 * Accordion reader for a long governance document (Constitution, MOI).
 *
 * These run to sixteen-plus clauses of legal prose, so the search box is the
 * primary way in — typing "quorum" or "5.3" should get a resident to the right
 * clause without scrolling. Matching sections auto-expand while a query is
 * active.
 */

function blockText(block: DocBlock): string {
  if (block.type === 'list') return block.items.join(' ');
  return block.text;
}

function sectionText(section: DocSection): string {
  const refs = section.content
    .map((b) => (b.type === 'clause' ? b.ref : ''))
    .join(' ');
  return `${section.number} ${section.title} ${refs} ${section.content
    .map(blockText)
    .join(' ')}`.toLowerCase();
}

export default function DocumentReader({ doc }: { doc: GovernanceDocument }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const haystacks = useMemo(
    () => new Map(doc.sections.map((s) => [s.id, sectionText(s)])),
    [doc],
  );

  const trimmed = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!trimmed) return null;
    return new Set(
      doc.sections
        .filter((s) => haystacks.get(s.id)?.includes(trimmed))
        .map((s) => s.id),
    );
  }, [doc, haystacks, trimmed]);

  const visible = matches
    ? doc.sections.filter((s) => matches.has(s.id))
    : doc.sections;

  return (
    <>
      {/* Document identity */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ backgroundColor: 'var(--brand-black)' }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: 'var(--sx-red-tint-20)' }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-white text-sm">{doc.title}</p>
            <p className="text-white/60 text-xs mt-0.5 leading-relaxed">
              {doc.subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <Tag label={doc.version} />
          {doc.status === 'final-draft' ? (
            <Tag label="Final draft — not yet adopted" tone="warn" />
          ) : (
            <Tag label="Adopted" tone="ok" />
          )}
          <Tag label={`${doc.sections.length} sections`} />
        </div>
        <p className="text-white/35 text-[11px] mt-2">Source: {doc.source}</p>
      </div>

      {/* Search */}
      <label className="relative block mb-4">
        <span className="sr-only">Search {doc.title}</span>
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clauses — e.g. quorum, proxy, 5.3"
          className="w-full pl-9 pr-3 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:border-gray-400 transition-colors"
        />
      </label>

      {matches && (
        <p className="text-gray-500 text-xs mb-3">
          {visible.length === 0
            ? 'No clauses match that search.'
            : `${visible.length} of ${doc.sections.length} sections match “${query.trim()}”.`}
        </p>
      )}

      <div className="space-y-2">
        {visible.map((section) => {
          // While searching, show every match open — the reader is looking for
          // wording, not navigating a table of contents.
          const isOpen = matches ? true : expanded === section.id;
          return (
            <section
              key={section.id}
              id={section.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-20"
            >
              <button
                type="button"
                onClick={() =>
                  setExpanded(expanded === section.id ? null : section.id)
                }
                aria-expanded={isOpen}
                className="w-full text-left px-4 py-4 flex items-center gap-3 transition-colors"
                style={{ backgroundColor: isOpen ? 'var(--brand-black)' : 'white' }}
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-extrabold"
                  style={{
                    backgroundColor: isOpen
                      ? 'var(--sx-red-tint-20)'
                      : 'var(--primary-bg)',
                    color: isOpen ? 'white' : 'var(--primary)',
                  }}
                >
                  {section.number || '§'}
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    className="block font-bold text-sm leading-snug"
                    style={{ color: isOpen ? 'white' : 'var(--brand-black)' }}
                  >
                    {section.title}
                  </span>
                  {section.subtitle && (
                    <span
                      className="block text-xs mt-0.5"
                      style={{ color: isOpen ? 'rgba(255,255,255,0.5)' : '#9ca3af' }}
                    >
                      {section.subtitle}
                    </span>
                  )}
                </span>
                <svg
                  className="w-5 h-5 flex-shrink-0 transition-transform"
                  style={{
                    color: isOpen ? 'rgba(255,255,255,0.5)' : '#9ca3af',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="px-4 py-4 bg-gray-50 border-t border-gray-100 space-y-3">
                  {section.content.map((block, idx) => (
                    <Block key={idx} block={block} highlight={trimmed} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}

function Tag({ label, tone }: { label: string; tone?: 'ok' | 'warn' }) {
  const palette =
    tone === 'ok'
      ? { color: '#86efac', bg: 'rgba(34,197,94,0.15)' }
      : tone === 'warn'
        ? { color: '#fcd34d', bg: 'rgba(245,158,11,0.15)' }
        : { color: 'rgba(255,255,255,0.6)', bg: 'rgba(255,255,255,0.08)' };
  return (
    <span
      className="text-[10px] font-bold px-2 py-1 rounded-full"
      style={{ color: palette.color, backgroundColor: palette.bg }}
    >
      {label}
    </span>
  );
}

/** Wrap search hits so the eye lands on them inside a wall of legal prose. */
function Marked({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      <Marked text={text.slice(idx + query.length)} query={query} />
    </>
  );
}

function Block({ block, highlight }: { block: DocBlock; highlight: string }) {
  switch (block.type) {
    case 'heading':
      return (
        <p className="font-extrabold text-gray-900 text-sm mt-3 first:mt-0">
          <Marked text={block.text} query={highlight} />
        </p>
      );

    case 'clause':
      return (
        <p className="text-sm leading-relaxed text-gray-700">
          <span
            className="font-bold mr-1.5 tabular-nums"
            style={{ color: 'var(--primary)' }}
          >
            {block.ref}
          </span>
          <Marked text={block.text} query={highlight} />
        </p>
      );

    case 'paragraph':
      return (
        <p className="text-sm leading-relaxed text-gray-700">
          <Marked text={block.text} query={highlight} />
        </p>
      );

    case 'list':
      return (
        <ul className="space-y-1.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: 'var(--primary)' }}
              />
              <span className="leading-relaxed">
                <Marked text={item} query={highlight} />
              </span>
            </li>
          ))}
        </ul>
      );

    case 'highlight':
      return (
        <div
          className="rounded-xl p-3 border"
          style={{
            backgroundColor: 'var(--primary-bg)',
            borderColor: 'rgba(204,18,18,0.2)',
          }}
        >
          <p
            className="text-sm leading-relaxed font-semibold"
            style={{ color: 'var(--primary-dark)' }}
          >
            <Marked text={block.text} query={highlight} />
          </p>
        </div>
      );

    case 'note':
      return (
        <div className="rounded-xl p-3 bg-white border border-gray-200">
          <p className="text-xs leading-relaxed text-gray-500 italic">
            <Marked text={block.text} query={highlight} />
          </p>
        </div>
      );
  }
}
