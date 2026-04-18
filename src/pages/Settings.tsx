import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  CreditCard, 
  HelpCircle,
  Camera,
  ChevronRight,
  Loader2,
  BadgeCheck,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, sendVerificationEmail, refreshCurrentUser, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = React.useState('profile');
  const [saving, setSaving] = React.useState(false);
  const [verificationSending, setVerificationSending] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [profileName, setProfileName] = React.useState('');
  const [profileEmail, setProfileEmail] = React.useState('');
  const [profileDepartment, setProfileDepartment] = React.useState('Computer Science');

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
  const displayRole = userProfile?.role || 'student';

  React.useEffect(() => {
    setProfileName(displayName);
    setProfileEmail(displayEmail);
    setProfileDepartment(displayDepartment);
  }, [displayName, displayEmail, displayDepartment]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      await updateUserProfile({
        displayName: profileName.trim() || displayName,
        email: profileEmail.trim() || displayEmail,
        department: profileDepartment,
      });
      setStatusMessage('Profile updated successfully.');
    } catch (error: any) {
      setStatusMessage(error?.message || 'Unable to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setProfileName(displayName);
    setProfileEmail(displayEmail);
    setProfileDepartment(displayDepartment);
    setStatusMessage('Changes discarded.');
  };

  const handleAvatarEdit = async () => {
    const nextUrl = window.prompt('Enter an avatar image URL', userProfile?.avatarUrl || '');
    if (nextUrl === null) return;

    setSaving(true);
    setStatusMessage(null);
    try {
      await updateUserProfile({ avatarUrl: nextUrl.trim() });
      setStatusMessage('Avatar updated successfully.');
    } catch (error: any) {
      setStatusMessage(error?.message || 'Unable to update avatar.');
    } finally {
      setSaving(false);
    }
  };

  const handleResendVerification = async () => {
    setVerificationSending(true);
    setStatusMessage(null);
    try {
      await sendVerificationEmail();
      setStatusMessage('Verification email sent. Check your inbox.');
    } catch (error: any) {
      setStatusMessage(error?.message || 'Unable to send verification email.');
    } finally {
      setVerificationSending(false);
    }
  };

  const handleRefreshVerification = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      await refreshCurrentUser();
      setStatusMessage(auth.currentUser?.emailVerified ? 'Email verified successfully.' : 'Verification not complete yet.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
      <header>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-extrabold text-primary tracking-tight mb-4 leading-tight">Account <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Settings</span></h1>
        <p className="text-slate-500 text-base sm:text-lg lg:text-xl font-light leading-relaxed">Manage your institutional profile and repository preferences.</p>
      </header>

      <div className={cn(
        "rounded-[2rem] p-5 sm:p-6 border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4",
        user?.emailVerified ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100"
      )}>
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
            user?.emailVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          )}>
            <BadgeCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-primary">Email Verification</p>
            <p className="text-sm text-slate-600 mt-1">
              {user?.emailVerified
                ? 'Your email has been verified and your account is fully active.'
                : 'Your account still needs email verification before full access is granted.'}
            </p>
          </div>
        </div>
        {!user?.emailVerified && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={handleResendVerification} disabled={verificationSending} className="px-5 py-3 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest disabled:opacity-60 flex items-center justify-center gap-2">
              {verificationSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Resend Verification
            </button>
            <button type="button" onClick={handleRefreshVerification} disabled={saving} className="px-5 py-3 rounded-2xl bg-white text-primary border border-slate-100 text-xs font-black uppercase tracking-widest disabled:opacity-60">
              I&apos;ve Verified
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
        <aside className="lg:col-span-4 space-y-3">
          <div className="bg-slate-50/50 p-2 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-none min-w-[11rem] sm:min-w-[12rem] lg:min-w-0 lg:w-full flex items-center justify-between p-4 md:p-5 rounded-2xl transition-all group",
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
            <button type="button" onClick={() => window.location.href = 'mailto:support@lasustech.edu.ng'} className="w-full flex items-center gap-4 p-5 text-slate-400 hover:text-primary transition-all text-xs font-black uppercase tracking-widest bg-white rounded-2xl border border-transparent hover:border-slate-100 shadow-sm">
              <HelpCircle className="w-5 h-5 text-secondary" />
              Help & Support
            </button>
          </div>
        </aside>

        <main className="lg:col-span-8">
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] shadow-sm border border-slate-100 p-6 sm:p-8 lg:p-10 space-y-10 sm:space-y-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[10rem] -mr-20 -mt-20 pointer-events-none"></div>
            
            {/* Profile Section */}
            <section className="space-y-8 sm:space-y-10 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10">
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] sm:rounded-[2.5rem] bg-slate-100 overflow-hidden ring-8 ring-slate-50 shadow-2xl transition-transform duration-500 group-hover:scale-105">
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
                  <button type="button" onClick={handleAvatarEdit} className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-2xl hover:scale-110 transition-transform active:scale-95">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-center md:text-left max-w-full">
                  <h3 className="text-2xl sm:text-3xl font-black text-primary tracking-tight break-words">{displayName}</h3>
                  <p className="text-base sm:text-lg text-slate-500 font-light mt-1">{displayDepartment} • {displayRole === 'admin' ? 'Admin' : displayRole === 'staff' ? 'Staff' : 'Student'}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                    <span className="px-4 py-1.5 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">
                      {user ? 'Verified' : 'Unverified'} {displayRole === 'admin' ? 'Admin' : displayRole === 'staff' ? 'Staff' : 'Student'}
                    </span>
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">Contributor</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                  <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white rounded-2xl transition-all font-bold text-primary" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Institutional Email</label>
                  <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white rounded-2xl transition-all font-bold text-primary" />
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
                  <select value={profileDepartment} onChange={(e) => setProfileDepartment(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white rounded-2xl transition-all font-bold text-primary appearance-none">
                    <option>Computer Science</option>
                    <option>Mechanical Engineering</option>
                    <option>Accounting</option>
                  </select>
                </div>
              </div>
            </section>

            {statusMessage && (
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-sm font-medium text-slate-600">
                {statusMessage}
              </div>
            )}

            <div className="pt-8 sm:pt-10 border-t border-slate-50 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button type="button" onClick={handleDiscardChanges} className="px-8 sm:px-10 py-4 text-slate-400 font-black uppercase tracking-widest hover:text-primary hover:bg-slate-50 rounded-2xl transition-all text-xs">Discard Changes</button>
              <button type="button" onClick={handleSaveProfile} disabled={saving} className="px-10 sm:px-12 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all text-xs active:scale-95 disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
