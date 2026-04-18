import { useState, useEffect } from 'react';
import { Paper } from '../types';
import { RECENT_PAPERS } from '../constants';
import { fetchPublishedPapers } from './useFirestore';
import { isFirebaseConfigured } from '../lib/firebase';

export interface SearchFilters {
  level?: string;
  type?: string;
  year?: string;
  facultyId?: string;
  departmentId?: string;
}

export function useSearch(searchQuery: string, filters?: SearchFilters) {
  const [results, setResults] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filtersKey = JSON.stringify(filters || {});

  useEffect(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const hasQuery = normalizedQuery.length >= 2;
    const hasFilters = Boolean(filters?.level || filters?.type || filters?.year || filters?.facultyId || filters?.departmentId);

    if (!hasQuery && !hasFilters) {
      setResults([]);
      setLoading(false);
      return;
    }

    const search = async () => {
      setLoading(true);
      setError(null);

      try {
        const allPapers = isFirebaseConfigured ? await fetchPublishedPapers() : RECENT_PAPERS;
        const filtered = allPapers.filter((paper) => {
          const matchesQuery = !hasQuery || (
            paper.title.toLowerCase().includes(normalizedQuery) ||
            paper.courseCode.toLowerCase().includes(normalizedQuery) ||
            paper.type.toLowerCase().includes(normalizedQuery) ||
            paper.level.toLowerCase().includes(normalizedQuery) ||
            paper.year.toLowerCase().includes(normalizedQuery)
          );
          const matchesLevel = !filters?.level || paper.level === filters.level;
          const matchesType = !filters?.type || paper.type === filters.type;
          const matchesYear = !filters?.year || paper.year === filters.year;
          const matchesFaculty = !filters?.facultyId || paper.facultyId === filters.facultyId;
          const matchesDepartment = !filters?.departmentId || paper.departmentId === filters.departmentId;

          return matchesQuery && matchesLevel && matchesType && matchesYear && matchesFaculty && matchesDepartment;
        });

        setResults(filtered);
      } catch (err: any) {
        console.error('Search error:', err);
        setError(err.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filtersKey]);

  return { results, loading, error };
}
