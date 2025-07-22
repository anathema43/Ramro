import { create } from 'zustand';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getCartFromFirestore } from '../firebase/firestoreService';
import { useCartStore } from './cartStore';

export const useAuthStore = create((set) => ({
  currentUser: null,
  loading: true,

  fetchUser: () => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User has logged in. Let's fetch their saved cart from the database.
        const cartItems = await getCartFromFirestore(user.uid);
        useCartStore.getState().loadCart(cartItems); // Load the fetched cart into the cart store
        set({ currentUser: user, loading: false });
      } else {
        // User has logged out. Clear the cart from the app's memory.
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
        name: name,
        email: email,
      });
    }
  },

  login: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  logout: async () => {
    // When logging out, we just sign out. The listener above will handle clearing the local cart.
    await signOut(auth);
  },
}));