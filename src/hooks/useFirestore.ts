import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  doc,
  where,
  QueryConstraint,
  updateDoc,
  increment,
  serverTimestamp,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Faculty, Paper } from '../types';
import { RECENT_PAPERS } from '../constants';

export type PaperStatus = NonNullable<Paper['status']>;

type CachedValue<T> = {
  expiresAt: number;
  data: T;
};

const firestoreCache = new Map<string, CachedValue<unknown>>();
const pendingReads = new Map<string, Promise<unknown>>();
const CACHE_TTL_MS = 5 * 60 * 1000;

async function getCachedRead<T>(key: string, fetcher: () => Promise<T>, ttlMs = CACHE_TTL_MS): Promise<T> {
  const now = Date.now();
  const cached = firestoreCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  const pending = pendingReads.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  const request = fetcher()
    .then((data) => {
      firestoreCache.set(key, { expiresAt: Date.now() + ttlMs, data });
      pendingReads.delete(key);
      return data;
    })
    .catch((error) => {
      pendingReads.delete(key);
      throw error;
    });

  pendingReads.set(key, request as Promise<unknown>);
  return request;
}

function clearFirestoreCache() {
  firestoreCache.clear();
  pendingReads.clear();
}

async function fetchFaculties() {
  if (!db) return [] as Faculty[];

  return getCachedRead('faculties', async () => {
    const q = query(collection(db, 'faculties'), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Faculty));
  });
}

async function fetchPapersByKey(key: string, q: ReturnType<typeof query>) {
  if (!db) return [] as Paper[];

  return getCachedRead(key, async () => {
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Paper));
  });
}

export async function fetchPublishedPapers() {
  if (!db) return RECENT_PAPERS as Paper[];

  const q = query(
    collection(db, 'papers'),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc')
  );

  return fetchPapersByKey('papers:published', q);
}

async function fetchPaperById(id: string) {
  if (!db) return null;

  return getCachedRead(`paper:${id}`, async () => {
    const snapshot = await getDoc(doc(db, 'papers', id));
    return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Paper) : null;
  });
}

// ── Faculties ────────────────────────────────────────────────

export function useFaculties() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!db) {
      setLoading(false);
      return;
    }
    setLoading(true);

    fetchFaculties()
      .then((data) => {
        if (!active) return;
        setFaculties(data);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error fetching faculties:', err);
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { faculties, loading, error };
}

// ── Papers ───────────────────────────────────────────────────

interface PaperFilters {
  facultyId?: string;
  level?: string;
  semester?: string;
  type?: string;
  status?: string;
}

export function usePapers(filters?: PaperFilters) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filtersKey = JSON.stringify(filters || {});

  useEffect(() => {
    let active = true;

    if (!db) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const constraints: QueryConstraint[] = [];

    if (filters?.facultyId) constraints.push(where('facultyId', '==', filters.facultyId));
    if (filters?.level) constraints.push(where('level', '==', filters.level));
    if (filters?.semester) constraints.push(where('semester', '==', filters.semester));
    if (filters?.type) constraints.push(where('type', '==', filters.type));
    if (filters?.status) constraints.push(where('status', '==', filters.status));

    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(collection(db, 'papers'), ...constraints);
    fetchPapersByKey(`papers:${filtersKey}`, q)
      .then((data) => {
        if (!active) return;
        setPapers(data);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error fetching papers:', err);
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filtersKey]);

  return { papers, loading, error };
}

export function useRecentPapers(count: number = 6) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!db) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'papers'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    fetchPapersByKey(`recent:${count}`, q)
      .then((data) => {
        if (!active) return;
        setPapers(data);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error fetching recent papers:', err);
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [count]);

  return { papers, loading, error };
}

export function usePaper(id: string | undefined) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!id || !db) {
      setLoading(false);
      return;
    }
    setLoading(true);

    fetchPaperById(id)
      .then((data) => {
        if (!active) return;
        setPaper(data);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error fetching paper:', err);
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  return { paper, loading, error };
}

// ── Increment download count ─────────────────────────────────

export async function incrementDownload(paperId: string) {
  if (!db) return;
  try {
    const paperRef = doc(db, 'papers', paperId);
    await updateDoc(paperRef, { downloads: increment(1) });
    clearFirestoreCache();
  } catch (err) {
    console.error('Error incrementing download:', err);
  }
}

export async function updatePaperStatus(paperId: string, status: PaperStatus) {
  if (!db) return;

  try {
    const paperRef = doc(db, 'papers', paperId);
    await updateDoc(paperRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    clearFirestoreCache();
  } catch (err) {
    console.error('Error updating paper status:', err);
    throw err;
  }
}
