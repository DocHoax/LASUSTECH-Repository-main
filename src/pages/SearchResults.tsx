import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, FileText, Zap, Loader2, SearchX, X } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { motion } from 'motion/react';

export const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const levelParam = searchParams.get('level') || '';
  const typeParam = searchParams.get('type') || '';
  const yearParam = searchParams.get('year') || '';
  const [localQuery, setLocalQuery] = React.useState(queryParam);
  const { results, loading, error } = useSearch(queryParam, {
    level: levelParam,
    type: typeParam,
    year: yearParam,
  });

  React.useEffect(() => {
    setLocalQuery(queryParam);
  }, [queryParam]);

  const levelOptions = ['', '100 Level', '200 Level', '300 Level', '400 Level', '800 Level'];
  const typeOptions = ['', 'Past Question', 'Lecture Note', 'Research Paper'];
  const yearOptions = ['', '2023/2024', '2022/2023', '2021/2022', '2020/2021', 'Undated'];

  const updateParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });
    setSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('level');
    next.delete('type');
    next.delete('year');
    setSearchParams(next);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      const next = new URLSearchParams(searchParams);
      next.set('q', localQuery.trim());
      setSearchParams(next);
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-16 sm:pb-20">
      <header className="space-y-6">
        <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Archive</button>
          <ArrowRight className="w-3 h-3 text-slate-300" />
          <span className="text-primary">Search Results</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
            Search <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-red-400">Results</span>
          </h1>
          {queryParam && (
            <p className="text-slate-500 text-base sm:text-lg font-light leading-relaxed">
              Showing results for "<span className="font-semibold text-primary">{queryParam}</span>"
              {!loading && <span className="text-slate-400"> — {results.length} {results.length === 1 ? 'result' : 'results'} found</span>}
            </p>
          )}
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-2xl w-full">
          <div className="bg-white shadow-lg rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center gap-3 border border-slate-100">
            <div className="pl-1 sm:pl-4 text-slate-300">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search by course code, title, or type..."
              className="flex-1 w-full bg-transparent border-none focus:ring-0 text-primary placeholder:text-slate-300 py-2 sm:py-3 text-sm sm:text-base font-medium"
            />
            <button type="submit" className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-primary-container transition-all active:scale-95">
              Search
            </button>
          </div>
        </form>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl">
          <select
            value={levelParam}
            onChange={(e) => updateParams({ level: e.target.value })}
            className="w-full bg-white border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium text-primary shadow-sm"
          >
            {levelOptions.map((option) => (
              <option key={option || 'any-level'} value={option}>
                {option || 'All Levels'}
              </option>
            ))}
          </select>
          <select
            value={typeParam}
            onChange={(e) => updateParams({ type: e.target.value })}
            className="w-full bg-white border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium text-primary shadow-sm"
          >
            {typeOptions.map((option) => (
              <option key={option || 'any-type'} value={option}>
                {option || 'All Types'}
              </option>
            ))}
          </select>
          <select
            value={yearParam}
            onChange={(e) => updateParams({ year: e.target.value })}
            className="w-full bg-white border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium text-primary shadow-sm"
          >
            {yearOptions.map((option) => (
              <option key={option || 'any-year'} value={option}>
                {option || 'All Years'}
              </option>
            ))}
          </select>
        </div>

        {(levelParam || typeParam || yearParam) && (
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active filters</span>
            {levelParam && <button type="button" onClick={() => updateParams({ level: '' })} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-50 text-slate-500 text-xs font-bold">{levelParam} <X className="w-3 h-3" /></button>}
            {typeParam && <button type="button" onClick={() => updateParams({ type: '' })} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-50 text-slate-500 text-xs font-bold">{typeParam} <X className="w-3 h-3" /></button>}
            {yearParam && <button type="button" onClick={() => updateParams({ year: '' })} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-50 text-slate-500 text-xs font-bold">{yearParam} <X className="w-3 h-3" /></button>}
            <button type="button" onClick={clearFilters} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-primary text-white text-xs font-black uppercase tracking-widest">Clear Filters</button>
          </div>
        )}
      </header>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Searching archive...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : results.length === 0 && (queryParam || levelParam || typeParam || yearParam) ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-6">
          <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center shadow-inner">
            <SearchX className="w-12 h-12 text-slate-300" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-headline font-bold text-primary">No Results Found</h3>
            <p className="text-slate-500 max-w-md">
              We couldn't find any papers matching "<span className="font-semibold">{queryParam || 'your filters'}</span>". Try a different course code or keyword.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4 px-4">
            {['CSC 201', 'MTH 101', 'BIO 204'].map((tag) => (
              <button
                key={tag}
                onClick={() => { setLocalQuery(tag); setSearchParams({ q: tag }); }}
                className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all border border-slate-100"
              >
                Try: {tag}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {results.map((paper, index) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/paper/${paper.id}`)}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start gap-3 mb-6">
                <div className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-100">
                  {paper.level}
                </div>
                <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-widest">
                  {paper.type}
                </span>
              </div>
              <h4 className="font-headline font-bold text-xl text-primary mb-2 leading-tight group-hover:text-secondary transition-colors">
                {paper.title}
              </h4>
              <p className="text-slate-400 text-sm font-bold mb-6">{paper.courseCode} • {paper.year}</p>
              <div className="flex items-center justify-between gap-4 pt-5 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">{paper.pages} Pages</span>
                </div>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {paper.downloads.toLocaleString()} downloads
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
