import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  where,
  QueryConstraint,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Faculty, Paper } from '../types';

// ── Faculties ────────────────────────────────────────────────

export function useFaculties() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'faculties'), orderBy('name'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Faculty));
        setFaculties(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching faculties:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
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

  useEffect(() => {
    if (!db) {
      setLoading(false);
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
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Paper));
        setPapers(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching papers:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [filters?.facultyId, filters?.level, filters?.semester, filters?.type, filters?.status]);

  return { papers, loading, error };
}

export function useRecentPapers(count: number = 6) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'papers'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Paper));
        setPapers(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching recent papers:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [count]);

  return { papers, loading, error };
}

export function usePaper(id: string | undefined) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !db) {
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      doc(db, 'papers', id),
      (snapshot) => {
        if (snapshot.exists()) {
          setPaper({ id: snapshot.id, ...snapshot.data() } as Paper);
        } else {
          setPaper(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching paper:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [id]);

  return { paper, loading, error };
}

// ── Increment download count ─────────────────────────────────

export async function incrementDownload(paperId: string) {
  if (!db) return;
  try {
    const paperRef = doc(db, 'papers', paperId);
    await updateDoc(paperRef, { downloads: increment(1) });
  } catch (err) {
    console.error('Error incrementing download:', err);
  }
}
