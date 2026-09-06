import Image from 'next/image';
import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import {
  AREA_OF_JURISDICTION_INTRO,
  NOT_AN_HOA_NOTICE,
  boundaryEdges,
  jurisdictionMaps,
} from '@/lib/data/governance/jurisdiction';

export const metadata: Metadata = {
  title: 'Area of jurisdiction — SX7RA',
  description:
    'The boundary of Sundowner Extension 7 as described in clause 2 of the SX7RA Constitution, with Surveyor-General cadastral maps.',
};

export default function JurisdictionPage() {
  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="Area of jurisdiction" showBack backHref="/governance" />

      <div className="px-4 py-5 max-w-2xl mx-auto">
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: 'var(--brand-black)' }}>
          <p className="font-extrabold text-white text-sm">Annexure A — Constitution cl. 2</p>
          <p className="text-white/60 text-xs mt-1 leading-relaxed">
            {AREA_OF_JURISDICTION_INTRO}
          </p>
        </div>

        {/* The four boundary edges */}
        <div className="space-y-2 mb-5">
          {boundaryEdges.map((edge) => (
            <section
              key={edge.ref}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full tabular-nums"
                  style={{ backgroundColor: 'var(--primary-bg)', color: 'var(--primary)' }}
                >
                  {edge.ref}
                </span>
                <h2 className="font-bold text-gray-900 text-sm">{edge.label}</h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{edge.text}</p>
            </section>
          ))}
        </div>

        <div
          className="rounded-2xl p-3 mb-6 border"
          style={{ backgroundColor: 'var(--primary-bg)', borderColor: 'rgba(204,18,18,0.2)' }}
        >
          <p
            className="text-sm leading-relaxed font-semibold"
            style={{ color: 'var(--primary-dark)' }}
          >
            {NOT_AN_HOA_NOTICE}
          </p>
        </div>

        {/* Cadastral maps */}
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
          Cadastral maps
        </h2>
        <p className="text-gray-500 text-xs mb-3 leading-relaxed">
          Surveyor-General extracts showing erf numbers and street names. Pinch to zoom,
          or tap a map to open it full size.
        </p>

        <div className="space-y-4">
          {jurisdictionMaps.map((map, i) => (
            <figure
              key={map.src}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <a href={map.src} target="_blank" rel="noopener noreferrer">
                <Image
                  src={map.src}
                  alt={`Cadastral map of ${map.title.toLowerCase()}, Sundowner Extension 7`}
                  width={map.width}
                  height={map.height}
                  sizes="(min-width: 640px) 640px, 100vw"
                  // Only the first map is likely to be above the fold on a phone.
                  priority={i === 0}
                  loading={i === 0 ? undefined : 'lazy'}
                  className="w-full h-auto bg-white"
                />
              </a>
              <figcaption className="px-4 py-3 border-t border-gray-100">
                <p className="font-bold text-gray-900 text-sm">{map.title}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{map.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="text-gray-400 text-xs mt-5 leading-relaxed">
          Clause 2.2: the boundaries are to be formally recorded as an annexure to the
          Constitution and updated as necessary by Special General Meeting.
        </p>
      </div>
    </div>
  );
}
