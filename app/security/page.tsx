'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/hooks/useAuth';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';
import { SECURITY_PROVIDERS, SELECTION_REPORT_URL } from '@/lib/data/securityConfig';
import { createServiceRequest } from '@/lib/services/requestService';

export default function SecurityPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [requesting, setRequesting] = useState(false);

  if (loading) return <LoadingScreen message="Loading security…" />;
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const requestSalesRep = async () => {
    setRequesting(true);
    try {
      await createServiceRequest({
        type: 'sales_rep',
        userId: user.uid,
        userName: user.name,
        userEmail: user.email,
        userCell: user.cell ?? user.phone,
        details: 'Resident requested a security provider sales rep to make contact.',
      });
      toast.success('Request sent — a sales rep will be asked to contact you.');
    } catch {
      toast.error('Could not send request');
    } finally {
      setRequesting(false);
    }
  };

  const preferred = SECURITY_PROVIDERS.find((p) => p.preferred);

  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="Security Provider" showBack backHref="/" />

      <div className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 py-5 space-y-6">
        {/* Preferred provider */}
        {preferred && (
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Preferred Provider
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: 'var(--primary-bg)' }}>🔒</div>
                <div>
                  <p className="font-extrabold text-gray-900">{preferred.name}</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>Committee preferred</span>
                </div>
              </div>
              {preferred.notes && <p className="text-xs text-gray-500 mb-3">{preferred.notes}</p>}
              <div className="space-y-2">
                {preferred.emergency ? (
                  <a href={`tel:${preferred.emergency.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-gray-700"><span>🚨</span> 24h Armed Response: {preferred.emergency}</a>
                ) : null}
                {preferred.controlRoom ? (
                  <a href={`tel:${preferred.controlRoom.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-gray-700"><span>📞</span> Control Room: {preferred.controlRoom}</a>
                ) : null}
                {!preferred.emergency && !preferred.controlRoom && (
                  <p className="text-xs text-gray-400 italic">Provider contact details to be confirmed by the committee.</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Selection report */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Selection Report</h2>
          {SELECTION_REPORT_URL ? (
            <a href={SELECTION_REPORT_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
              <span className="text-2xl">📄</span>
              <div className="flex-1"><p className="font-bold text-gray-900 text-sm">Provider selection report</p><p className="text-xs text-gray-400">How the committee chose the provider</p></div>
              <span className="text-gray-300">↗</span>
            </a>
          ) : (
            <div className="flex items-center gap-3 bg-white/60 rounded-xl px-4 py-3 border border-dashed border-gray-200">
              <span className="text-2xl opacity-40">📄</span>
              <p className="text-xs text-gray-400">Selection report will be linked here once published to Documents.</p>
            </div>
          )}
        </section>

        {/* Request sales rep */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Get a Quote</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-sm text-gray-600 mb-3">
              Want armed response or alarm monitoring? Request a sales representative to contact you with a quote.
            </p>
            <button onClick={requestSalesRep} disabled={requesting} className="w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-50" style={{ backgroundColor: 'var(--primary)' }}>
              {requesting ? 'Sending…' : '📞 Request a Sales Rep'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
