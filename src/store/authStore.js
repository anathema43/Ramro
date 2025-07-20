import { create } from 'zustand';
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export const useAuthStore = create((set) => ({
  currentUser: null,
  loading: true,

  fetchUser: () => {
    return onAuthStateChanged(auth, (user) => {
      set({ currentUser: user, loading: false });
    });
  },

  signup: async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name,
        email: email,
      });
      set({ currentUser: auth.currentUser });
    }
  },

  login: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  logout: async () => {
    await signOut(auth);
    set({ currentUser: null });
  },
}));