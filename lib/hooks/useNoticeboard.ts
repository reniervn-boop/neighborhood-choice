'use client';

import { useEffect, useState, useCallback } from 'react';
import { Announcement, LocalAlert } from '@/lib/types';
import {
  fetchAnnouncements,
  fetchTickerItems,
  fetchActiveAlerts,
} from '@/lib/services/noticeboardService';

export function useNoticeboard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tickerItems, setTickerItems] = useState<Announcement[]>([]);
  const [alerts, setAlerts] = useState<LocalAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ann, ticker, activeAlerts] = await Promise.all([
        fetchAnnouncements(20),
        fetchTickerItems(),
        fetchActiveAlerts(),
      ]);
      setAnnouncements(ann);
      setTickerItems(ticker);
      setAlerts(activeAlerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load noticeboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { announcements, tickerItems, alerts, loading, error, refresh: load };
}
