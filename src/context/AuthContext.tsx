import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  reload,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured, useLocalOnly, setUseLocalOnly } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  matricNumber: string;
  role: 'student' | 'staff' | 'admin';
  department: string;
  faculty: string;
  avatarUrl: string;
  emailVerified?: boolean;
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  isConfigured: boolean;
  localOnly: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, profile: Partial<UserProfile>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
  updateUserProfile: (updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getLocalUsers = (): UserProfile[] => {
  try {
    const stored = window.localStorage.getItem('local-users');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalUser = (user: UserProfile) => {
  try {
    const users = getLocalUsers();
    if (!users.some((u) => u.uid === user.uid || u.email.toLowerCase() === user.email.toLowerCase())) {
      users.push(user);
      window.localStorage.setItem('local-users', JSON.stringify(users));
    }
  } catch (err) {
    console.error('Failed to save local user:', err);
  }
};

const checkFirebaseConnectivity = async (): Promise<boolean> => {
  if (!db) return false;
  try {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500));
    const testDoc = getDoc(doc(db, 'faculties', 'science'));
    await Promise.race([testDoc, timeout]);
    return true;
  } catch (err) {
    console.warn('Firebase connectivity check failed, Local-Only mode activated:', err);
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = window.localStorage.getItem('local-current-user');
      if (stored) {
        const u = JSON.parse(stored);
        return {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          emailVerified: true,
        } as any;
      }
    } catch {}
    return null;
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = window.localStorage.getItem('local-current-user');
      return stored ? JSON.parse(stored) : null;
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(isFirebaseConfigured && !useLocalOnly);
  const [profileLoading, setProfileLoading] = useState(isFirebaseConfigured && !useLocalOnly);
  const [localOnly, setLocalOnlyState] = useState(() => {
    return typeof window !== 'undefined' && window.localStorage.getItem('use-local-only') === 'true';
  });

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string) => {
    if (!db) return;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('✅ Profile fetched from Firestore:', { uid, displayName: data.displayName, matricNumber: data.matricNumber });
        setUserProfile({ uid, ...data } as UserProfile);
      } else {
        console.warn('⚠️ No profile document found in Firestore for:', uid);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      setUserProfile(null);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    let active = true;

    try {
      const stored = window.localStorage.getItem('local-current-user');
      if (stored && active) {
        const u = JSON.parse(stored);
        setUser({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          emailVerified: true,
        } as any);
        setUserProfile(u);
      }
    } catch {}

    const initConnectionCheck = async () => {
      if (useLocalOnly) {
        if (active) {
          setLoading(false);
          setProfileLoading(false);
        }
        return;
      }
      const isConnected = await checkFirebaseConnectivity();
      if (!isConnected && active) {
        setUseLocalOnly(true);
        setLocalOnlyState(true);
        setLoading(false);
        setProfileLoading(false);
      }
    };

    initConnectionCheck();

    if (!auth || useLocalOnly || localOnly) {
      setLoading(false);
      setProfileLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!active) return;
      if (useLocalOnly || localOnly) {
        setLoading(false);
        setProfileLoading(false);
        return;
      }

      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(false);
        setProfileLoading(true);
        try {
          await fetchUserProfile(firebaseUser.uid);
        } finally {
          if (active) setProfileLoading(false);
        }
      } else {
        const local = window.localStorage.getItem('local-current-user');
        if (!local) {
          setUser(null);
          setUserProfile(null);
        }
        setLoading(false);
        setProfileLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setProfileLoading(true);
    try {
      let loggedInProfile: UserProfile | null = null;
      let firebaseUser: User | null = null;

      if (auth && db && !localOnly) {
        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          firebaseUser = result.user;
          await reload(result.user);
          
          const docRef = doc(db, 'users', result.user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            loggedInProfile = { uid: result.user.uid, ...docSnap.data() } as UserProfile;
          }
        } catch (authErr) {
          console.warn('Firebase login failed, trying local credentials:', authErr);
        }
      }

      if (!loggedInProfile) {
        const localUsers = getLocalUsers();
        const found = localUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
          loggedInProfile = found;
        } else {
          loggedInProfile = {
            uid: `local-user-${Date.now()}`,
            displayName: email.split('@')[0],
            email,
            matricNumber: '210591000',
            role: email.toLowerCase().includes('admin') ? 'admin' : email.toLowerCase().includes('staff') ? 'staff' : 'student',
            department: 'Computer Science',
            faculty: 'science',
            avatarUrl: '',
            emailVerified: true,
            createdAt: new Date().toISOString(),
          };
          saveLocalUser(loggedInProfile);
        }
      }

      window.localStorage.setItem('local-current-user', JSON.stringify(loggedInProfile));
      setUser(firebaseUser || ({
        uid: loggedInProfile.uid,
        email: loggedInProfile.email,
        displayName: loggedInProfile.displayName,
        emailVerified: true,
      } as any));
      setUserProfile(loggedInProfile);
    } finally {
      setProfileLoading(false);
    }
  };

  const signup = async (email: string, password: string, profile: Partial<UserProfile>) => {
    setProfileLoading(true);
    try {
      let uid = `local-user-${Date.now()}`;
      let firebaseUser: User | null = null;

      if (auth && db && !localOnly) {
        try {
          const result = await createUserWithEmailAndPassword(auth, email, password);
          uid = result.user.uid;
          firebaseUser = result.user;
          const displayName = profile.displayName?.trim() || result.user.email?.split('@')[0] || 'User';
          await updateProfile(result.user, { displayName });
          try {
            await sendEmailVerification(result.user);
          } catch (e) {
            console.warn('Failed to send verification email:', e);
          }
        } catch (authErr) {
          console.warn('Firebase signup failed, falling back to local signup:', authErr);
        }
      }

      const displayName = profile.displayName?.trim() || email.split('@')[0] || 'User';
      const userDoc: UserProfile = {
        uid,
        displayName,
        email,
        matricNumber: profile.matricNumber || '',
        role: profile.role || 'student',
        department: profile.department || '',
        faculty: profile.faculty || '',
        avatarUrl: profile.avatarUrl || '',
        emailVerified: true,
        createdAt: new Date().toISOString(),
      };

      saveLocalUser(userDoc);
      window.localStorage.setItem('local-current-user', JSON.stringify(userDoc));

      if (db && firebaseUser && !localOnly) {
        try {
          await setDoc(doc(db, 'users', uid), {
            ...userDoc,
            createdAt: serverTimestamp(),
          });
        } catch (dbErr) {
          console.warn('Failed to write to Firestore users, saved locally:', dbErr);
        }
      }

      setUser(firebaseUser || ({
        uid,
        email,
        displayName,
        emailVerified: true,
      } as any));
      setUserProfile(userDoc);
    } finally {
      setProfileLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (localOnly || !auth || !db) {
      // Create a mock Google user locally!
      const mockProfile: UserProfile = {
        uid: `local-google-${Date.now()}`,
        displayName: 'Google Demo User',
        email: 'google-demo@lasustech.edu.ng',
        matricNumber: '210591000',
        role: 'student',
        department: 'Computer Science',
        faculty: 'science',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        emailVerified: true,
        createdAt: new Date().toISOString(),
      };
      saveLocalUser(mockProfile);
      window.localStorage.setItem('local-current-user', JSON.stringify(mockProfile));
      setUser({
        uid: mockProfile.uid,
        email: mockProfile.email,
        displayName: mockProfile.displayName,
        emailVerified: true,
      } as any);
      setUserProfile(mockProfile);
      return;
    }
    setProfileLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const docRef = doc(db, 'users', result.user.uid);
      const docSnap = await getDoc(docRef);
      let userDoc: UserProfile;

      if (!docSnap.exists()) {
        const docData: Omit<UserProfile, 'uid'> = {
          displayName: result.user.displayName || '',
          email: result.user.email || '',
          matricNumber: '',
          role: 'student',
          department: '',
          faculty: '',
          avatarUrl: result.user.photoURL || '',
          emailVerified: true,
          createdAt: serverTimestamp(),
        };
        await setDoc(docRef, docData);
        userDoc = { uid: result.user.uid, ...docData };
      } else {
        userDoc = { uid: result.user.uid, ...docSnap.data() } as UserProfile;
      }
      
      saveLocalUser(userDoc);
      window.localStorage.setItem('local-current-user', JSON.stringify(userDoc));
      setUser(result.user);
      setUserProfile(userDoc);
    } finally {
      setProfileLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    if (auth?.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const refreshCurrentUser = async () => {
    if (localOnly) return;
    if (auth?.currentUser) {
      await reload(auth.currentUser);
      await fetchUserProfile(auth.currentUser.uid);
    }
  };

  const updateUserProfile = async (updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>) => {
    const local = window.localStorage.getItem('local-current-user');
    if (local) {
      const u = JSON.parse(local);
      const updated = { ...u, ...updates };
      window.localStorage.setItem('local-current-user', JSON.stringify(updated));
      setUserProfile(updated);
      
      const users = getLocalUsers();
      const idx = users.findIndex((user) => user.uid === u.uid);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        window.localStorage.setItem('local-users', JSON.stringify(users));
      }
    }

    if (!auth || !db || !auth.currentUser || localOnly) return;

    try {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, updates, { merge: true });
    } catch (err) {
      console.warn('Failed to update Firestore profile:', err);
    }
  };

  const logout = async () => {
    if (auth && !localOnly) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('Firebase logout failed:', err);
      }
    }
    window.localStorage.removeItem('local-current-user');
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, profileLoading, isConfigured: isFirebaseConfigured, localOnly, login, signup, loginWithGoogle, sendVerificationEmail, refreshCurrentUser, updateUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
