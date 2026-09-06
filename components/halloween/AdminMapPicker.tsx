'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

interface AdminMapPickerProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  existingPins?: Array<{ lat: number; lng: number; title: string }>;
}

export default function HalloweenAdminMapPicker({
  lat,
  lng,
  onChange,
  existingPins = [],
}: AdminMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null);
  const markerRef = useRef<import('leaflet').Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      const defaultLat = parseFloat(process.env.NEXT_PUBLIC_MAP_CENTER_LAT ?? '-26.0755556');
      const defaultLng = parseFloat(process.env.NEXT_PUBLIC_MAP_CENTER_LNG ?? '27.9372222');
      const zoom = parseInt(process.env.NEXT_PUBLIC_MAP_ZOOM ?? '15');
      const minZoom = parseInt(process.env.NEXT_PUBLIC_MAP_MIN_ZOOM ?? '14');
      const maxZoom = parseInt(process.env.NEXT_PUBLIC_MAP_MAX_ZOOM ?? '19');

      const swLat = parseFloat(process.env.NEXT_PUBLIC_MAP_BOUNDS_SW_LAT ?? '-26.105');
      const swLng = parseFloat(process.env.NEXT_PUBLIC_MAP_BOUNDS_SW_LNG ?? '27.900');
      const neLat = parseFloat(process.env.NEXT_PUBLIC_MAP_BOUNDS_NE_LAT ?? '-26.045');
      const neLng = parseFloat(process.env.NEXT_PUBLIC_MAP_BOUNDS_NE_LNG ?? '27.975');
      const maxBounds = L.latLngBounds([swLat, swLng], [neLat, neLng]);

      const map = L.map(mapRef.current!, {
        center: [lat ?? defaultLat, lng ?? defaultLng],
        zoom,
        minZoom,
        maxZoom,
        maxBounds,
        maxBoundsViscosity: 1.0,
      });

      mapInstanceRef.current = map;

      // CARTO's dark basemap started requiring an API key and now serves tiles
      // stamped "API KEY REQUIRED", which made the map look broken. Standard
      // OSM tiles need no key; the dark Halloween look comes from a CSS filter
      // applied to the tile layer (see .monster-map-tiles in globals.css).
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: 'monster-map-tiles',
        maxZoom: 19,
      }).addTo(map);

      const pinIcon = L.divIcon({
        className: '',
        html: `<div style="
          background: rgba(255,107,0,0.9);
          border: 2px solid #fff;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 10px rgba(255,107,0,0.8);
        ">📍</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const existingIcon = L.divIcon({
        className: '',
        html: `<div style="
          background: rgba(10,10,15,0.8);
          border: 1px solid #ff6b00;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          opacity: 0.7;
        ">📌</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      existingPins.forEach((pin) => {
        L.marker([pin.lat, pin.lng], { icon: existingIcon })
          .bindTooltip(pin.title, { direction: 'top' })
          .addTo(map);
      });

      if (lat !== null && lng !== null) {
        markerRef.current = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
      }

      map.on('click', (e) => {
        const { lat: newLat, lng: newLng } = e.latlng;
        onChange(newLat, newLng);

        if (markerRef.current) {
          markerRef.current.setLatLng([newLat, newLng]);
        } else {
          markerRef.current = L.marker([newLat, newLng], { icon: pinIcon }).addTo(map);
        }
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative">
      <div ref={mapRef} style={{ height: 360 }} className="w-full rounded-xl border border-white/10" />
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] text-xs border rounded-full px-3 py-1 pointer-events-none"
        style={{
          backgroundColor: 'rgba(10,10,15,0.8)',
          color: '#ff6b00',
          borderColor: 'rgba(255,107,0,0.4)',
        }}
      >
        👆 Click anywhere to place pin
      </div>
    </div>
  );
}
