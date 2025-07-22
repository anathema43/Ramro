import { create } from 'zustand';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getCartFromFirestore, saveCartToFirestore } from '../firebase/firestoreService'; // Make sure saveCartToFirestore is imported
import { useCartStore } from './cartStore';

export const useAuthStore = create((set) => ({
  currentUser: null,
  loading: true,

  fetchUser: () => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const cartItems = await getCartFromFirestore(user.uid);
        useCartStore.getState().loadCart(cartItems);
        set({ currentUser: user, loading: false });
      } else {
        useCartStore.getState().clearCart();
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
    const { currentUser } = useAuthStore.getState();
    if (currentUser) {
      // Save an empty cart to Firestore before signing out
      await saveCartToFirestore(currentUser.uid, []);
    }
    await signOut(auth);
  },
}));