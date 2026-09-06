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
import { withTimeout } from '@/lib/utils/async';

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
      const latestAgm = await withTimeout(fetchLatestAGM());
      setAgm(latestAgm);

      if (latestAgm) {
        // Nominations and results both depend only on the AGM id, so fetch them
        // together rather than paying the round-trip twice.
        const [noms, res] = await Promise.all([
          withTimeout(fetchNominationsForAGM(latestAgm.id)),
          latestAgm.status === 'closed'
            ? withTimeout(getVoteResults(latestAgm.id))
            : Promise.resolve([]),
        ]);
        setNominations(noms);
        setResults(res);
      }
    } catch (err) {
      const timedOut = err instanceof Error && err.message === 'timeout';
      setError(
        timedOut
          ? 'Could not reach the server. Showing what we have — pull to refresh when you have signal.'
          : err instanceof Error
            ? err.message
            : 'Failed to load AGM data',
      );
    } finally {
      // Always release the spinner. Without this a stalled read leaves the page
      // on "Loading AGM…" forever.
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
