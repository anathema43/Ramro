import { create } from 'zustand';
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getCartFromFirestore, saveCartToFirestore } from '../firebase/firestoreService';
import { useCartStore } from './cartStore';

export const useAuthStore = create((set, get) => ({
  currentUser: null,
  authError: '',
  authLoading: false,

  fetchUser: () => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const cartItems = await getCartFromFirestore(user.uid);
        useCartStore.getState().loadCart(cartItems);
        set({ currentUser: user });
      } else {
        useCartStore.getState().clearLocalCart();
        set({ currentUser: null });
      }
    });
  },

  signup: async (name, email, password) => {
    set({ authLoading: true, authError: '' });
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });
      await setDoc(doc(db, 'users', res.user.uid), {
        name,
        email,
      });
      set({ currentUser: res.user, authLoading: false });
      return { success: true };
    } catch (error) {
      set({ authError: error.message, authLoading: false });
      return { success: false, error: error.message };
    }
  },

  login: async (email, password) => {
    set({ authLoading: true, authError: '' });
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      set({ currentUser: res.user, authLoading: false });
      return { success: true };
    } catch (error) {
      set({ authError: error.message, authLoading: false });
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    const { currentUser } = get();
    if (currentUser) {
      await saveCartToFirestore(currentUser.uid, useCartStore.getState().cart);
    }
    await signOut(auth);
    set({ currentUser: null });
  },
}));
