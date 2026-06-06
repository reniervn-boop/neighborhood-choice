'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { HalloweenPhoto } from '@/lib/halloween/photos';

const HalloweenMapView = dynamic(() => import('@/components/halloween/MapView'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center rounded-xl border border-white/10"
      style={{ backgroundColor: '#12121e' }}
    >
      <div className="text-center">
        <div className="text-5xl mb-3">🗺️</div>
        <p
          className="text-xl text-orange-400 animate-pulse"
          style={{ fontFamily: 'var(--font-creepster), cursive' }}
        >
          Loading map…
        </p>
      </div>
    </div>
  ),
});

export default function HalloweenMapPage() {
  const [photos, setPhotos] = useState<HalloweenPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/halloween/photos')
      .then((r) => r.json())
      .then((data) => {
        setPhotos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const uniqueMonsterTypes = Array.from(
    new Set(photos.map((p) => p.monsterType).filter(Boolean))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-5">
        <h1
          className="text-4xl md:text-5xl text-white"
          style={{ fontFamily: 'var(--font-creepster), cursive' }}
        >
          Monster Sighting <span style={{ color: '#ff6b00' }}>Map</span>
        </h1>
        <p className="text-gray-400 mt-2">
          {loading
            ? 'Loading sightings…'
            : photos.length > 0
            ? `${photos.length} monster sighting${photos.length === 1 ? '' : 's'} reported in the neighbourhood.`
            : 'No sightings yet. The monsters are still hiding…'}
        </p>
      </div>

      {/* Monster type legend */}
      {uniqueMonsterTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {uniqueMonsterTypes.map((type) => (
            <span
              key={type}
              className="text-xs rounded-full px-3 py-1 text-gray-300 capitalize border"
              style={{ backgroundColor: '#12121e', borderColor: 'rgba(255,107,0,0.3)' }}
            >
              {type?.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
      )}

      <div
        className="rounded-xl overflow-hidden border border-white/10"
        style={{ height: '70vh', minHeight: 400 }}
      >
        {!loading && <HalloweenMapView photos={photos} />}
      </div>

      <p className="text-center text-xs text-gray-600 mt-3">
        Click a pin to view the sighting photo and details.
      </p>
    </div>
  );
}
