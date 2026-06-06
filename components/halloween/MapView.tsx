'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { HalloweenPhoto } from '@/lib/halloween/photos';
import { monsters } from '@/lib/halloween/monsters';

interface MapViewProps {
  photos: HalloweenPhoto[];
}

function getEmoji(monsterType: string | null): string {
  if (!monsterType) return '📍';
  const m = monsters.find(
    (m) => m.slug === monsterType || m.name.toLowerCase() === monsterType.toLowerCase()
  );
  return m?.emoji ?? '📍';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function HalloweenMapView({ photos }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null);
  const [activePhoto, setActivePhoto] = useState<HalloweenPhoto | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      const defaultLat = parseFloat(process.env.NEXT_PUBLIC_MAP_CENTER_LAT ?? '-26.0755556');
      const defaultLng = parseFloat(process.env.NEXT_PUBLIC_MAP_CENTER_LNG ?? '27.9372222');
      const defaultZoom = parseInt(process.env.NEXT_PUBLIC_MAP_ZOOM ?? '15');
      const minZoom = parseInt(process.env.NEXT_PUBLIC_MAP_MIN_ZOOM ?? '14');
      const maxZoom = parseInt(process.env.NEXT_PUBLIC_MAP_MAX_ZOOM ?? '19');

      const swLat = parseFloat(process.env.NEXT_PUBLIC_MAP_BOUNDS_SW_LAT ?? '-26.105');
      const swLng = parseFloat(process.env.NEXT_PUBLIC_MAP_BOUNDS_SW_LNG ?? '27.900');
      const neLat = parseFloat(process.env.NEXT_PUBLIC_MAP_BOUNDS_NE_LAT ?? '-26.045');
      const neLng = parseFloat(process.env.NEXT_PUBLIC_MAP_BOUNDS_NE_LNG ?? '27.975');
      const maxBounds = L.latLngBounds([swLat, swLng], [neLat, neLng]);

      const centerLat = photos.length > 0 ? photos[0].lat : defaultLat;
      const centerLng = photos.length > 0 ? photos[0].lng : defaultLng;

      const map = L.map(mapRef.current!, {
        center: [centerLat, centerLng],
        zoom: defaultZoom,
        minZoom,
        maxZoom,
        maxBounds,
        maxBoundsViscosity: 1.0,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      photos.forEach((photo) => {
        const emoji = getEmoji(photo.monsterType);
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            background: rgba(10,10,15,0.9);
            border: 2px solid #ff6b00;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 0 12px rgba(255,107,0,0.6);
          ">${emoji}</div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker([photo.lat, photo.lng], { icon }).addTo(map);
        marker.on('click', () => setActivePhoto(photo));
      });

      if (photos.length > 1) {
        const group = L.featureGroup(photos.map((p) => L.marker([p.lat, p.lng])));
        map.fitBounds(group.getBounds().pad(0.2));
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-xl" />

      {/* Photo popup overlay */}
      {activePhoto && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-80 max-w-[90vw]">
          <div
            className="rounded-2xl overflow-hidden shadow-2xl border"
            style={{ backgroundColor: '#12121e', borderColor: 'rgba(255,107,0,0.5)' }}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white rounded-full w-7 h-7 flex items-center justify-center text-sm z-10"
              style={{ backgroundColor: 'rgba(10,10,15,0.6)' }}
            >
              ✕
            </button>
            <img
              src={`/halloween-uploads/${activePhoto.filename}`}
              alt={activePhoto.title}
              className="w-full h-44 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{getEmoji(activePhoto.monsterType)}</span>
                <h3
                  className="text-lg text-orange-400"
                  style={{ fontFamily: 'var(--font-creepster), cursive' }}
                >
                  {activePhoto.title}
                </h3>
              </div>
              {activePhoto.monsterType && (
                <span
                  className="inline-block text-xs rounded-full px-2 py-0.5 mb-2 capitalize"
                  style={{
                    backgroundColor: 'rgba(255,107,0,0.2)',
                    border: '1px solid rgba(255,107,0,0.4)',
                    color: '#ffab70',
                  }}
                >
                  {activePhoto.monsterType.replace(/-/g, ' ')}
                </span>
              )}
              {activePhoto.description && (
                <p className="text-sm text-gray-300 mb-2">{activePhoto.description}</p>
              )}
              <p className="text-xs text-gray-500">
                📅 Spotted: {formatDate(activePhoto.uploadedAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {photos.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-2xl p-8 text-center max-w-sm border"
            style={{ backgroundColor: 'rgba(10,10,15,0.8)', borderColor: 'rgba(255,107,0,0.3)' }}
          >
            <p className="text-5xl mb-3">🗺️</p>
            <p
              className="text-xl text-orange-400"
              style={{ fontFamily: 'var(--font-creepster), cursive' }}
            >
              No sightings yet
            </p>
            <p className="text-gray-400 text-sm mt-1">Be the first to pin a monster sighting!</p>
          </div>
        </div>
      )}
    </div>
  );
}
