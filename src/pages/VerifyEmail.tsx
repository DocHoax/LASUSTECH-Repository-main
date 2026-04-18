import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Mail, RefreshCw, LogOut, ArrowRight, ShieldCheck, UserRound } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

type VerifyLocationState = {
  email?: string;
  role?: 'student' | 'staff' | 'admin';
  from?: { pathname?: string };
};

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, sendVerificationEmail, refreshCurrentUser, logout } = useAuth();
  const [sending, setSending] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const state = (location.state as VerifyLocationState) || {};
  const email = state.email || user?.email || userProfile?.email || '';
  const role = state.role || userProfile?.role || 'student';

  React.useEffect(() => {
    if (!user && !email) {
      navigate('/login', { replace: true });
      return;
    }

    if (user?.emailVerified) {
      const destination = state.from?.pathname || '/';
      navigate(destination, { replace: true });
    }
  }, [user, email, navigate, state.from]);

  const handleResend = async () => {
    setMessage(null);
    setSending(true);
    try {
      await sendVerificationEmail();
      setMessage('Verification email sent. Check your inbox or spam folder.');
    } catch (error: any) {
      setMessage(error?.message || 'Unable to send verification email right now.');
    } finally {
      setSending(false);
    }
  };

  const handleCheckStatus = async () => {
    setMessage(null);
    setChecking(true);
    try {
      await refreshCurrentUser();
      if (auth.currentUser?.emailVerified) {
        const destination = state.from?.pathname || '/';
        navigate(destination, { replace: true });
        return;
      }
      setMessage('Verification is still pending. Please use the link in your email first.');
    } catch (error: any) {
      setMessage(error?.message || 'Unable to refresh your verification status.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000"
          alt="Library"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-white/20 grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-between p-12 bg-primary text-white relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-tertiary rounded-2xl flex items-center justify-center shadow-lg shadow-tertiary/20">
              <ShieldCheck className="text-primary w-8 h-8" />
            </div>
            <span className="inline-block px-3 py-1 bg-white/10 text-tertiary text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">Verify to Continue</span>
            <h1 className="font-headline text-5xl font-extrabold tracking-tight leading-[1.05]">Finish your <br /><span className="text-tertiary">onboarding</span></h1>
            <p className="text-blue-100 text-lg leading-relaxed font-light max-w-xs">Verify your email address before accessing the LASUSTECH repository. This keeps student, staff, and admin accounts secure.</p>
          </div>

          <div className="relative z-10 space-y-4">
            {[
              'Create your account',
              'Verify your email',
              'Access your workspace',
            ].map((step, index) => (
              <div key={step} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-xl bg-tertiary text-primary flex items-center justify-center text-xs font-black">{index + 1}</div>
                <p className="text-sm font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10">
              <Mail className="w-3 h-3 text-secondary" />
              Email Verification
            </div>
            <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-primary tracking-tight">Check your inbox</h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We sent a verification link to <span className="font-bold text-primary break-all">{email || 'your email address'}</span>.
              Open the message, click the link, then return here to continue.
            </p>
          </div>

          <div className="bg-slate-50 rounded-[2rem] p-5 sm:p-6 border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                <UserRound className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Type</p>
                <p className="font-bold text-primary capitalize">{role}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Students, staff, and admins all follow the same verification step before getting access to the archive.
            </p>
          </div>

          {message && (
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-sm font-medium text-slate-600">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={sending}
              className="px-6 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Resend Email
            </button>
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={checking}
              className="px-6 py-4 rounded-2xl bg-white border border-slate-100 text-primary font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {checking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              I&apos;ve Verified
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all"
            >
              Back to Login
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex-1 px-6 py-4 rounded-2xl bg-secondary text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            If you do not see the email, check your spam or promotions folder. You can resend it as many times as needed.
          </p>
        </div>
      </div>
    </div>
  );
};