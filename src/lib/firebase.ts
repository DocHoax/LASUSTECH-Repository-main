import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

type FirebaseBundle = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
};

declare global {
  interface Window {
    __firebase?: FirebaseBundle;
  }
}

const bootstrapFirebase = typeof window !== 'undefined' ? window.__firebase : undefined;

// Check if Firebase is configured through the inline SDK bootstrap or local env values.
export const isFirebaseConfigured = Boolean(
  bootstrapFirebase || (firebaseConfig.apiKey && firebaseConfig.projectId)
);

let app: FirebaseApp | null = bootstrapFirebase?.app ?? null;
let auth: Auth | null = bootstrapFirebase?.auth ?? null;
let db: Firestore | null = bootstrapFirebase?.db ?? null;
let storage: FirebaseStorage | null = bootstrapFirebase?.storage ?? null;

if (!app && firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
} else {
  console.warn(
    '⚠️ Firebase is not configured. The app will run in demo mode with static data.\n' +
    'To enable full functionality, use the inline Firebase bootstrap in index.html or create a .env.local file with your Firebase config.\n' +
    'See .env.example for required variables.'
  );
}

export { app, auth, db, storage };
