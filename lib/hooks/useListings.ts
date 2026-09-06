'use client';

import { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Listing } from '@/lib/types';
import { toListing } from '@/lib/services/listingService';

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'listings')),
      (snap) => {
        setListings(
          snap.docs
            .map((d) => toListing(d.id, d.data() as Record<string, unknown>))
            .sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt - a.createdAt),
        );
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, []);

  return { listings, loading };
}
