import React from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  CreditCard, 
  HelpCircle,
  Camera,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = React.useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'billing', label: 'Subscriptions', icon: CreditCard },
  ];

  const displayName = userProfile?.displayName || user?.displayName || 'User';
  const displayEmail = userProfile?.email || user?.email || '';
  const displayMatric = userProfile?.matricNumber || '';
  const displayDepartment = userProfile?.department || 'Computer Science';

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header>
        <h1 className="text-5xl font-headline font-extrabold text-primary tracking-tight mb-4 leading-tight">Account <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Settings</span></h1>
        <p className="text-slate-500 text-xl font-light leading-relaxed">Manage your institutional profile and repository preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <aside className="lg:col-span-4 space-y-3">
          <div className="bg-slate-50/50 p-2 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-none lg:w-full flex items-center justify-between p-4 md:p-5 rounded-2xl transition-all group",
                  activeTab === tab.id 
                    ? "bg-white shadow-xl shadow-primary/5 text-primary font-black ring-1 ring-slate-100" 
                    : "text-slate-400 hover:bg-white/50 hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all",
                    activeTab === tab.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 text-slate-400"
                  )}>
                    <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <span className="text-[10px] md:text-sm uppercase tracking-widest whitespace-nowrap">{tab.label}</span>
                </div>
                <ChevronRight className={cn("hidden lg:block w-4 h-4 transition-transform", activeTab === tab.id ? "translate-x-1 text-secondary" : "opacity-0 group-hover:opacity-100")} />
              </button>
            ))}
          </div>
          
          <div className="pt-6 px-4">
            <button className="w-full flex items-center gap-4 p-5 text-slate-400 hover:text-primary transition-all text-xs font-black uppercase tracking-widest bg-white rounded-2xl border border-transparent hover:border-slate-100 shadow-sm">
              <HelpCircle className="w-5 h-5 text-secondary" />
              Help & Support
            </button>
          </div>
        </aside>

        <main className="lg:col-span-8">
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 space-y-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[10rem] -mr-20 -mt-20 pointer-events-none"></div>
            
            {/* Profile Section */}
            <section className="space-y-10 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 overflow-hidden ring-8 ring-slate-50 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                    {userProfile?.avatarUrl ? (
                      <img 
                        src={userProfile.avatarUrl} 
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white text-4xl font-bold">
                        {displayName[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-2xl hover:scale-110 transition-transform active:scale-95">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-black text-primary tracking-tight">{displayName}</h3>
                  <p className="text-lg text-slate-500 font-light mt-1">{displayDepartment} • {userProfile?.role === 'admin' ? 'Admin' : '400 Level'}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                    <span className="px-4 py-1.5 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">
                      {user ? 'Verified' : 'Unverified'} {userProfile?.role === 'admin' ? 'Admin' : 'Student'}
                    </span>
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">Contributor</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                  <input type="text" defaultValue={displayName} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white rounded-2xl transition-all font-bold text-primary" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Institutional Email</label>
                  <input type="email" defaultValue={displayEmail} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white rounded-2xl transition-all font-bold text-primary" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Matric Number</label>
                  <div className="relative">
                    <input type="text" defaultValue={displayMatric || '210591000'} disabled className="w-full p-4 bg-slate-100 border-none rounded-2xl text-slate-400 font-bold cursor-not-allowed" />
                    <Shield className="absolute right-4 top-4 w-5 h-5 text-slate-300" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Department</label>
                  <select className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white rounded-2xl transition-all font-bold text-primary appearance-none">
                    <option>Computer Science</option>
                    <option>Mechanical Engineering</option>
                    <option>Accounting</option>
                  </select>
                </div>
              </div>
            </section>

            <div className="pt-10 border-t border-slate-50 flex flex-col sm:flex-row justify-end gap-4">
              <button className="px-10 py-4 text-slate-400 font-black uppercase tracking-widest hover:text-primary hover:bg-slate-50 rounded-2xl transition-all text-xs">Discard Changes</button>
              <button className="px-12 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all text-xs active:scale-95">Save Profile</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
