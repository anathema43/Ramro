import { create } from 'zustand';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useCartStore } from './cartStore';
import { getCartFromFirestore, saveCartToFirestore } from '../firebase/firestoreService';

export const useAuthStore = create((set, get) => ({
  currentUser: null,
  loading: true,

  fetchUser: () => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const cartItems = await getCartFromFirestore(user.uid);
        useCartStore.getState().loadCart(cartItems);
        set({ currentUser: user, loading: false });
      } else {
        useCartStore.getState().clearLocalCart();
        set({ currentUser: null, loading: false });
      }
    });
  },

  signup: async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
      });
    }
  },

  login: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  logout: async () => {
    const { currentUser } = get();
    if (currentUser) {
      await saveCartToFirestore(currentUser.uid, useCartStore.getState().cart);
    }
    await signOut(auth);
  },
}));
