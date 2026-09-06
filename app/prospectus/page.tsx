'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useListings } from '@/lib/hooks/useListings';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';
import { WARD } from '@/lib/data/wardConfig';
import { Listing, ListingKind } from '@/lib/types';

const SECTIONS: { kind: ListingKind; title: string; emoji: string }[] = [
  { kind: 'property_sale', title: 'Properties for Sale', emoji: '🏡' },
  { kind: 'business_sale', title: 'Businesses for Sale', emoji: '🏢' },
  { kind: 'sponsoring_agent', title: 'Sponsoring Estate Agents', emoji: '🤝' },
  { kind: 'member_business', title: 'Member Businesses', emoji: '🛍️' },
  { kind: 'sponsor', title: 'Our Sponsors', emoji: '⭐' },
  { kind: 'gallery', title: 'Streets & Residences', emoji: '📸' },
];

// OpenStreetMap embed centred on Sundowner, Randburg (no API key needed).
// ⚠️ CLIENT: provide SX7RA boundary GeoJSON to overlay exact estate borders.
const MAP_EMBED =
  'https://www.openstreetmap.org/export/embed.html?bbox=27.93%2C-26.04%2C27.97%2C-26.00&layer=mapnik&marker=-26.02%2C27.95';
const MAP_LINK = 'https://www.openstreetmap.org/?mlat=-26.02&mlon=27.95#map=15/-26.02/27.95';

export default function ProspectusPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { listings, loading: listingsLoading } = useListings();

  const byKind = useMemo(() => {
    const map = new Map<ListingKind, Listing[]>();
    for (const l of listings) {
      const arr = map.get(l.kind) ?? [];
      arr.push(l);
      map.set(l.kind, arr);
    }
    return map;
  }, [listings]);

  if (loading) return <LoadingScreen message="Loading prospectus…" />;
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="SX7 Prospectus" showBack backHref="/" />

      <div className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 py-5 space-y-6">
        <p className="text-gray-500 text-sm">
          Welcome to {WARD.suburb} — a suburb of choice. Explore properties, local
          businesses and our sponsors.
        </p>

        {/* ── Boundary map ──────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Map of SX7 &amp; SX7RA boundaries
          </h2>
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            <iframe
              title="Map of Sundowner Ext 7"
              src={MAP_EMBED}
              className="w-full"
              style={{ height: 220, border: 0 }}
              loading="lazy"
            />
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs font-semibold py-2.5"
              style={{ color: 'var(--primary)' }}
            >
              Open full map ↗
            </a>
          </div>
        </section>

        {listingsLoading && (
          <p className="text-center py-8 text-gray-400 text-sm">Loading listings…</p>
        )}

        {/* ── Listing sections ──────────────────────────────── */}
        {SECTIONS.map(({ kind, title, emoji }) => {
          const items = byKind.get(kind) ?? [];
          if (items.length === 0) return null;
          return (
            <section key={kind}>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                {emoji} {title}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {items.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </section>
          );
        })}

        {!listingsLoading && listings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🏘️</div>
            <p className="font-extrabold text-gray-900 mb-1">Prospectus coming soon</p>
            <p className="text-gray-500 text-sm">
              The committee will add properties, businesses and sponsors here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const body = (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-full">
      {listing.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={listing.imageUrl} alt={listing.title} className="w-full h-24 object-cover" />
      ) : (
        <div className="w-full h-24 flex items-center justify-center text-3xl" style={{ backgroundColor: 'var(--primary-bg)' }}>
          🏠
        </div>
      )}
      <div className="p-2.5">
        <p className="font-bold text-gray-900 text-xs leading-snug line-clamp-2">{listing.title}</p>
        {listing.price && <p className="text-xs font-extrabold mt-0.5" style={{ color: 'var(--primary)' }}>{listing.price}</p>}
        {listing.description && <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{listing.description}</p>}
        {(listing.contactName || listing.contactPhone) && (
          <p className="text-[11px] text-gray-500 mt-1">
            {listing.contactName}{listing.contactPhone ? ` · ${listing.contactPhone}` : ''}
          </p>
        )}
      </div>
    </div>
  );

  return listing.url ? (
    <a href={listing.url} target="_blank" rel="noopener noreferrer" className="block">{body}</a>
  ) : (
    body
  );
}
