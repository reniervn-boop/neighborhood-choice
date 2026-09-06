import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import { getRole, roleDescriptions } from '@/lib/data/governance/roles';

export function generateStaticParams() {
  return roleDescriptions.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) return { title: 'Role not found — SX7RA' };
  return {
    title: `${role.title} — SX7RA`,
    description: role.summary,
  };
}

const FACTS: { key: 'reportsTo' | 'appointment' | 'term' | 'eligibility'; label: string }[] = [
  { key: 'reportsTo', label: 'Reports to' },
  { key: 'appointment', label: 'Appointment' },
  { key: 'term', label: 'Term of office' },
  { key: 'eligibility', label: 'Eligibility' },
];

export default async function RoleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) notFound();

  const index = roleDescriptions.findIndex((r) => r.slug === role.slug);
  const next = roleDescriptions[(index + 1) % roleDescriptions.length];

  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title={role.title} showBack backHref="/governance/roles" />

      <div className="px-4 py-5 max-w-2xl mx-auto">
        {/* Title card */}
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: 'var(--brand-black)' }}>
          <div className="flex items-start gap-3">
            <span
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
              style={{ backgroundColor: 'var(--sx-red-tint-20)' }}
              aria-hidden="true"
            >
              {role.emoji}
            </span>
            <div className="min-w-0">
              <h1 className="font-extrabold text-white text-lg leading-tight">{role.title}</h1>
              <p className="text-white/60 text-xs mt-1 leading-relaxed">{role.subtitle}</p>
            </div>
          </div>
          <p className="text-white/75 text-sm mt-3 leading-relaxed">{role.summary}</p>
        </div>

        {/* At a glance */}
        <dl className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 mb-4">
          {FACTS.map(({ key, label }) => (
            <div key={key} className="px-4 py-3">
              <dt className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {label}
              </dt>
              <dd className="text-sm text-gray-700 leading-relaxed mt-1">{role[key]}</dd>
            </div>
          ))}
        </dl>

        {/* Duties */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <h2 className="font-extrabold text-gray-900 text-sm mb-3">Key duties</h2>
          <ul className="space-y-2.5">
            {role.duties.map((duty, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span
                  className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold tabular-nums"
                  style={{ backgroundColor: 'var(--primary-bg)', color: 'var(--primary)' }}
                >
                  {i + 1}
                </span>
                <span className="leading-relaxed">{duty}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Notes — usually the constraints that trip people up */}
        {role.notes.length > 0 && (
          <section className="rounded-2xl border border-gray-200 bg-white p-4 mb-4">
            <h2 className="font-extrabold text-gray-900 text-sm mb-2">Notes</h2>
            <div className="space-y-2">
              {role.notes.map((note, i) => (
                <p key={i} className="text-xs text-gray-600 leading-relaxed">
                  {note}
                </p>
              ))}
            </div>
          </section>
        )}

        <p className="text-gray-400 text-xs leading-relaxed mb-4">Source: {role.source}</p>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/constitution"
            className="flex-1 flex items-center justify-center gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-3 text-sm font-bold text-gray-900 transition-transform active:scale-[0.98]"
          >
            📜 Read the Constitution
          </Link>
          <Link
            href={`/governance/roles/${next.slug}`}
            className="flex-1 flex items-center justify-center gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-3 text-sm font-bold text-gray-900 transition-transform active:scale-[0.98]"
          >
            {next.emoji} {next.title} →
          </Link>
        </div>
      </div>
    </div>
  );
}
