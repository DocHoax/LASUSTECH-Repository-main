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
import { db, useLocalOnly, setUseLocalOnly } from '../lib/firebase';
import { Faculty, Paper } from '../types';
import { RECENT_PAPERS, FACULTIES } from '../constants';
import { useAuth } from '../context/AuthContext';

export type PaperStatus = NonNullable<Paper['status']>;

type CachedValue<T> = {
  expiresAt: number;
  data: T;
};

const firestoreCache = new Map<string, CachedValue<unknown>>();
const pendingReads = new Map<string, Promise<unknown>>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export function getLocalPapers(): Paper[] {
  try {
    const stored = window.localStorage.getItem('local-papers');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveLocalPaper(paper: Paper) {
  try {
    const papers = getLocalPapers();
    if (!papers.some((p) => p.id === paper.id)) {
      papers.unshift(paper);
      window.localStorage.setItem('local-papers', JSON.stringify(papers));
    }
  } catch (err) {
    console.error('Failed to save paper locally:', err);
  }
}

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
    return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as Faculty));
  });
}

async function fetchPapersByKey(key: string, q: ReturnType<typeof query>) {
  if (!db) return [] as Paper[];

  return getCachedRead(key, async () => {
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as Paper));
  });
}

export async function fetchPublishedPapers(localOnlyParam?: boolean) {
  const isLocal = localOnlyParam !== undefined ? localOnlyParam : useLocalOnly;
  const local = getLocalPapers().filter((p) => p.status === 'published');
  if (!db || isLocal) return [...local, ...RECENT_PAPERS] as Paper[];

  try {
    const q = query(
      collection(db, 'papers'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const data = await fetchPapersByKey('papers:published', q);
    return [...local, ...data];
  } catch (err) {
    console.warn('Firestore fetch failed, returning local papers:', err);
    return [...local, ...RECENT_PAPERS] as Paper[];
  }
}

async function fetchPaperById(id: string) {
  if (!db) return null;

  return getCachedRead(`paper:${id}`, async () => {
    const snapshot = await getDoc(doc(db, 'papers', id));
    return snapshot.exists() ? ({ id: snapshot.id, ...(snapshot.data() as any) } as Paper) : null;
  });
}

// ── Faculties ────────────────────────────────────────────────

export function useFaculties() {
  const { localOnly } = useAuth();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!db || localOnly) {
      setFaculties(FACULTIES);
      setLoading(false);
      return;
    }
    setLoading(true);

    fetchFaculties()
      .then((data) => {
        if (!active) return;
        setFaculties(data.length > 0 ? data : FACULTIES);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error fetching faculties:', err);
        setFaculties(FACULTIES);
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [localOnly]);

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
  const { localOnly } = useAuth();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filtersKey = JSON.stringify(filters || {});

  useEffect(() => {
    let active = true;

    const loadPapers = async () => {
      setLoading(true);
      try {
        const local = getLocalPapers().filter((p) => {
          if (filters?.status && p.status !== filters.status) return false;
          if (filters?.facultyId && p.facultyId !== filters.facultyId) return false;
          if (filters?.level && p.level !== filters.level) return false;
          if (filters?.semester && p.semester !== filters.semester) return false;
          if (filters?.type && p.type !== filters.type) return false;
          return true;
        });

        if (!db || localOnly) {
          const fallback = RECENT_PAPERS.filter((p) => {
            if (filters?.status && p.status !== filters.status) return false;
            if (filters?.facultyId && p.facultyId !== filters.facultyId) return false;
            if (filters?.level && p.level !== filters.level) return false;
            if (filters?.semester && p.semester !== filters.semester) return false;
            if (filters?.type && p.type !== filters.type) return false;
            return true;
          });
          if (active) setPapers([...local, ...fallback]);
          return;
        }

        const constraints: QueryConstraint[] = [];
        if (filters?.facultyId) constraints.push(where('facultyId', '==', filters.facultyId));
        if (filters?.level) constraints.push(where('level', '==', filters.level));
        if (filters?.semester) constraints.push(where('semester', '==', filters.semester));
        if (filters?.type) constraints.push(where('type', '==', filters.type));
        if (filters?.status) constraints.push(where('status', '==', filters.status));

        constraints.push(orderBy('createdAt', 'desc'));

        const q = query(collection(db, 'papers'), ...constraints);
        const data = await fetchPapersByKey(`papers:${filtersKey}`, q);
        if (active) setPapers([...local, ...data]);
      } catch (err: any) {
        console.warn('Firestore fetch failed, returning local papers:', err);
        const local = getLocalPapers().filter((p) => {
          if (filters?.status && p.status !== filters.status) return false;
          if (filters?.facultyId && p.facultyId !== filters.facultyId) return false;
          if (filters?.level && p.level !== filters.level) return false;
          if (filters?.semester && p.semester !== filters.semester) return false;
          if (filters?.type && p.type !== filters.type) return false;
          return true;
        });
        const fallback = RECENT_PAPERS.filter((p) => {
          if (filters?.status && p.status !== filters.status) return false;
          if (filters?.facultyId && p.facultyId !== filters.facultyId) return false;
          if (filters?.level && p.level !== filters.level) return false;
          if (filters?.semester && p.semester !== filters.semester) return false;
          if (filters?.type && p.type !== filters.type) return false;
          return true;
        });
        if (active) setPapers([...local, ...fallback]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPapers();

    return () => {
      active = false;
    };
  }, [filtersKey, localOnly]);

  return { papers, loading, error };
}

export function useRecentPapers(count: number = 6) {
  const { localOnly } = useAuth();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadRecent = async () => {
      setLoading(true);
      try {
        const local = getLocalPapers().filter((p) => p.status === 'published');
        if (!db || localOnly) {
          const merged = [...local, ...RECENT_PAPERS].slice(0, count);
          if (active) setPapers(merged);
          return;
        }

        const q = query(
          collection(db, 'papers'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          limit(count)
        );
        const data = await fetchPapersByKey(`recent:${count}`, q);
        const merged = [...local, ...data].slice(0, count);
        if (active) setPapers(merged);
      } catch (err: any) {
        console.warn('Firestore fetch failed, returning local papers:', err);
        const local = getLocalPapers().filter((p) => p.status === 'published');
        const merged = [...local, ...RECENT_PAPERS].slice(0, count);
        if (active) setPapers(merged);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadRecent();

    return () => {
      active = false;
    };
  }, [count, localOnly]);

  return { papers, loading, error };
}

export function usePaper(id: string | undefined) {
  const { localOnly } = useAuth();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!id) {
      setLoading(false);
      return;
    }

    const loadPaper = async () => {
      setLoading(true);
      try {
        const local = getLocalPapers().find((p) => p.id === id);
        if (local) {
          if (active) setPaper(local);
          return;
        }

        if (!db || localOnly) {
          const rec = RECENT_PAPERS.find((p) => p.id === id);
          if (active) setPaper(rec || null);
          return;
        }

        const data = await fetchPaperById(id);
        if (active) setPaper(data);
      } catch (err: any) {
        console.warn('Firestore fetch failed, returning local paper:', err);
        const local = getLocalPapers().find((p) => p.id === id);
        const rec = RECENT_PAPERS.find((p) => p.id === id);
        if (active) setPaper(local || rec || null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPaper();

    return () => {
      active = false;
    };
  }, [id, localOnly]);

  return { paper, loading, error };
}

// ── Increment download count ─────────────────────────────────

export async function incrementDownload(paperId: string) {
  try {
    const localPapers = getLocalPapers();
    const idx = localPapers.findIndex((p) => p.id === paperId);
    if (idx !== -1) {
      localPapers[idx].downloads += 1;
      window.localStorage.setItem('local-papers', JSON.stringify(localPapers));
    }
  } catch (err) {
    console.error('Error incrementing local download:', err);
  }

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
  try {
    const localPapers = getLocalPapers();
    const idx = localPapers.findIndex((p) => p.id === paperId);
    if (idx !== -1) {
      localPapers[idx].status = status;
      window.localStorage.setItem('local-papers', JSON.stringify(localPapers));
      clearFirestoreCache();
    }
  } catch (err) {
    console.error('Error updating local paper status:', err);
  }

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
  }
}
