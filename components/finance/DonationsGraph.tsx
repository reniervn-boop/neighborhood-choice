'use client';

import { useMemo } from 'react';
import { Donation } from '@/lib/types';
import { formatZAR } from '@/lib/validation/financeValidation';

interface Props {
  donations: Donation[];
  /** Optional target line in cents */
  targetCents?: number;
}

/**
 * Cumulative donations-over-time area chart (Brainmap: "FUNDING — Donations
 * graph"). Pure SVG, no chart library. Expects confirmed donations.
 */
export default function DonationsGraph({ donations, targetCents }: Props) {
  const { points, total, maxY, count } = useMemo(() => {
    const confirmed = donations
      .filter((d) => d.status === 'confirmed')
      .map((d) => ({ t: d.confirmedAt ?? d.createdAt, amt: d.amountCents }))
      .sort((a, b) => a.t - b.t);

    // Built with reduce rather than a mutable accumulator so the React
    // Compiler can memoise this component instead of bailing out on it.
    const cum = confirmed.reduce<{ t: number; y: number }[]>((acc, d) => {
      const previous = acc.length > 0 ? acc[acc.length - 1].y : 0;
      acc.push({ t: d.t, y: previous + d.amt });
      return acc;
    }, []);

    const total = cum.length > 0 ? cum[cum.length - 1].y : 0;
    const maxY = Math.max(targetCents ?? 0, total, 1);
    return { points: cum, total, maxY, count: confirmed.length };
  }, [donations, targetCents]);

  const W = 320;
  const H = 120;
  const PAD = 4;

  if (count === 0) {
    return (
      <div className="text-center py-6 text-gray-400 text-xs">
        No confirmed donations yet — the graph appears once donations come in.
      </div>
    );
  }

  // Build the path. X = evenly spaced by donation index (simple + readable).
  const stepX = points.length > 1 ? (W - PAD * 2) / (points.length - 1) : 0;
  const coords = points.map((p, i) => {
    const x = PAD + i * stepX;
    const y = H - PAD - (p.y / maxY) * (H - PAD * 2);
    return [x, y] as const;
  });

  const linePath = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${coords[coords.length - 1][0].toFixed(1)},${H - PAD} L${PAD},${H - PAD} Z`;

  const targetY = targetCents ? H - PAD - (targetCents / maxY) * (H - PAD * 2) : null;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Donations to date
        </span>
        <span className="text-sm font-extrabold" style={{ color: 'var(--primary)' }}>
          {formatZAR(total)}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 120 }}>
        <defs>
          <linearGradient id="donGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {targetY !== null && (
          <>
            <line x1={PAD} y1={targetY} x2={W - PAD} y2={targetY} stroke="#9ca3af" strokeWidth="1" strokeDasharray="4 3" />
            <text x={W - PAD} y={Math.max(10, targetY - 3)} textAnchor="end" fontSize="9" fill="#9ca3af">
              target
            </text>
          </>
        )}

        <path d={areaPath} fill="url(#donGrad)" />
        <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" />
        {coords.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="var(--primary)" />
        ))}
      </svg>
      <p className="text-[11px] text-gray-400 mt-1">
        {count} confirmed donation{count === 1 ? '' : 's'}
      </p>
    </div>
  );
}
