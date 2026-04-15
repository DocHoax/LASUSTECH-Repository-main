import { useState, useEffect } from 'react';
import { Paper } from '../types';
import { RECENT_PAPERS } from '../constants';
import { fetchPublishedPapers } from './useFirestore';
import { isFirebaseConfigured } from '../lib/firebase';

export function useSearch(searchQuery: string) {
  const [results, setResults] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const search = async () => {
      setLoading(true);
      setError(null);

      try {
        const allPapers = isFirebaseConfigured ? await fetchPublishedPapers() : RECENT_PAPERS;

        const normalizedQuery = searchQuery.toLowerCase().trim();
        const filtered = allPapers.filter((paper) => {
          return (
            paper.title.toLowerCase().includes(normalizedQuery) ||
            paper.courseCode.toLowerCase().includes(normalizedQuery) ||
            paper.type.toLowerCase().includes(normalizedQuery) ||
            paper.level.toLowerCase().includes(normalizedQuery) ||
            paper.year.toLowerCase().includes(normalizedQuery)
          );
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
  }, [searchQuery]);

  return { results, loading, error };
}
