import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  isLoggedIn: false,
  user: null,
  
  // Firebase instances - will be set by App.jsx
  _auth: null,
  _db: null,
  _appId: null,
  _onAuthStateChanged: null,
  _signOut: null,

  setFirebaseInstances: (auth, db, appId, onAuthStateChanged, signOut) => {
    set({
      _auth: auth, _db: db, _appId: appId,
      _onAuthStateChanged: onAuthStateChanged, _signOut: signOut
    });
  },

  listenToAuthChanges: () => {
    const { _auth, _onAuthStateChanged } = get();
    if (_auth && _onAuthStateChanged) {
      // This listener keeps the app's user state in sync with Firebase
      _onAuthStateChanged(_auth, (user) => {
        if (user) {
          set({ isLoggedIn: true, user: user });
          // When a user logs in, we tell the cart store to load their cart from Firestore
          window.useCartStore.getState().loadCartFromFirestore(user.uid);
        } else {
          set({ isLoggedIn: false, user: null });
          // When a user logs out, we clear the cart from the app's local memory
          window.useCartStore.getState().clearCart();
        }
      });
    }
  },

  // This is the corrected logout function
  logout: async () => {
    try {
      const state = get();
      const currentUser = state.user;
      const { cart, saveCartToFirestore } = window.useCartStore.getState();

      // 1. Save the current cart to the database BEFORE logging out
      if (currentUser && saveCartToFirestore && cart.length > 0) {
        await saveCartToFirestore(currentUser.uid, cart);
      }

      // 2. Proceed to sign out from Firebase
      if (state._signOut && state._auth) {
        await state._signOut(state._auth);
      }
      // The listener will automatically handle clearing the local state
    } catch (err) {
      console.error("Logout failed:", err);
    }
  },
}));