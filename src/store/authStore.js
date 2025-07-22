import { create } from 'zustand';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

// Define the core store
export const useAuthStore = create((set) => ({
  currentUser: null,
  loading: true,
  setCurrentUser: (user) => set({ currentUser: user, loading: false }),
}));

// --- This is the critical change ---
// This function initializes the listener and updates the store from outside
export const initializeAuthListener = () => {
  onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setCurrentUser(user);
  });
};

// --- These functions now live outside the store but use Firebase directly ---
export const signup = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (userCredential.user) {
    await updateProfile(userCredential.user, { displayName: name });
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: name,
      email: email,
    });
    // The listener will automatically update the store
  }
};

export const login = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
  // The listener will automatically update the store
};

export const logout = async () => {
  await signOut(auth);
  // The listener will automatically update the store
};