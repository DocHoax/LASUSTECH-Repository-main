import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  matricNumber: string;
  role: 'student' | 'staff' | 'admin';
  department: string;
  faculty: string;
  avatarUrl: string;
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, profile: Partial<UserProfile>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string) => {
    if (!db) return;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile({ uid, ...docSnap.data() } as UserProfile);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase is not configured. Please set up your .env.local file.');
    const result = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserProfile(result.user.uid);
  };

  const signup = async (email: string, password: string, profile: Partial<UserProfile>) => {
    if (!auth || !db) throw new Error('Firebase is not configured. Please set up your .env.local file.');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const userDoc: Omit<UserProfile, 'uid'> = {
      displayName: profile.displayName || '',
      email: result.user.email || email,
      matricNumber: profile.matricNumber || '',
      role: profile.role || 'student',
      department: profile.department || '',
      faculty: profile.faculty || '',
      avatarUrl: profile.avatarUrl || '',
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', result.user.uid), userDoc);
    setUserProfile({ uid: result.user.uid, ...userDoc });
  };

  const loginWithGoogle = async () => {
    if (!auth || !db) throw new Error('Firebase is not configured. Please set up your .env.local file.');
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const docRef = doc(db, 'users', result.user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      const userDoc: Omit<UserProfile, 'uid'> = {
        displayName: result.user.displayName || '',
        email: result.user.email || '',
        matricNumber: '',
        role: 'student',
        department: '',
        faculty: '',
        avatarUrl: result.user.photoURL || '',
        createdAt: serverTimestamp(),
      };
      await setDoc(docRef, userDoc);
      setUserProfile({ uid: result.user.uid, ...userDoc });
    } else {
      setUserProfile({ uid: result.user.uid, ...docSnap.data() } as UserProfile);
    }
  };

  const updateUserProfile = async (updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>) => {
    if (!auth || !db || !auth.currentUser) {
      throw new Error('Firebase is not configured. Please set up your .env.local file.');
    }

    const uid = auth.currentUser.uid;
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, updates, { merge: true });
    setUserProfile((current) => (current ? ({ ...current, ...updates } as UserProfile) : null));
    await fetchUserProfile(uid);
  };

  const logout = async () => {
    if (auth) await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isConfigured: isFirebaseConfigured, login, signup, loginWithGoogle, updateUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
