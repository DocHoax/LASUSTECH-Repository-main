import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, ArrowRight, Search, Sparkles, BookOpen, Loader2, GraduationCap, Code, Network, Radio, Binary, Clock } from 'lucide-react';
import { motion } from 'motion/react';

const LEVELS = [
  {
    id: '100 Level',
    name: '100 Level Past Questions',
    description: 'Introductory courses in computer concepts, mathematics, and basic programming foundations.',
    icon: 'school',
    color: 'primary',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    papers: '120+ Papers',
    detail: '2 Semesters'
  },
  {
    id: '200 Level',
    name: '200 Level Past Questions',
    description: 'Foundational data structures, object-oriented concepts, and computer hardware systems.',
    icon: 'code',
    color: 'secondary',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    papers: '185+ Papers',
    detail: '2 Semesters'
  },
  {
    id: '300 Level',
    name: '300 Level Past Questions',
    description: 'Algorithms, internet architectures, software engineering, and database systems.',
    icon: 'lan',
    color: 'tertiary',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    papers: '240+ Papers',
    detail: '2 Semesters'
  },
  {
    id: '400 Level',
    name: '400 Level Past Questions',
    description: 'Advanced networks, wireless communication, data mining, and machine learning.',
    icon: 'cell_tower',
    color: 'primary',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    papers: '190+ Papers',
    detail: '2 Semesters'
  },
  {
    id: '800 Level',
    name: '800 Level Past Questions',
    description: 'Postgraduate research studies, advanced systems analysis, and design theories.',
    icon: 'terminal',
    color: 'secondary',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9d38452a6?auto=format&fit=crop&q=80&w=800',
    papers: '95+ Papers',
    detail: 'Postgrad'
  }
];

export const Directory: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRefineSearch = () => {
    navigate('/search');
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16 sm:pb-20 overflow-x-hidden">
      <header className="relative">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">
          <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Archive</button>
          <ArrowRight className="w-3 h-3 text-slate-300" />
          <span className="text-primary">CS Level Directory</span>
        </nav>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-10">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-primary/10"
            >
              <Sparkles className="w-3 h-3 text-secondary" />
              Computer Science Vault
            </motion.div>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-extrabold text-primary tracking-tight leading-[1.05] mb-6 sm:mb-8">
              Past Question <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-secondary">Level vaults</span>
            </h1>
            <p className="text-slate-500 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed font-light">
              Access the complete digital past question archives for the Computer Science department. Choose your academic level below to filter exam materials.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button onClick={handleRefineSearch} className="flex items-center gap-3 bg-white border-2 border-slate-100 px-6 sm:px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-primary hover:border-primary/20 hover:bg-slate-50 transition-all shadow-sm group">
              <Filter className="w-4 h-4 text-secondary group-hover:rotate-180 transition-transform duration-500" />
              Refine Search
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
        {LEVELS.map((level, index) => {
          const isFeatured = index === 2; // Make 300 Level featured/wider for bento grid balance
          return (
            <motion.article 
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/search?level=${encodeURIComponent(level.id)}`)}
              className={`group cursor-pointer transition-all duration-700 ${isFeatured ? "lg:col-span-8" : "lg:col-span-4"}`}
            >
              <div className="relative overflow-hidden bg-white rounded-[2rem] sm:rounded-[3rem] h-full p-6 sm:p-8 md:p-12 shadow-sm transition-all duration-700 hover:shadow-[0_60px_100px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-3 border border-slate-100 group-hover:border-primary/5">
                {/* Background Glow */}
                <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none ${level.color === 'secondary' ? "bg-secondary" : level.color === 'tertiary' ? "bg-tertiary" : "bg-primary"}`}></div>

                <div className={`flex flex-col gap-8 md:gap-12 relative z-10 ${isFeatured ? "md:flex-row" : "flex-col"}`}>
                  <div className={`aspect-square rounded-[2.5rem] overflow-hidden shrink-0 relative shadow-2xl ring-8 ring-slate-50 group-hover:ring-white transition-all duration-700 ${isFeatured ? "w-full md:w-2/5" : "w-24 md:w-32"}`}>
                    <img 
                      src={level.image} 
                      alt={level.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-700"></div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-8">
                        <div className={`p-5 rounded-[1.5rem] transition-all duration-500 shadow-lg shadow-primary/5 group-hover:scale-110 group-hover:shadow-xl ${level.color === 'secondary' ? "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white" : level.color === 'tertiary' ? "bg-tertiary/10 text-primary group-hover:bg-tertiary group-hover:text-primary" : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"}`}>
                          {level.icon === 'school' && <GraduationCap className="w-8 h-8" />}
                          {level.icon === 'code' && <Code className="w-8 h-8" />}
                          {level.icon === 'lan' && <Network className="w-8 h-8" />}
                          {level.icon === 'cell_tower' && <Radio className="w-8 h-8" />}
                          {level.icon === 'terminal' && <Binary className="w-8 h-8" />}
                        </div>
                        {isFeatured && (
                          <span className="bg-white/80 backdrop-blur-md text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-slate-100 shadow-sm">
                            Core Curriculum
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary mb-5 leading-tight tracking-tight group-hover:text-secondary transition-colors duration-500">{level.name}</h3>
                      <p className="text-slate-500 leading-relaxed mb-8 sm:mb-10 line-clamp-3 text-base sm:text-lg font-light group-hover:text-slate-600 transition-colors">{level.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 group-hover:bg-white group-hover:border-primary/5 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/5">
                          <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="w-4 h-4 text-slate-300 group-hover:text-secondary transition-colors" />
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Available Materials</p>
                          </div>
                          <p className="text-3xl font-black text-primary tracking-tighter">{level.papers}</p>
                        </div>
                        <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 group-hover:bg-white group-hover:border-primary/5 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/5">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-4 h-4 text-slate-300 group-hover:text-secondary transition-colors" />
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Academic Term</p>
                          </div>
                          <p className="text-3xl font-black text-primary tracking-tighter">{level.detail}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-12 flex items-center gap-4 text-primary font-black text-[11px] uppercase tracking-[0.2em] group-hover:text-secondary transition-all duration-500">
                      Explore level 
                      <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:border-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>

      <section className="mt-24 sm:mt-32 lg:mt-40 p-8 sm:p-12 md:p-20 bg-primary rounded-[2rem] sm:rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3)] relative overflow-hidden group/cta">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] pointer-events-none group-hover/cta:scale-110 transition-transform duration-1000"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none group-hover/cta:scale-110 transition-transform duration-1000"></div>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-16 relative z-10">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-tertiary text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-white/10">
              <Search className="w-3 h-3" />
              Course Search
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">Looking for a specific <br/><span className="text-tertiary">course code?</span></h2>
            <p className="text-blue-100/70 text-base sm:text-lg lg:text-xl font-light leading-relaxed">Search by course code, title, or academic year to quickly find matching past question papers.</p>
          </div>
          <div className="w-full lg:w-auto flex-1 max-w-xl relative">
            <form onSubmit={handleSearch} className="bg-white/5 backdrop-blur-2xl p-3 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center gap-3 group-focus-within/cta:border-white/20 transition-all">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-200/50 w-6 h-6" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. 'CSC 201' or 'Programming'" 
                  className="w-full h-16 bg-white/5 border-none rounded-2xl pl-16 pr-8 focus:ring-0 text-white placeholder:text-blue-200/30 text-lg font-medium focus:bg-white/10 transition-all"
                />
              </div>
              <button type="submit" className="w-full sm:w-auto h-16 px-12 bg-tertiary text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-tertiary/20 shrink-0 flex items-center justify-center gap-3">
                Search Archive
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
