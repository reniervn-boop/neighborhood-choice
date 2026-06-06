'use client';

import { useEffect, useState, useCallback } from 'react';
import { AGMWindow, Nomination } from '@/lib/types';
import {
  fetchLatestAGM,
  fetchNominationsForAGM,
  checkHasVoted,
  getVoteResults,
  type PositionResult,
} from '@/lib/services/agmService';

export function useAGM() {
  const [agm, setAgm] = useState<AGMWindow | null>(null);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [results, setResults] = useState<PositionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const latestAgm = await fetchLatestAGM();
      setAgm(latestAgm);

      if (latestAgm) {
        const noms = await fetchNominationsForAGM(latestAgm.id);
        setNominations(noms);

        if (latestAgm.status === 'closed') {
          const res = await getVoteResults(latestAgm.id);
          setResults(res);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load AGM data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { agm, nominations, results, loading, error, refresh: load };
}

export function useVoteStatus(
  agmId: string | undefined,
  position: string | undefined,
  physicalAddress: string | undefined,
) {
  const [voted, setVoted] = useState<boolean | null>(null);

  useEffect(() => {
    if (!agmId || !position || !physicalAddress) {
      setVoted(null);
      return;
    }
    checkHasVoted(agmId, position, physicalAddress)
      .then(setVoted)
      .catch(() => setVoted(null));
  }, [agmId, position, physicalAddress]);

  return voted;
}
