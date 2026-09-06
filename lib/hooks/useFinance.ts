'use client';

import { useEffect, useState, useCallback } from 'react';
import { CommunityProject, Donation } from '@/lib/types';
import { fetchActiveProjects, fetchMyDonations } from '@/lib/services/financeService';
import { withTimeout } from '@/lib/utils/async';

export function useFinance() {
  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const active = await withTimeout(fetchActiveProjects());
      setProjects(active);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { projects, loading, error, refresh: load };
}

export function useMyDonations(userId: string | undefined) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    withTimeout(fetchMyDonations(userId))
      .then(setDonations)
      .catch(() => setDonations([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return { donations, loading };
}
