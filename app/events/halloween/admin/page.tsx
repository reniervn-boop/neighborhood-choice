'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { HalloweenPhoto } from '@/lib/halloween/photos';
import { monsters } from '@/lib/halloween/monsters';

const HalloweenAdminMapPicker = dynamic(
  () => import('@/components/halloween/AdminMapPicker'),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[360px] rounded-xl flex items-center justify-center border border-white/10"
        style={{ backgroundColor: '#12121e' }}
      >
        <p
          className="text-lg animate-pulse text-orange-400"
          style={{ fontFamily: 'var(--font-creepster), cursive' }}
        >
          Loading map…
        </p>
      </div>
    ),
  }
);

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function HalloweenAdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [monsterType, setMonsterType] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<HalloweenPhoto[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);

  async function loadPhotos() {
    const res = await fetch('/api/halloween/photos');
    if (res.ok) setPhotos(await res.json());
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!file) return setError('Please select a photo.');
    if (!title.trim()) return setError('Please enter a title.');
    if (lat === null || lng === null) return setError('Please click the map to place a pin.');

    setStatus('uploading');

    const fd = new FormData();
    fd.append('photo', file);
    fd.append('title', title.trim());
    fd.append('description', description.trim());
    fd.append('lat', String(lat));
    fd.append('lng', String(lng));
    if (monsterType) fd.append('monsterType', monsterType);

    try {
      const res = await fetch('/api/halloween/photos', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: fd,
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Upload failed');
      }

      setStatus('success');
      setFile(null);
      setPreview(null);
      setTitle('');
      setDescription('');
      setMonsterType('');
      setLat(null);
      setLng(null);
      if (fileRef.current) fileRef.current.value = '';
      await loadPhotos();
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setStatus('error');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this sighting?')) return;
    await fetch(`/api/halloween/photos/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    });
    await loadPhotos();
  }

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setAuthError('Enter the admin password.');
      return;
    }
    setAuthError('');
    setAuthenticated(true);
    loadPhotos();
  }

  if (!authenticated) {
    return (
      <div className="min-h-[70dvh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-5xl mb-3">🔑</p>
            <h1
              className="text-4xl text-orange-400"
              style={{ fontFamily: 'var(--font-creepster), cursive' }}
            >
              Halloween Admin
            </h1>
            <p className="text-gray-400 text-sm mt-1">Enter the event password to continue</p>
          </div>
          <form
            onSubmit={handleAuth}
            className="rounded-2xl p-6 space-y-4 border border-white/10"
            style={{ backgroundColor: '#12121e' }}
          >
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
            {authError && <p className="text-sm text-red-400">{authError}</p>}
            <button
              type="submit"
              className="w-full text-white font-semibold py-3 rounded-xl transition-colors"
              style={{ backgroundColor: '#ff6b00' }}
            >
              Unlock Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-4xl text-orange-400"
            style={{ fontFamily: 'var(--font-creepster), cursive' }}
          >
            Halloween Admin
          </h1>
          <p className="text-gray-400 text-sm mt-1">Upload monster sighting photos</p>
        </div>
        <button
          onClick={() => setAuthenticated(false)}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Sign out
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload form */}
        <div>
          <h2
            className="text-2xl text-white mb-4"
            style={{ fontFamily: 'var(--font-creepster), cursive' }}
          >
            📸 New Sighting
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File input */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Photo *</label>
              {preview ? (
                <div
                  className="relative rounded-xl overflow-hidden mb-2 border"
                  style={{ borderColor: 'rgba(255,107,0,0.4)' }}
                >
                  <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      if (fileRef.current) fileRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label
                  className="flex flex-col items-center justify-center h-36 border-2 border-dashed rounded-xl cursor-pointer transition-colors group"
                  style={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    backgroundColor: '#12121e',
                  }}
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📷</span>
                  <span className="text-sm text-gray-400">Click to choose a photo</span>
                  <span className="text-xs text-gray-600 mt-1">JPEG, PNG, WebP — max 8 MB</span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ghost spotted on Oak Street"
                className="w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-colors text-sm"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </div>

            {/* Monster type */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Monster Type</label>
              <select
                value={monsterType}
                onChange={(e) => setMonsterType(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-white focus:outline-none transition-colors text-sm"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <option value="" style={{ backgroundColor: '#0a0a0f' }}>Unknown monster</option>
                {monsters.map((m) => (
                  <option key={m.slug} value={m.slug} style={{ backgroundColor: '#0a0a0f' }}>
                    {m.emoji} {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what was spotted…"
                rows={3}
                className="w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-colors text-sm resize-none"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Location *{' '}
                {lat !== null && lng !== null && (
                  <span className="text-orange-400 font-mono">
                    ({lat.toFixed(5)}, {lng.toFixed(5)})
                  </span>
                )}
              </label>
              <HalloweenAdminMapPicker
                lat={lat}
                lng={lng}
                onChange={(newLat, newLng) => {
                  setLat(newLat);
                  setLng(newLng);
                }}
                existingPins={photos.map((p) => ({ lat: p.lat, lng: p.lng, title: p.title }))}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-2">
                ⚠ {error}
              </p>
            )}
            {status === 'success' && (
              <p className="text-sm text-green-400 bg-green-400/10 border border-green-400/30 rounded-xl px-4 py-2">
                ✓ Sighting uploaded successfully!
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'uploading'}
              className="w-full text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#ff6b00' }}
            >
              {status === 'uploading' ? '⏳ Uploading…' : '📍 Pin Monster Sighting'}
            </button>
          </form>
        </div>

        {/* Existing sightings */}
        <div>
          <h2
            className="text-2xl text-white mb-4"
            style={{ fontFamily: 'var(--font-creepster), cursive' }}
          >
            📌 Pinned Sightings ({photos.length})
          </h2>
          {photos.length === 0 ? (
            <div
              className="rounded-2xl p-8 text-center text-gray-500 border border-white/10"
              style={{ backgroundColor: '#12121e' }}
            >
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm">No sightings pinned yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[70dvh] overflow-y-auto pr-1">
              {photos
                .slice()
                .reverse()
                .map((photo) => {
                  const monster = monsters.find((m) => m.slug === photo.monsterType);
                  return (
                    <div
                      key={photo.id}
                      className="flex gap-3 rounded-xl p-3 border border-white/10"
                      style={{ backgroundColor: '#12121e' }}
                    >
                      <img
                        src={photo.imageUrl || `/halloween-uploads/${photo.filename}`}
                        alt={photo.title}
                        className="w-16 h-16 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{photo.title}</p>
                        {monster && (
                          <p className="text-xs text-orange-300 mt-0.5">
                            {monster.emoji} {monster.name}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">
                          {photo.lat.toFixed(4)}, {photo.lng.toFixed(4)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(photo.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors shrink-0 self-start"
                        title="Delete sighting"
                      >
                        🗑
                      </button>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
