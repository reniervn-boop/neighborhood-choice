'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Petition } from '@/lib/types';
import { toPetition } from '@/lib/services/petitionService';
import { loadingDeadline } from '@/lib/utils/async';

export function usePetitions() {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'petitions'), orderBy('createdAt', 'desc'));
    const cancelDeadline = loadingDeadline(() => setLoading(false));

    const unsub = onSnapshot(
      q,
      (snap) => {
        cancelDeadline();
        setPetitions(
          snap.docs.map((d) => toPetition(d.id, d.data() as Record<string, unknown>)),
        );
        setLoading(false);
      },
      () => {
        cancelDeadline();
        setLoading(false);
      },
    );
    return () => {
      cancelDeadline();
      unsub();
    };
  }, []);

  const activePetitions = petitions.filter((p) => p.isActive);
  return { petitions, activePetitions, loading };
}
