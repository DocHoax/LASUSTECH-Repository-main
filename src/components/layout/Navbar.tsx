import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, Bell, Settings, Menu, GraduationCap, ArrowRight, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, logout } = useAuth();

  const navLinks = [
    { path: '/', label: 'REPOSITORY' },
    { path: '/directory', label: 'FACULTY' },
    { path: '/upload', label: 'UPLOAD' }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100 h-16 sm:h-20 px-4 sm:px-6 md:px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-12 min-w-0">
          <Link to="/" className="group flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5 md:w-6 md:h-6 fill-current" />
            </div>
            <span className="text-lg md:text-xl font-black text-primary font-headline tracking-tighter uppercase hidden xs:block">
              LASUSTECH <span className="text-secondary">VAULT</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex gap-8 items-center">
            {navLinks.map((item) => (
              <button 
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={cn(
                  "font-black text-[10px] uppercase tracking-[0.2em] transition-all relative py-2",
                  isActive(item.path) 
                    ? "text-primary" 
                    : "text-slate-400 hover:text-primary"
                )}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 w-full h-1 bg-secondary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-50 transition-all rounded-xl relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
            </button>
            
            <button 
              onClick={() => handleNavigate('/settings')}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-50 transition-all rounded-xl"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
          
          {user ? (
            <button 
              onClick={() => handleNavigate('/settings')}
              className="flex items-center gap-2 md:gap-3 group"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-slate-100 overflow-hidden ring-2 md:ring-4 ring-white shadow-md group-hover:ring-primary/10 transition-all">
                {userProfile?.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                    {(userProfile?.displayName || user.email || '?')[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-black text-primary uppercase tracking-widest leading-none">
                  {userProfile?.displayName || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">
                  {userProfile?.role === 'admin' ? 'Admin' : 'Verified Student'}
                </p>
              </div>
            </button>
          ) : (
            <button
              onClick={() => handleNavigate('/login')}
              className="px-6 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Sign In
            </button>
          )}
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl shadow-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[min(20rem,85vw)] sm:w-4/5 max-w-sm bg-white z-[70] lg:hidden shadow-2xl flex flex-col p-6 sm:p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                    <GraduationCap className="w-6 h-6 fill-current" />
                  </div>
                  <span className="text-xl font-black text-primary uppercase tracking-tighter">VAULT</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-400 rounded-xl"
                >
                  <Menu className="w-5 h-5 rotate-90" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Navigation</p>
                {navLinks.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-all",
                      isActive(item.path) 
                        ? "bg-primary text-white shadow-xl shadow-primary/20" 
                        : "text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
                    <ArrowRight className={cn("w-4 h-4", isActive(item.path) ? "text-tertiary" : "text-slate-300")} />
                  </button>
                ))}
              </div>

              <div className="mt-12 space-y-6">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Account</p>
                <button 
                  onClick={() => handleNavigate('/dashboard')}
                  className="w-full flex items-center gap-4 p-4 text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <Settings className="w-5 h-5" />
                  </div>
                  <span className="font-black text-xs uppercase tracking-widest">Dashboard</span>
                </button>
                <button 
                  onClick={() => handleNavigate('/settings')}
                  className="w-full flex items-center gap-4 p-4 text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <Settings className="w-5 h-5" />
                  </div>
                  <span className="font-black text-xs uppercase tracking-widest">Settings</span>
                </button>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-100">
                {user ? (
                  <button 
                    onClick={handleLogout}
                    className="w-full py-4 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-secondary/20"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button 
                    onClick={() => handleNavigate('/login')}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
