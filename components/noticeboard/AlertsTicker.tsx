'use client';

import { useEffect, useRef, useState } from 'react';
import { LocalAlert } from '@/lib/types';

const SEVERITY_STYLES: Record<LocalAlert['severity'], { bg: string; text: string; icon: string }> = {
  info: { bg: '#E3F2FD', text: '#1565C0', icon: 'ℹ️' },
  warning: { bg: '#FFF3E0', text: '#E65100', icon: '⚠️' },
  critical: { bg: '#FFEBEE', text: '#C62828', icon: '🚨' },
};

interface Props {
  alerts: LocalAlert[];
}

export default function AlertsTicker({ alerts }: Props) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const active = alerts[index % Math.max(alerts.length, 1)];

  useEffect(() => {
    if (alerts.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => i + 1);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [alerts.length]);

  if (alerts.length === 0 || !active) return null;

  const style = SEVERITY_STYLES[active.severity];

  return (
    <div
      className="mx-4 mt-3 rounded-xl px-3 py-2 flex items-center gap-2 overflow-hidden"
      style={{ backgroundColor: style.bg }}
    >
      <span className="text-base flex-shrink-0">{style.icon}</span>
      <p
        className="text-xs font-semibold leading-snug flex-1 truncate"
        style={{ color: style.text }}
      >
        {active.message}
      </p>
      {alerts.length > 1 && (
        <span className="text-xs font-bold flex-shrink-0" style={{ color: style.text }}>
          {(index % alerts.length) + 1}/{alerts.length}
        </span>
      )}
    </div>
  );
}
