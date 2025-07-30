// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase is properly configured
const isFirebaseConfigured = Object.values(firebaseConfig).every(value => 
  value && value !== 'undefined' && value !== '' && !value.includes('placeholder') && !value.includes('your_')
);

if (!isFirebaseConfigured) {
  console.warn('⚠️ Firebase configuration is incomplete. Please check your .env file and ensure all VITE_FIREBASE_* variables are set.');
  
  // In development, show warning but don't crash the app
  if (import.meta.env.DEV) {
    console.warn('🔧 Development mode: Firebase not configured yet. Some features will be limited.');
  } else {
    // Only throw error in production
    throw new Error('Firebase configuration is required. Please set up your environment variables.');
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Enable offline persistence for Firestore
import { enableNetwork, disableNetwork } from "firebase/firestore";

export const enableOffline = () => disableNetwork(db);
export const enableOnline = () => enableNetwork(db);

export default app;
