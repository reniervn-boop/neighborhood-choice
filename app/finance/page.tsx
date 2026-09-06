'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFinance } from '@/lib/hooks/useFinance';
import ProjectCard from '@/components/finance/ProjectCard';
import PaymentMethodSheet from '@/components/finance/PaymentMethodSheet';
import FundingOverview from '@/components/finance/FundingOverview';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';
import { CommunityProject } from '@/lib/types';

export default function FinancePage() {
  const router = useRouter();
  const { user, loading: authLoading, isCommittee } = useAuth();
  const { projects, loading, refresh } = useFinance();
  const [donatingTo, setDonatingTo] = useState<CommunityProject | null>(null);

  if (authLoading) return <LoadingScreen message="Loading finance…" />;
  if (!user) { router.push('/auth/login'); return null; }

  const activeProjects = projects.filter((p) => p.status === 'active');
  const otherProjects = projects.filter((p) => p.status !== 'active');

  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader
        title="Community Finance"
        showBack
        backHref="/"
        rightElement={
          <button
            onClick={refresh}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white/60 hover:text-white"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            🔄
          </button>
        }
      />

      <div className="max-w-lg lg:max-w-5xl mx-auto px-4 lg:px-8 py-4 space-y-4">
        {loading && <div className="text-center py-12 text-gray-400 text-sm">Loading…</div>}

        {!loading && activeProjects.length === 0 && otherProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">💰</div>
            <p className="font-extrabold text-gray-900 mb-1">No projects yet</p>
            <p className="text-gray-500 text-sm">The committee will post fundraising projects here.</p>
          </div>
        )}

        {isCommittee && projects.length > 0 && <FundingOverview projects={projects} />}

        {activeProjects.length > 0 && (
          <>
            <h2 className="font-extrabold text-gray-700 text-sm uppercase tracking-wider">
              Active Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeProjects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onDonate={() => setDonatingTo(p)}
                />
              ))}
            </div>
          </>
        )}

        {otherProjects.length > 0 && (
          <>
            <h2 className="font-extrabold text-gray-700 text-sm uppercase tracking-wider mt-4">
              Past Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {otherProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Payment sheet */}
      {donatingTo && (
        <PaymentMethodSheet
          project={donatingTo}
          donorName={user.name}
          onClose={() => setDonatingTo(null)}
          onSuccess={() => { setDonatingTo(null); refresh(); }}
        />
      )}
    </div>
  );
}
