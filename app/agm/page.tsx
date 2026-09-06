'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAGM } from '@/lib/hooks/useAGM';
import AGMStatusBanner from '@/components/agm/AGMStatusBanner';
import NominationCard from '@/components/agm/NominationCard';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';

export default function AGMPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { agm, nominations, results, loading } = useAGM();

  if (authLoading || loading) return <LoadingScreen message="Loading AGM…" />;
  if (!user) { router.push('/auth/login'); return null; }

  // Group nominations by position
  const byPosition: Record<string, typeof nominations> = {};
  for (const nom of nominations) {
    if (!byPosition[nom.position]) byPosition[nom.position] = [];
    byPosition[nom.position].push(nom);
  }

  // Map results for quick lookup
  const resultMap: Record<string, Record<string, number>> = {};
  for (const r of results) {
    resultMap[r.position] = r.tally;
  }

  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="AGM / Governance" showBack backHref="/" />

      <div className="px-4 py-4 space-y-4">
        {!agm && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🗳</div>
            <p className="font-extrabold text-gray-900 mb-1">No AGM scheduled</p>
            <p className="text-gray-500 text-sm">The committee will announce the next AGM here.</p>
          </div>
        )}

        {agm && (
          <>
            <AGMStatusBanner agm={agm} />

            {/* CTA buttons */}
            <div className="flex gap-3">
              {agm.status === 'nominations_open' && (
                <Link
                  href="/agm/nominate"
                  className="flex-1 text-center text-white font-bold py-3 rounded-xl text-sm"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  📝 Submit Nomination
                </Link>
              )}
              {agm.status === 'voting_open' && (
                <Link
                  href="/agm/vote"
                  className="flex-1 text-center text-white font-bold py-3 rounded-xl text-sm"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  🗳 Cast Your Vote
                </Link>
              )}
            </div>

            {/* Positions */}
            {agm.positions.map((position) => {
              const posNoms = (byPosition[position] ?? []).filter(
                (n) => n.accepted === true || agm.status === 'nominations_open',
              );
              const posResults = resultMap[position] ?? {};

              return (
                <div key={position}>
                  <h2 className="font-extrabold text-gray-700 text-sm uppercase tracking-wider mb-2">
                    {position}
                  </h2>

                  {posNoms.length === 0 ? (
                    <p className="text-gray-400 text-xs italic">No nominations yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {posNoms.map((nom) => (
                        <NominationCard
                          key={nom.id}
                          nomination={nom}
                          voteCount={posResults[nom.nomineeId]}
                          showVoteCount={agm.status === 'closed'}
                          isVotingOpen={false}
                        />
                      ))}
                    </div>
                  )}

                  {/* Winner chip for closed AGM */}
                  {agm.status === 'closed' &&
                    results.find((r) => r.position === position)?.winner && (
                      <div className="mt-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                        <p className="text-xs font-bold text-green-700">
                          🏆 Winner:{' '}
                          {
                            posNoms.find(
                              (n) =>
                                n.nomineeId ===
                                results.find((r) => r.position === position)?.winner,
                            )?.nomineeName ?? 'Unknown'
                          }
                        </p>
                      </div>
                    )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
