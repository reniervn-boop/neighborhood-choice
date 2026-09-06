'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Announcement, LocalAlert } from '@/lib/types';
import { fetchActiveAlerts } from '@/lib/services/noticeboardService';
import { toAnnouncementDoc } from '@/lib/repositories/announcementRepository';
import { loadingDeadline } from '@/lib/utils/async';

export function useNoticeboard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tickerItems, setTickerItems] = useState<Announcement[]>([]);
  const [alerts, setAlerts] = useState<LocalAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Manually refresh alerts (one-shot) — used by the refresh button
  const refreshAlerts = useCallback(async () => {
    try {
      const a = await fetchActiveAlerts();
      setAlerts(a);
    } catch {
      /* non-critical */
    }
  }, []);

  // Real-time listener for announcements (main feed)
  useEffect(() => {
    const now = Date.now();
    const q = query(
      collection(db, 'announcements'),
      orderBy('publishedAt', 'desc'),
      limit(20),
    );

    const cancelDeadline = loadingDeadline(() => setLoading(false));

    const unsub = onSnapshot(
      q,
      (snap) => {
        cancelDeadline();
        const all = snap.docs
          .map((d) => toAnnouncementDoc(d.id, d.data() as Record<string, unknown>))
          .filter((a) => !a.expiresAt || a.expiresAt > now);
        setAnnouncements(all);
        setLoading(false);
      },
      (err) => {
        cancelDeadline();
        setError(err.message);
        setLoading(false);
      },
    );

    return () => {
      cancelDeadline();
      unsub();
    };
  }, []);

  // Real-time listener for pinned announcements (ticker)
  useEffect(() => {
    const now = Date.now();
    const q = query(
      collection(db, 'announcements'),
      where('isPinned', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(5),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const pinned = snap.docs
          .map((d) => toAnnouncementDoc(d.id, d.data() as Record<string, unknown>))
          .filter((a) => !a.expiresAt || a.expiresAt > now);
        setTickerItems(pinned);
      },
    );

    return unsub;
  }, []);

  // Load alerts once on mount
  useEffect(() => {
    refreshAlerts();
  }, [refreshAlerts]);

  // refresh() now just reloads alerts (announcements update in real-time automatically)
  const refresh = useCallback(async () => {
    await refreshAlerts();
  }, [refreshAlerts]);

  return { announcements, tickerItems, alerts, loading, error, refresh };
}
