'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/hooks/useAuth';
import { monsters } from '@/lib/halloween/monsters';

const HalloweenAdminMapPicker = dynamic(
  () => import('@/components/halloween/AdminMapPicker'),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[320px] rounded-xl flex items-center justify-center border border-white/10"
        style={{ backgroundColor: '#12121e' }}
      >
        <p
          className="text-lg animate-pulse"
          style={{ fontFamily: 'var(--font-creepster), cursive', color: '#ff6b00' }}
        >
          Loading map…
        </p>
      </div>
    ),
  }
);

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function ReportSightingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [monsterType, setMonsterType] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!file) return setError('Please select a photo of the sighting.');
    if (!title.trim()) return setError('Give your sighting a title.');
    if (lat === null || lng === null) return setError('Tap the map to pin the exact location.');

    setStatus('uploading');

    const fd = new FormData();
    fd.append('photo', file);
    fd.append('title', title.trim());
    fd.append('description', description.trim());
    fd.append('lat', String(lat));
    fd.append('lng', String(lng));
    fd.append('reportedBy', user?.name ?? 'Anonymous Resident');
    if (monsterType) fd.append('monsterType', monsterType);

    try {
      const res = await fetch('/api/halloween/photos', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Upload failed');
      }

      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
      setStatus('error');
    }
  }

  function handleReset() {
    setFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setMonsterType('');
    setLat(null);
    setLng(null);
    setStatus('idle');
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  if (authLoading) {
    return (
      <div className="min-h-[70dvh] flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading…</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-[70dvh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">📍</div>
          <h2
            className="text-3xl mb-2"
            style={{ fontFamily: 'var(--font-creepster), cursive', color: '#ff6b00' }}
          >
            Sighting Reported!
          </h2>
          <p className="text-gray-300 text-sm mb-2">
            Your monster sighting has been pinned to the map. Stay safe out there!
          </p>
          <p className="text-gray-500 text-xs mb-8">
            Other residents can now see it on the Monster Map 🗺️
          </p>
          <div className="flex gap-3">
            <Link
              href="/events/halloween/map"
              className="flex-1 text-center text-white font-bold py-3 rounded-xl text-sm"
              style={{ backgroundColor: '#ff6b00' }}
            >
              View on Map
            </Link>
            <button
              onClick={handleReset}
              className="flex-1 font-bold py-3 rounded-xl text-sm border border-white/20 text-white"
            >
              Report Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1
          className="text-4xl text-white mb-1"
          style={{ fontFamily: 'var(--font-creepster), cursive' }}
        >
          Report a <span style={{ color: '#ff6b00' }}>Sighting</span>
        </h1>
        <p className="text-gray-400 text-sm">
          Spotted something strange? Pin it on the map so other residents know!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Photo */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            📷 Photo of the sighting *
          </label>
          {preview ? (
            <div
              className="relative rounded-2xl overflow-hidden border"
              style={{ borderColor: 'rgba(255,107,0,0.4)' }}
            >
              <img src={preview} alt="Preview" className="w-full h-56 object-cover" />
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  if (fileRef.current) fileRef.current.value = '';
                }}
                className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-2"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
              >
                <p className="text-xs text-green-400 font-semibold">✓ Photo selected</p>
              </div>
            </div>
          ) : (
            <label
              className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all group"
              style={{ borderColor: 'rgba(255,255,255,0.15)', backgroundColor: '#12121e' }}
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">🕵️</span>
              <span className="text-sm text-gray-300 font-semibold">Tap to add photo</span>
              <span className="text-xs text-gray-600 mt-1">JPEG, PNG, WebP — max 8 MB</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Tokoloshe spotted near the park"
            maxLength={100}
            className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-sm"
            style={{
              backgroundColor: '#12121e',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          />
        </div>

        {/* Monster type */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            What monster was it?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* "Unknown" option */}
            <button
              type="button"
              onClick={() => setMonsterType('')}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-left transition-all border"
              style={{
                backgroundColor: monsterType === '' ? 'rgba(255,107,0,0.2)' : '#12121e',
                borderColor: monsterType === '' ? '#ff6b00' : 'rgba(255,255,255,0.1)',
                color: monsterType === '' ? '#ff6b00' : '#9ca3af',
              }}
            >
              ❓ Unknown
            </button>
            {monsters.map((m) => (
              <button
                key={m.slug}
                type="button"
                onClick={() => setMonsterType(m.slug)}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-left transition-all border"
                style={{
                  backgroundColor: monsterType === m.slug ? 'rgba(255,107,0,0.2)' : '#12121e',
                  borderColor: monsterType === m.slug ? '#ff6b00' : 'rgba(255,255,255,0.1)',
                  color: monsterType === m.slug ? '#ff6b00' : '#9ca3af',
                }}
              >
                {m.emoji} {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            What happened? (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you saw, when it happened, how many there were…"
            rows={3}
            maxLength={500}
            className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-sm resize-none"
            style={{
              backgroundColor: '#12121e',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          />
          <p className="text-xs text-gray-600 mt-1 text-right">{description.length}/500</p>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            📍 Pin the location *{' '}
            {lat !== null && lng !== null && (
              <span className="text-xs font-normal" style={{ color: '#ff6b00' }}>
                ✓ Location set
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
          />
          <p className="text-xs text-gray-600 mt-1">
            Tap or click the map to place a pin at the exact spot.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'uploading'}
          className="w-full text-white font-bold py-4 rounded-2xl text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#ff6b00' }}
        >
          {status === 'uploading' ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Submitting sighting…
            </span>
          ) : (
            '📍 Pin Monster Sighting'
          )}
        </button>

        <p className="text-center text-xs text-gray-600">
          Your sighting will be visible to all residents on the{' '}
          <Link href="/events/halloween/map" style={{ color: '#ff6b00' }}>
            Monster Map
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
