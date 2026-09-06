'use client';

import { useEffect, useState } from 'react';
import { CommunityProject, Donation } from '@/lib/types';
import { fetchDonationsForProject } from '@/lib/services/financeService';
import { formatZAR } from '@/lib/validation/financeValidation';
import DonationsGraph from './DonationsGraph';

interface Props {
  projects: CommunityProject[];
}

/**
 * Committee-only funding dashboard. Aggregates confirmed donations across all
 * projects into a single cumulative graph (Brainmap: "FUNDING — Donations
 * graph"). Donation reads are committee-gated in Firestore rules.
 */
export default function FundingOverview({ projects }: Props) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const all = await Promise.all(projects.map((p) => fetchDonationsForProject(p.id)));
        if (!cancelled) setDonations(all.flat());
      } catch {
        if (!cancelled) setDonations([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [projects]);

  const totalTarget = projects.reduce((s, p) => s + p.targetAmountCents, 0);
  const totalRaised = projects.reduce((s, p) => s + p.raisedAmountCents, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-extrabold text-gray-900 text-sm">Funding overview</h2>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--primary-bg)', color: 'var(--primary)' }}>
          Committee
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Stat label="Raised (all projects)" value={formatZAR(totalRaised)} />
        <Stat label="Total target" value={formatZAR(totalTarget)} />
      </div>

      {loading ? (
        <p className="text-center py-6 text-gray-400 text-xs">Loading donations…</p>
      ) : (
        <DonationsGraph donations={donations} targetCents={totalTarget || undefined} />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
      <p className="text-lg font-extrabold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-400">{label}</p>
    </div>
  );
}
