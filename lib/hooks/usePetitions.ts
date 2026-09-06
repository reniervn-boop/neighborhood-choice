'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Petition } from '@/lib/types';
import { toPetition } from '@/lib/services/petitionService';

export function usePetitions() {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'petitions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPetitions(
          snap.docs.map((d) => toPetition(d.id, d.data() as Record<string, unknown>)),
        );
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, []);

  const activePetitions = petitions.filter((p) => p.isActive);
  return { petitions, activePetitions, loading };
}
