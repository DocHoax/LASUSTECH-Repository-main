import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Download, 
  Share2, 
  Bookmark, 
  Info, 
  Star, 
  ZoomIn, 
  FileText, 
  Eye, 
  Clock,
  Plus,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { usePaper, incrementDownload } from '../hooks/useFirestore';
import { cn } from '../lib/utils';

export const Detail: React.FC = () => {
  const navigate = useNavigate();
  const { paperId, facultyId } = useParams();
  const { paper, loading } = usePaper(paperId);

  // Fallback display data when no paper is loaded from Firestore
  const displayData = paper || {
    id: paperId || 'csc-202',
    title: 'Data Structures & Algorithms',
    courseCode: 'CSC 202',
    level: '200 Level',
    year: '2022/2023',
    semester: '2nd Semester',
    downloads: 1284,
    pages: 12,
    date: '2 days ago',
    type: 'Past Question',
    status: 'published' as const,
    fileUrl: '',
  };

  const handleDownload = async () => {
    if (paper?.fileUrl) {
      if (paper.id) await incrementDownload(paper.id);
      window.open(paper.fileUrl, '_blank');
    }
  };

  return (
    <div className="space-y-12">
      <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Repository</button>
        <ArrowRight className="w-3 h-3" />
        <button onClick={() => navigate('/directory')} className="hover:text-primary transition-colors">
          {facultyId ? facultyId.charAt(0).toUpperCase() + facultyId.slice(1) : 'Computer Science'}
        </button>
        <ArrowRight className="w-3 h-3" />
        <span className="text-primary">{displayData.courseCode} Detail</span>
      </nav>

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-10">
            <header>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-tertiary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-tertiary/20">
                <Star className="w-3 h-3 fill-current" />
                Featured Material
              </div>
              <h1 className="font-headline text-4xl lg:text-5xl font-extrabold text-primary leading-tight mb-4 tracking-tight">
                {displayData.title.split(' ').slice(0, -1).join(' ')} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                  {displayData.title.split(' ').slice(-1)[0]}
                </span>
              </h1>
              <p className="text-slate-500 flex items-center gap-3 text-xl font-light">
                <span className="font-bold text-primary bg-slate-100 px-3 py-1 rounded-lg">{displayData.courseCode}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                {displayData.semester} Examination
              </p>
            </header>

            <div className="relative group bg-slate-50 rounded-[2rem] md:rounded-[3rem] overflow-hidden aspect-[3/4] max-h-[600px] md:max-h-[800px] shadow-inner border-4 border-white ring-1 ring-slate-100">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 text-center">
                <div className="w-24 h-24 md:w-40 md:h-40 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-6 md:mb-10 group-hover:scale-110 transition-transform duration-700">
                  <FileText className="text-primary w-12 h-12 md:w-20 md:h-20 opacity-20" />
                </div>
                <h3 className="font-headline text-xl md:text-2xl font-extrabold text-primary mb-2 md:mb-4">Secure PDF Preview</h3>
                <p className="text-slate-500 text-sm md:text-base max-w-sm mx-auto mb-6 md:mb-10 leading-relaxed font-light">You are viewing a secure, watermarked preview of the {displayData.year} academic session past question paper.</p>
                <button className="px-8 md:px-10 py-3 md:py-4 bg-white text-primary border-2 border-slate-100 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:shadow-2xl hover:border-primary/10 transition-all flex items-center gap-3 active:scale-95">
                  <ZoomIn className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
                  Expand Preview
                </button>
              </div>
              <div className="absolute bottom-10 right-10 opacity-5 rotate-[-15deg] pointer-events-none select-none">
                <span className="font-headline font-black text-8xl text-primary">LASUSTECH</span>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-10 left-10 w-20 h-1 bg-primary/10 rounded-full"></div>
              <div className="absolute top-14 left-10 w-12 h-1 bg-primary/10 rounded-full"></div>
            </div>
          </div>

          <div className="w-full lg:w-[400px] space-y-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Document ID</p>
                  <p className="font-bold text-primary text-lg">LST-{displayData.courseCode.replace(' ', '-')}-{displayData.year.slice(-2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Downloads</p>
                  <p className="font-bold text-primary text-lg flex items-center justify-end gap-2">
                    <Download className="w-5 h-5 text-secondary" />
                    {displayData.downloads.toLocaleString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleDownload}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all mb-6 active:scale-95"
              >
                <Download className="w-5 h-5" />
                Download PDF ({displayData.pages} Pages)
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button className="py-4 px-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button className="py-4 px-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
                  <Bookmark className="w-4 h-4" /> Save
                </button>
              </div>
            </div>

            <div className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 space-y-8">
              <h4 className="font-headline font-extrabold text-xl text-primary flex items-center gap-3">
                <Info className="w-6 h-6 text-secondary" /> Paper Details
              </h4>
              <div className="space-y-5">
                {[
                  { label: 'Academic Year', value: displayData.year },
                  { label: 'Semester', value: displayData.semester },
                  { label: 'Level', value: displayData.level },
                  { label: 'Examiner', value: 'Dr. O. A. Balogun' },
                  { label: 'Difficulty', value: 'Moderate', badge: true },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-3 border-b border-slate-200/30 last:border-0">
                    <span className="text-sm text-slate-500 font-medium">{item.label}</span>
                    <span className={cn(
                      "text-sm font-bold",
                      item.badge ? "bg-tertiary/20 text-primary px-3 py-1 rounded-lg border border-tertiary/30" : "text-primary"
                    )}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-headline font-extrabold text-xl text-primary px-4">Related Papers</h4>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <button key={i} className="w-full text-left bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group border border-slate-50">
                    <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-2">{displayData.courseCode} • 2021</p>
                    <h5 className="font-bold text-primary leading-tight group-hover:text-secondary transition-colors text-lg">Data Structures Mid-Semester Quiz</h5>
                    <div className="flex items-center gap-5 mt-4">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Eye className="w-4 h-4" /> 450
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-4 h-4" /> 15m ago
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => navigate('/upload')}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 md:w-16 md:h-16 bg-secondary text-white rounded-2xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] flex items-center justify-center hover:scale-110 transition-transform z-50 group active:scale-95"
      >
        <Plus className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-90 transition-transform duration-500" />
      </button>
    </div>
  );
};
