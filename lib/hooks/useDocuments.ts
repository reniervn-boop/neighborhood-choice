'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { LibraryDocument, User } from '@/lib/types';
import { toDocumentDoc } from '@/lib/repositories/documentRepository';
import { allowedClassificationsFor } from '@/lib/services/documentService';

/**
 * Real-time document library scoped to what the user is allowed to read.
 * The `where('classification','in', …)` filter mirrors the Firestore rules so
 * the listener never hits a permission error.
 */
export function useDocuments(user: Pick<User, 'role' | 'membershipStatus'> | null) {
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allowed = useMemo(
    () => (user ? allowedClassificationsFor(user) : []),
    [user],
  );
  const allowedKey = allowed.join(',');

  useEffect(() => {
    if (allowed.length === 0) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'documents'), where('classification', 'in', allowed));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs
          .map((d) => toDocumentDoc(d.id, d.data() as Record<string, unknown>))
          .sort((a, b) => b.createdAt - a.createdAt);
        setDocuments(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedKey]);

  return { documents, loading, error };
}
