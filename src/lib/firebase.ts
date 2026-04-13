import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBOKtoyee4K5aRQ2NbY8W8htej5W5CmQiw',
  authDomain: 'lasustech-repository.firebaseapp.com',
  projectId: 'lasustech-repository',
  storageBucket: 'lasustech-repository.firebasestorage.app',
  messagingSenderId: '679123900694',
  appId: '1:679123900694:web:99545245f6a4ef89821837',
  measurementId: 'G-6H55Z174VZ',
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn('Firebase initialization failed:', error);
}

export { app, auth, db, storage };
