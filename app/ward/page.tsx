'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePetitions } from '@/lib/hooks/usePetitions';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';
import { WARD, WARD_LABEL } from '@/lib/data/wardConfig';
import { createPetition, deletePetition } from '@/lib/services/petitionService';

export default function WardPage() {
  const router = useRouter();
  const { user, loading, isCommittee } = useAuth();
  const { activePetitions, loading: petitionsLoading } = usePetitions();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', url: '' });
  const [saving, setSaving] = useState(false);

  if (loading) return <LoadingScreen message="Loading ward…" />;
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const c = WARD.councillor;
  const hasContact = c.phone || c.email || c.whatsApp;

  const submitPetition = async () => {
    if (!form.title.trim() || !form.url.trim()) {
      toast.error('Title and link are required');
      return;
    }
    setSaving(true);
    const res = await createPetition({
      title: form.title,
      description: form.description,
      url: form.url,
      createdBy: user.uid,
      createdByName: user.name,
    });
    setSaving(false);
    if ('error' in res) {
      toast.error(res.error);
      return;
    }
    toast.success('Petition added');
    setForm({ title: '', description: '', url: '' });
    setShowForm(false);
  };

  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title={WARD_LABEL} showBack backHref="/" />

      <div className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 py-5 space-y-6">
        {/* ── Councillor ──────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Ward Councillor
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: 'var(--primary-bg)' }}
              >
                🏛️
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-400">
                  {WARD_LABEL} · {WARD.suburb}
                  {c.party ? ` · ${c.party}` : ''}
                </p>
              </div>
            </div>

            {hasContact ? (
              <div className="space-y-2">
                {c.phone && (
                  <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-gray-700">
                    <span>📞</span> {c.phone}
                  </a>
                )}
                {c.email && (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm text-gray-700 break-all">
                    <span>✉️</span> {c.email}
                  </a>
                )}
                {c.whatsApp && (
                  <a
                    href={`https://wa.me/${c.whatsApp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-green-700"
                  >
                    <span>💬</span> WhatsApp the councillor
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                Councillor contact details to be confirmed.
              </p>
            )}
          </div>

          {/* Committee note: councillor access to reports */}
          {isCommittee && (
            <p className="text-[11px] text-gray-400 mt-2 leading-snug">
              ⓘ Councillor report access: grant the councillor a committee login to
              let them review escalations and fault reports for the ward.
            </p>
          )}
        </section>

        {/* ── Petitions ───────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Petitions
            </h2>
            {isCommittee && (
              <button
                onClick={() => setShowForm((s) => !s)}
                className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {showForm ? 'Cancel' : '+ Add'}
              </button>
            )}
          </div>

          {showForm && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3 space-y-3">
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Petition title"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
              />
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short description (optional)"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
              />
              <input
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="Petition link (https://…)"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
              />
              <button
                onClick={submitPetition}
                disabled={saving}
                className="w-full py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {saving ? 'Saving…' : 'Publish petition'}
              </button>
            </div>
          )}

          {petitionsLoading ? (
            <p className="text-center py-6 text-gray-400 text-sm">Loading…</p>
          ) : activePetitions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-sm font-semibold text-gray-700">No petitions at this time</p>
              <p className="text-xs text-gray-400 mt-1">
                Active community petitions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {activePetitions.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 text-sm hover:underline">
                      {p.title}
                    </a>
                    {p.description && <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>}
                  </div>
                  {isCommittee && (
                    <button
                      onClick={async () => { await deletePetition(p.id); toast.success('Removed'); }}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ color: 'var(--primary)' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Useful links ────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Useful Links
          </h2>
          <div className="space-y-2">
            <a
              href={WARD.iecUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100"
            >
              <span className="text-2xl">🗳️</span>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">IEC Website</p>
                <p className="text-xs text-gray-400">Voter registration &amp; ward lookup</p>
              </div>
              <span className="text-gray-300">↗</span>
            </a>
            {WARD.whatsAppGroupUrl ? (
              <a
                href={WARD.whatsAppGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100"
              >
                <span className="text-2xl">💬</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">Community WhatsApp Group</p>
                  <p className="text-xs text-gray-400">Join the ward chat</p>
                </div>
                <span className="text-gray-300">↗</span>
              </a>
            ) : (
              <div className="flex items-center gap-3 bg-white/60 rounded-xl px-4 py-3 border border-dashed border-gray-200">
                <span className="text-2xl opacity-40">💬</span>
                <p className="text-xs text-gray-400">WhatsApp group link to be added by committee.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
