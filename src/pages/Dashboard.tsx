import React from 'react';
import { 
  FileText, 
  Users, 
  Database, 
  TrendingUp, 
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useRecentPapers } from '../hooks/useFirestore';
import { RECENT_PAPERS } from '../constants';
import { cn } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const { papers: recentPapers, loading } = useRecentPapers(3);
  const displayPapers = recentPapers.length > 0 ? recentPapers : RECENT_PAPERS;

  const stats = [
    { label: 'Total Artifacts', value: '4,284', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5.2%' },
    { label: 'Active Contributors', value: '1,102', icon: Users, color: 'text-secondary', bg: 'bg-secondary/5', trend: '+12.1%' },
    { label: 'Storage Used', value: '84.2 GB', icon: Database, color: 'text-tertiary', bg: 'bg-tertiary/10', trend: '85% cap' },
    { label: 'Monthly Growth', value: '+12.4%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', trend: 'Steady' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tight">Curator Dashboard</h1>
          <p className="text-slate-500 text-lg font-light mt-1">System overview and artifact management control panel.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary/10 transition-all shadow-sm">Export Report</button>
          <button className="px-8 py-3 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:scale-95">System Audit</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:bg-primary/5"></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", stat.bg)}>
                <stat.icon className={cn("w-7 h-7", stat.color)} />
              </div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <h3 className="text-3xl font-black text-primary tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div>
              <h3 className="font-headline font-extrabold text-xl text-primary">Recent Submissions</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Awaiting verification</p>
            </div>
            <button className="text-secondary text-xs font-black uppercase tracking-widest hover:underline">View All Records</button>
          </div>
          <div className="overflow-x-auto">
            {loading && recentPapers.length === 0 ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-5">Artifact Details</th>
                    <th className="px-8 py-5">Contributor</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {displayPapers.map((paper) => (
                    <tr key={paper.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">{paper.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{paper.courseCode} • {paper.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                            <img src={`https://i.pravatar.cc/150?u=${paper.id}`} alt="User" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs font-bold text-slate-600">Student #{Number(paper.id) + 2000}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                          paper.status === 'published' ? "bg-green-50 text-green-700 border-green-100" :
                          paper.status === 'under-review' ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                          "bg-slate-50 text-slate-500 border-slate-100"
                        )}>
                          {paper.status === 'published' ? <CheckCircle2 className="w-3 h-3" /> : 
                           paper.status === 'under-review' ? <Clock className="w-3 h-3" /> :
                           <AlertCircle className="w-3 h-3" />}
                          {paper.status || 'Published'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="w-10 h-10 bg-white rounded-xl text-slate-300 hover:text-primary hover:shadow-md transition-all flex items-center justify-center">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-extrabold text-xl text-primary">Verification Queue</h3>
              <span className="w-6 h-6 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-[10px] font-black">3</span>
            </div>
            <div className="space-y-5">
              {[
                { title: 'MTH 101 Past Question', time: '12m ago', status: 'urgent' },
                { title: 'BIO 204 Lecture Notes', time: '1h ago', status: 'normal' },
                { title: 'GST 102 Summary', time: '3h ago', status: 'normal' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 p-4 hover:bg-slate-50 rounded-[1.5rem] transition-all cursor-pointer group border border-transparent hover:border-slate-100">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                    item.status === 'urgent' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                  )}>
                    {item.status === 'urgent' ? <AlertCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors leading-tight">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1.5">{item.time} • Awaiting Review</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-sm">
              Open Full Queue
            </button>
          </div>

          <div className="bg-secondary text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
            <h3 className="font-headline font-extrabold text-2xl mb-3 relative z-10">Storage Alert</h3>
            <p className="text-white/70 text-sm mb-8 relative z-10 font-light leading-relaxed">Institutional storage is reaching 85% capacity. Consider archiving older sessions to free up space.</p>
            <div className="w-full bg-white/10 h-2 rounded-full mb-8 relative z-10 overflow-hidden">
              <div className="bg-tertiary w-[85%] h-full rounded-full shadow-[0_0_20px_rgba(255,215,0,0.5)]"></div>
            </div>
            <button className="bg-white text-secondary px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest relative z-10 hover:scale-105 transition-transform shadow-xl">
              Manage Storage
            </button>
            <Database className="absolute -right-12 -bottom-12 w-48 h-48 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
};
