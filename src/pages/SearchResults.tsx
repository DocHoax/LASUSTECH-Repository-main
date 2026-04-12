import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, FileText, Zap, Loader2, SearchX } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { motion } from 'motion/react';

export const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [localQuery, setLocalQuery] = React.useState(queryParam);
  const { results, loading, error } = useSearch(queryParam);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="space-y-6">
        <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Archive</button>
          <ArrowRight className="w-3 h-3 text-slate-300" />
          <span className="text-primary">Search Results</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
            Search <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-red-400">Results</span>
          </h1>
          {queryParam && (
            <p className="text-slate-500 text-lg font-light">
              Showing results for "<span className="font-semibold text-primary">{queryParam}</span>"
              {!loading && <span className="text-slate-400"> — {results.length} {results.length === 1 ? 'result' : 'results'} found</span>}
            </p>
          )}
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="bg-white shadow-lg rounded-2xl p-2 flex items-center gap-3 border border-slate-100">
            <div className="pl-4 text-slate-300">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search by course code, title, or type..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-primary placeholder:text-slate-300 py-3 text-base font-medium"
            />
            <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-primary-container transition-all active:scale-95">
              Search
            </button>
          </div>
        </form>
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
      ) : results.length === 0 && queryParam ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center shadow-inner">
            <SearchX className="w-12 h-12 text-slate-300" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-headline font-bold text-primary">No Results Found</h3>
            <p className="text-slate-500 max-w-md">
              We couldn't find any papers matching "<span className="font-semibold">{queryParam}</span>". Try a different course code or keyword.
            </p>
          </div>
          <div className="flex gap-3 mt-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((paper, index) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/paper/${paper.id}`)}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-6">
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
              <div className="flex items-center justify-between pt-5 border-t border-slate-50">
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
