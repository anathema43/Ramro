import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  // State
  isLoggedIn: false,
  user: null,
  
  // Firebase instances - will be set by App.jsx
  _auth: null,
  _db: null,
  _appId: null,
  _onAuthStateChanged: null,
  _signOut: null,

  // This function is called by App.jsx to give the store access to Firebase
  setFirebaseInstances: (auth, db, appId, onAuthStateChanged, signOut) => {
    set({
      _auth: auth, _db: db, _appId: appId,
      _onAuthStateChanged: onAuthStateChanged, _signOut: signOut
    });
  },

  // This starts the listener that keeps the user state in sync
  listenToAuthChanges: () => {
    const { _auth, _onAuthStateChanged } = get();
    if (_auth && _onAuthStateChanged) {
      _onAuthStateChanged(_auth, (user) => {
        if (user) {
          set({ isLoggedIn: true, user: user });
          // When a user logs in, load their cart from Firestore
          window.useCartStore.getState().loadCartFromFirestore(user.uid);
        } else {
          set({ isLoggedIn: false, user: null });
          // When a user logs out, clear the local cart state
          window.useCartStore.getState().clearCart();
        }
      });
    }
  },

  // This is the corrected logout function
  logout: async () => {
    const { _signOut, _auth, user } = get();
    const { cart, saveCartToFirestore } = window.useCartStore.getState();

    try {
      // 1. Save the current cart to the database BEFORE logging out
      if (user?.uid && saveCartToFirestore) {
        await saveCartToFirestore(user.uid, cart);
      }
      
      // 2. Sign the user out from Firebase
      if (_signOut && _auth) {
        await _signOut(_auth);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
    // The auth listener will automatically handle clearing the local state
  },
}));