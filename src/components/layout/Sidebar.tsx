import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Folder, 
  UploadCloud, 
  ShieldCheck, 
  HelpCircle, 
  LogOut,
  GraduationCap,
  LogIn
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { openMailto } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { path: '/directory', label: 'FACULTY DIRECTORY', icon: Folder },
    { path: '/upload', label: 'MY CONTRIBUTIONS', icon: UploadCloud },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-16 sm:top-20 bottom-0 z-40 w-72 hidden lg:flex flex-col py-10 gap-8 bg-white border-r border-slate-100 overflow-y-auto">
      <div className="px-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 mb-12"
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <GraduationCap className="w-6 h-6 fill-current" />
          </div>
          <span className="text-xl font-black text-primary font-headline tracking-tighter uppercase">
            LASUSTECH <span className="text-secondary">VAULT</span>
          </span>
        </button>

        <div className="flex items-center gap-4 p-5 bg-primary rounded-[2rem] border border-primary-container mb-10 shadow-xl shadow-primary/20">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
            <GraduationCap className="w-7 h-7 fill-current" />
          </div>
          <div>
            <h2 className="font-headline font-black text-white text-sm leading-tight tracking-tight">The Academic <br/>Curator</h2>
            <p className="text-[9px] text-blue-200 uppercase tracking-[0.2em] font-black mt-1">Digital Vault</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-4 transition-all duration-500 rounded-2xl group relative overflow-hidden",
              isActive(item.path) 
                ? "text-primary font-black" 
                : "text-slate-400 hover:text-primary hover:bg-slate-50"
            )}
          >
            <item.icon className={cn("w-5 h-5 relative z-10", isActive(item.path) && "text-primary")} />
            <span className="text-[10px] uppercase tracking-[0.15em] font-black relative z-10">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto px-4 space-y-2">
        <button
          type="button"
          onClick={() => openMailto('support@lasustech.edu.ng', 'LASUSTECH Repository Support')}
          className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Support</span>
        </button>
        {user ? (
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 text-secondary hover:bg-secondary/5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-4 px-6 py-4 text-primary hover:bg-primary/5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <LogIn className="w-5 h-5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </aside>
  );
};
