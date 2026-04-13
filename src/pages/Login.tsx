import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  GraduationCap,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, loginWithGoogle, user } = useAuth();

  const [showPassword, setShowPassword] = React.useState(false);
  const [loginType, setLoginType] = React.useState<'student' | 'admin'>('student');
  const [isSignup, setIsSignup] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form fields
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [matricNumber, setMatricNumber] = React.useState('');

  const getAuthErrorMessage = (err: any) => {
    const code = err?.code || '';

    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return 'Invalid email or password. Please try again.';
    }

    if (code === 'auth/email-already-in-use') {
      return 'An account with this email already exists.';
    }

    if (code === 'auth/weak-password') {
      return 'Password must be at least 6 characters.';
    }

    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }

    if (code === 'auth/configuration-not-found' || code === 'auth/operation-not-allowed' || code === 'auth/unauthorized-domain') {
      return 'Firebase Authentication is not fully configured for this project. Enable Email/Password sign-in in Firebase Console and add this hosting domain to Authorized domains.';
    }

    return err?.message || 'An error occurred. Please try again.';
  };

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        await signup(email, password, {
          displayName,
          matricNumber,
          role: loginType === 'admin' ? 'admin' : 'student',
        });
      } else {
        await login(email, password);
      }
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(getAuthErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-primary relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" 
          alt="Library" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-3xl shadow-2xl bg-white relative z-10 border border-white/20 mx-4">
        {/* Branding Column */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-primary text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-tertiary rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-tertiary/20">
              <ShieldCheck className="text-primary w-8 h-8" />
            </div>
            <span className="inline-block px-3 py-1 bg-white/10 text-tertiary text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-white/10">Security First</span>
            <h1 className="font-headline text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">The <br/><span className="text-tertiary">Institutional</span> Vault</h1>
            <p className="text-blue-100 text-lg leading-relaxed font-light max-w-xs">Access LASUSTECH's verified research, thesis repository, and academic records through our encrypted gateway.</p>
          </div>
          
          <div className="relative z-10 mt-12 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="p-3 bg-tertiary/20 rounded-xl">
                <ShieldCheck className="text-tertiary w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold">Encrypted Connection</p>
                <p className="text-xs text-blue-300">256-bit SSL Protection active</p>
              </div>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-slate-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-primary bg-tertiary flex items-center justify-center text-[10px] font-bold text-primary">
                +2k
              </div>
            </div>
            <p className="text-xs text-blue-300 font-medium">Joined by over 2,000 students and staff this semester.</p>
          </div>

          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-800/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        {/* Login Form Column */}
        <div className="p-6 sm:p-8 md:p-16 flex flex-col justify-center">
          <div className="flex flex-col gap-6 md:gap-10">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex relative">
              <button 
                onClick={() => setLoginType('student')}
                className={`flex-1 py-3 text-sm font-bold transition-all rounded-xl z-10 ${loginType === 'student' ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-primary'}`}
              >
                Student Login
              </button>
              <button 
                onClick={() => setLoginType('admin')}
                className={`flex-1 py-3 text-sm font-bold transition-all rounded-xl z-10 ${loginType === 'admin' ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-primary'}`}
              >
                Staff/Admin Login
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-headline font-bold text-primary">
                {isSignup ? 'Create Account' : loginType === 'student' ? 'Welcome Back, Scholar' : 'Administrative Access'}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                {isSignup 
                  ? 'Register your account to start contributing to the institutional archive.'
                  : loginType === 'student' 
                    ? 'Please enter your email and password to access your academic vault.' 
                    : 'Authorized personnel only. Please provide your staff credentials to access the management portal.'}
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {isSignup && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-1 opacity-60">Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input 
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Adebayo Oluwaseun"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-primary font-semibold placeholder:text-slate-300"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-1 opacity-60">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={loginType === 'student' ? "e.g. student@lasustech.edu.ng" : "e.g. admin@lasustech.edu.ng"}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-primary font-semibold placeholder:text-slate-300"
                  />
                </div>
              </div>

              {isSignup && loginType === 'student' && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-1 opacity-60">Matriculation Number</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <input 
                      type="text"
                      value={matricNumber}
                      onChange={(e) => setMatricNumber(e.target.value)}
                      placeholder="e.g. 210591000"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-primary font-semibold placeholder:text-slate-300"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-bold text-primary uppercase tracking-widest opacity-60">Password</label>
                  {!isSignup && (
                    <button type="button" className="text-[11px] font-bold text-secondary hover:underline transition-all">Reset Password?</button>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-primary font-semibold placeholder:text-slate-300"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isSignup ? 'Create Account' : loginType === 'student' ? 'Enter Academic Vault' : 'Secure Admin Entry'}
                    <ShieldCheck className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <button 
                type="button"
                onClick={() => { setIsSignup(!isSignup); setError(null); }}
                className="text-sm text-slate-500 hover:text-primary transition-colors"
              >
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                <span className="font-bold text-secondary">{isSignup ? 'Sign In' : 'Create one'}</span>
              </button>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.2em]"><span className="bg-white px-6 text-slate-300">Institutional SSO</span></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center justify-center gap-3 py-4 px-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-primary/20 hover:bg-slate-50 transition-all text-sm font-bold text-primary shadow-sm disabled:opacity-50"
            >
              <Mail className="w-5 h-5 text-secondary" />
              Sign in with LASUSTECH Mail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
