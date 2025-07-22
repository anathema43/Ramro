import { create } from 'zustand';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getCartFromFirestore } from '../firebase/firestoreService';
import { useCartStore } from './cartStore';

export const useAuthStore = create((set) => ({
  currentUser: null,
  loading: true,

  // This function listens for auth changes and loads the user's cart.
  fetchUser: () => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in. Fetch their saved cart.
        const cartItems = await getCartFromFirestore(user.uid);
        useCartStore.getState().loadCart(cartItems);
        set({ currentUser: user, loading: false });
      } else {
        // User is logged out. Clear the cart and user state.
        useCartStore.getState().clearCart();
        set({ currentUser: null, loading: false });
      }
    });
  },

  // Signs up a new user and creates their profile.
  signup: async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name,
        email: email,
      });
      // The listener in fetchUser will automatically update the state.
    }
  },

  // Logs in an existing user.
  login: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    // The listener in fetchUser will automatically update the state and load the cart.
  },

  // Logs out the current user.
  logout: async () => {
    await signOut(auth);
    // The listener in fetchUser will automatically clear the state and cart.
  },
}));