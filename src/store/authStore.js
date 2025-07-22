import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  isLoggedIn: false,
  user: null,

  // Firebase instances
  _auth: null,
  _db: null,
  _appId: null,
  _onAuthStateChanged: null,
  _signOut: null,

  setFirebaseInstances: (auth, db, appId, onAuthStateChanged, signOut) => {
    set({
      _auth: auth,
      _db: db,
      _appId: appId,
      _onAuthStateChanged: onAuthStateChanged,
      _signOut: signOut,
    });
  },

  listenToAuthChanges: () => {
    const { _auth, _onAuthStateChanged } = get();
    if (_auth && _onAuthStateChanged) {
      _onAuthStateChanged(_auth, (user) => {
        if (user) {
          set({ isLoggedIn: true, user: user });
          window.useCartStore?.getState()?.loadCartFromFirestore(user.uid);
        } else {
          set({ isLoggedIn: false, user: null });
          window.useCartStore?.getState()?.clearCart();
        }
      });
    }
  },

  logout: async () => {
    const { _signOut, _auth, user } = get();
    const { cart, saveCartToFirestore } = window.useCartStore?.getState();
    try {
      if (user?.uid && saveCartToFirestore) {
        await saveCartToFirestore(user.uid, cart);
      }
      if (_signOut && _auth) {
        await _signOut(_auth);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },
}));
