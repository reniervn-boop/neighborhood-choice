'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  fetchListings,
  createListing,
  deleteListing,
  MAX_LISTING_IMAGE,
} from '@/lib/services/listingService';
import { Listing, ListingKind } from '@/lib/types';

const KINDS: { value: ListingKind; label: string }[] = [
  { value: 'property_sale', label: 'Property for sale' },
  { value: 'business_sale', label: 'Business for sale' },
  { value: 'sponsoring_agent', label: 'Sponsoring agent' },
  { value: 'member_business', label: 'Member business' },
  { value: 'sponsor', label: 'Sponsor' },
  { value: 'gallery', label: 'Street / residence photo' },
];

const EMPTY = {
  kind: 'property_sale' as ListingKind,
  title: '', description: '', price: '',
  contactName: '', contactPhone: '', contactEmail: '', url: '',
};

interface Props { userId: string; }

export default function ListingsManager({ userId }: Props) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [form, setForm] = useState({ ...EMPTY });
  const [file, setFile] = useState<File | null>(null);
  const [pct, setPct] = useState(0);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setListings(await fetchListings()); }
    catch { toast.error('Could not load listings'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const reset = () => { setForm({ ...EMPTY }); setFile(null); setPct(0); if (fileRef.current) fileRef.current.value = ''; };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_LISTING_IMAGE) { toast.error('Image must be under 8 MB'); return; }
    setFile(f);
  };

  const save = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    const res = await createListing({ ...form, createdBy: userId, imageFile: file, onProgress: setPct });
    setSaving(false);
    if ('error' in res) { toast.error(res.error); return; }
    toast.success('Listing added');
    reset();
    setMode('list');
    load();
  };

  if (mode === 'create') {
    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => { reset(); setMode('list'); }} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 bg-gray-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="font-extrabold text-gray-900">New Listing</h2>
        </div>
        <div className="space-y-3">
          <select value={form.kind} onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value as ListingKind }))} className="inp">
            {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title *" className="inp" />
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} placeholder="Description" className="inp resize-none" />
          <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="Price (e.g. R1 950 000)" className="inp" />
          <div className="grid grid-cols-2 gap-2">
            <input value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} placeholder="Contact name" className="inp" />
            <input value={form.contactPhone} onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))} placeholder="Contact phone" className="inp" />
          </div>
          <input value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} placeholder="Contact email" className="inp" />
          <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="Link (https://…)" className="inp" />

          {file && <p className="text-xs text-gray-500">{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>}
          {saving && pct > 0 && <p className="text-xs text-gray-500">Uploading {pct}%…</p>}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" id="listing-img" />
          <label htmlFor="listing-img" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-sm font-semibold text-gray-500 cursor-pointer">
            {file ? 'Change image' : 'Add image (optional, max 8 MB)'}
          </label>

          <div className="flex gap-3 pt-1">
            <button onClick={() => { reset(); setMode('list'); }} disabled={saving} className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm disabled:opacity-50">Cancel</button>
            <button onClick={save} disabled={saving} className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm disabled:opacity-50" style={{ backgroundColor: 'var(--primary)' }}>
              {saving ? 'Saving…' : 'Publish'}
            </button>
          </div>
        </div>
        <style jsx>{`:global(.inp){width:100%;padding:.75rem 1rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:.75rem;font-size:.875rem;color:#111827;outline:none}`}</style>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-extrabold text-gray-900">Prospectus Listings</h2>
          <p className="text-xs text-gray-400 mt-0.5">Properties, businesses, agents &amp; sponsors</p>
        </div>
        <button onClick={() => setMode('create')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold" style={{ backgroundColor: 'var(--primary)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          New
        </button>
      </div>
      {loading && <p className="text-sm text-gray-400 text-center py-8">Loading…</p>}
      {!loading && listings.length === 0 && (
        <div className="text-center py-12"><div className="text-4xl mb-2">🏘️</div><p className="text-gray-500 text-sm font-semibold">No listings yet</p></div>
      )}
      {!loading && listings.length > 0 && (
        <div className="space-y-2">
          {listings.map((l) => (
            <div key={l.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{l.title}</p>
                <p className="text-[11px] text-gray-400">{KINDS.find((k) => k.value === l.kind)?.label}{l.price ? ` · ${l.price}` : ''}</p>
              </div>
              <button onClick={async () => { await deleteListing(l); toast.success('Deleted'); load(); }} className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--primary)' }}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
