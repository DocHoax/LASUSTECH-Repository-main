import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Zap, ShieldCheck, Leaf, PiggyBank, Loader2 } from 'lucide-react';
import { useRecentPapers } from '../hooks/useFirestore';
import { RECENT_PAPERS } from '../constants';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const { papers: recentPapers, loading } = useRecentPapers(3);

  // Fall back to constants if Firestore has no data yet
  const displayPapers = recentPapers.length > 0 ? recentPapers : RECENT_PAPERS;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickSearch = (tag: string) => {
    navigate(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="space-y-20 sm:space-y-24 lg:space-y-32 pb-20 sm:pb-24 lg:pb-32 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative -mt-8 -mx-4 sm:-mx-6 md:-mx-12 lg:-mx-16 px-4 sm:px-6 md:px-12 lg:px-16 py-16 sm:py-20 lg:py-40 overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" 
            alt="Library" 
            className="w-full h-full object-cover scale-110 blur-sm"
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/50 via-primary to-primary"></div>
        
        <div className="max-w-screen-xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-20">
          <div className="flex-1 space-y-8 sm:space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-tertiary shadow-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
              </span>
              INSTITUTIONAL KNOWLEDGE HUB
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-8xl font-headline font-extrabold text-white tracking-tight leading-[1.05]">
              Master Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-tertiary to-secondary">Curriculum.</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-blue-100/80 max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
              The definitive digital archive for LASUSTECH scholars. Access verified past questions, lecture summaries, and research papers with zero friction.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 justify-center lg:justify-start">
              <button 
                onClick={() => navigate('/directory')}
                className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-secondary text-white font-bold rounded-2xl shadow-2xl shadow-secondary/20 hover:shadow-secondary/40 hover:-translate-y-1 transition-all active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Exploring <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
              <button 
                onClick={() => navigate('/directory')}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white/5 text-white backdrop-blur-md border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all hover:border-white/20"
              >
                View Catalog
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-8 border-t border-white/5">
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-black text-white">4.2k+</p>
                <p className="text-[10px] text-blue-300 uppercase font-bold tracking-widest">Artifacts</p>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-black text-white">12k+</p>
                <p className="text-[10px] text-blue-300 uppercase font-bold tracking-widest">Downloads</p>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-black text-white">98%</p>
                <p className="text-[10px] text-blue-300 uppercase font-bold tracking-widest">Accuracy</p>
              </div>
            </div>
          </div>

          {/* Bento Grid Highlight */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative">
            <div className="absolute -inset-4 bg-secondary/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="group bg-white/5 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-end min-h-[180px] sm:min-h-[200px] hover:bg-white/10 transition-all hover:-translate-y-1">
              <div className="p-3 bg-tertiary/20 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <PiggyBank className="text-tertiary w-8 h-8" />
              </div>
              <h3 className="text-white text-lg font-bold mb-2">Zero Printing</h3>
              <p className="text-white/50 text-sm leading-relaxed">Save thousands on manual paper photocopies and bulky folders.</p>
            </div>
            <div className="group bg-white/5 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-end min-h-[180px] sm:min-h-[200px] mt-0 sm:mt-12 hover:bg-white/10 transition-all hover:-translate-y-1">
              <div className="p-3 bg-secondary/20 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-secondary w-8 h-8" />
              </div>
              <h3 className="text-white text-lg font-bold mb-2">Instant Access</h3>
              <p className="text-white/50 text-sm leading-relaxed">Download materials directly to your mobile device in seconds.</p>
            </div>
            <div className="group bg-white/5 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-end min-h-[180px] sm:min-h-[200px] hover:bg-white/10 transition-all hover:-translate-y-1">
              <div className="p-3 bg-blue-400/20 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-blue-300 w-8 h-8" />
              </div>
              <h3 className="text-white text-lg font-bold mb-2">Verified Subs</h3>
              <p className="text-white/50 text-sm leading-relaxed">Every document is vetted by department leads for accuracy.</p>
            </div>
            <div className="group bg-white/5 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-end min-h-[180px] sm:min-h-[200px] mt-0 sm:mt-12 hover:bg-white/10 transition-all hover:-translate-y-1">
              <div className="p-3 bg-green-400/20 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="text-green-400 w-8 h-8" />
              </div>
              <h3 className="text-white text-lg font-bold mb-2">Eco-Friendly</h3>
              <p className="text-white/50 text-sm leading-relaxed">Reducing carbon footprint through digital-first study habits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Command Search Bar */}
      <section className="max-w-screen-lg mx-auto -mt-16 relative z-20 px-4">
        <form onSubmit={handleSearch} className="bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-3xl p-2 md:p-3 flex flex-col md:flex-row items-center gap-4 border border-slate-100 ring-4 md:ring-8 ring-slate-50/50">
          <div className="hidden md:block pl-6 text-slate-300">
            <Search className="w-7 h-7" />
          </div>
          <div className="flex-1 w-full flex items-center gap-4 md:gap-0">
            <div className="md:hidden pl-4 text-slate-300">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course code (e.g., CSC 201)..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-primary placeholder:text-slate-300 py-4 md:py-5 text-base md:text-lg font-medium"
            />
          </div>
          <button type="submit" className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-container transition-all hover:shadow-xl hover:shadow-primary/20 active:scale-95">
            Search Archive
          </button>
        </form>
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-6">
          {['CSC 201', 'MTH 101', 'GST 102', 'BIO 204'].map(tag => (
            <button 
              key={tag} 
              onClick={() => handleQuickSearch(tag)}
              className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-xs font-bold hover:bg-primary hover:text-white transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Latest Uploads */}
      <section className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 sm:mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-primary tracking-tight">Latest Uploads</h2>
            <p className="text-slate-500 mt-3 text-base sm:text-lg">Recently verified examination papers and solutions.</p>
          </div>
          <button 
            onClick={() => navigate('/directory')}
            className="group px-6 py-3 bg-slate-50 text-primary font-bold rounded-xl flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
          >
            Explore Full Library <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading && recentPapers.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayPapers.map((paper) => (
              <div 
                key={paper.id}
                onClick={() => navigate(`/paper/${paper.id}`)}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-8">
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-100">
                    {paper.level}
                  </div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{paper.date}</span>
                </div>
                <h4 className="font-headline font-bold text-2xl text-primary mb-4 leading-tight group-hover:text-secondary transition-colors">
                  {paper.title}
                </h4>
                <p className="text-slate-500 mb-8 leading-relaxed line-clamp-2">
                  {paper.type} ({paper.year}) Session with detailed logic solutions and marking guide.
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Format</p>
                      <p className="text-xs font-bold text-primary">PDF • {paper.pages} Pages</p>
                    </div>
                  </div>
                  <button className="text-secondary font-black text-xs uppercase tracking-widest hover:underline">View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-screen-xl mx-auto px-4">
        <div className="bg-primary rounded-[2rem] sm:rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-3xl relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 blur-[120px] pointer-events-none"></div>
          <div className="md:w-1/2 p-8 sm:p-12 lg:p-24 flex flex-col justify-center relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-extrabold text-white mb-6 sm:mb-8 leading-tight">Contribute to the <br/><span className="text-tertiary">Archive</span></h2>
            <p className="text-blue-100/70 text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 leading-relaxed font-light">
              The repository thrives on student contribution. Upload your scanned past questions or verified summaries to help fellow scholars. Every upload goes through a strict verification process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <button 
                onClick={() => navigate('/upload')}
                className="w-full sm:w-auto bg-secondary px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-white hover:scale-105 hover:shadow-2xl hover:shadow-secondary/40 transition-all active:scale-95"
              >
                Upload Now
              </button>
              <button className="w-full sm:w-auto bg-white/5 border border-white/10 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-white hover:bg-white/10 transition-all">
                Learn Ethics
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative min-h-[320px] sm:min-h-[420px] lg:min-h-[500px]">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
              alt="Students" 
              className="w-full h-full object-cover grayscale opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
            <div className="absolute bottom-4 sm:bottom-12 left-4 sm:left-12 right-4 sm:right-12 p-5 sm:p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
              <p className="text-white font-medium italic mb-4">"Contributing to the repository helped me organize my own study materials while helping hundreds of my juniors."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=9" alt="User" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Olatunji David</p>
                  <p className="text-blue-300 text-xs">Computer Science Alumnus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
