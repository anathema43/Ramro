import { create } from "zustand";

// Internal Firebase references for cartStore (these are set by App.jsx)
let _firebaseDb = null;
let _appId = null;
let _firebaseDoc = null;
let _firebaseGetDoc = null;
let _firebaseSetDoc = null;

export const useCartStore = create((set, get) => ({
  cart: [],

  // Action to set Firebase functions for cartStore. This is called once from App.jsx.
  setFirebaseCartFunctions: (db, appIdVal, docFn, getDocFn, setDocFn) => {
    _firebaseDb = db;
    _appId = appIdVal;
    _firebaseDoc = docFn;
    _firebaseGetDoc = getDocFn;
    _firebaseSetDoc = setDocFn;
  },

  addToCart: (product) => {
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      let newCart;
      if (existing) {
        newCart = state.cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...state.cart, { ...product, quantity: 1 }];
      }
      // Access user from authStore.getState() directly when saving cart
      const authState = window.useAuthStore.getState(); // Access via window for reliable cross-store access
      if (authState.user?.uid && _firebaseDb && _appId && _firebaseDoc && _firebaseSetDoc) {
        get().saveCartToFirestore(authState.user.uid, newCart);
      }
      return { cart: newCart };
    });
  },
  increaseQuantity: (id) => {
    set((state) => {
      const newCart = state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      const authState = window.useAuthStore.getState(); // Access via window
      if (authState.user?.uid && _firebaseDb && _appId && _firebaseDoc && _firebaseSetDoc) {
        get().saveCartToFirestore(authState.user.uid, newCart);
      }
      return { cart: newCart };
    });
  },
  decreaseQuantity: (id) => {
    set((state) => {
      const newCart = state.cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
      const authState = window.useAuthStore.getState(); // Access via window
      if (authState.user?.uid && _firebaseDb && _appId && _firebaseDoc && _firebaseSetDoc) {
        get().saveCartToFirestore(authState.user.uid, newCart);
      }
      return { cart: newCart };
    });
  },
  removeFromCart: (id) => {
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== id);
      const authState = window.useAuthStore.getState(); // Access via window
      if (authState.user?.uid && _firebaseDb && _appId && _firebaseDoc && _firebaseSetDoc) {
        get().saveCartToFirestore(authState.user.uid, newCart);
      }
      return { cart: newCart };
    });
  },
  clearCart: () => {
    set({ cart: [] });
    const authState = window.useAuthStore.getState(); // Access via window
    if (authState.user?.uid && _firebaseDb && _appId && _firebaseDoc && _firebaseSetDoc) {
      get().saveCartToFirestore(authState.user.uid, []);
    }
  },

  // Load cart from Firestore
  loadCartFromFirestore: async (userId) => {
    if (!userId || !_firebaseDb || !_appId || !_firebaseDoc || !_firebaseGetDoc) {
      console.warn('Cannot load cart: Firebase or User ID not initialized in cartStore.loadCartFromFirestore.');
      return;
    }
    try {
      const cartDocRef = _firebaseDoc(_firebaseDb, `artifacts/${_appId}/users/${userId}/cart/data`);
      const cartDocSnap = await _firebaseGetDoc(cartDocRef);
      if (cartDocSnap.exists()) {
        set({ cart: cartDocSnap.data().items || [] });
        console.log("Cart loaded from Firestore:", cartDocSnap.data().items);
      } else {
        set({ cart: [] }); // No cart found, initialize empty
        console.log("No cart found in Firestore for user, initializing empty.");
      }
    } catch (error) {
      console.error("Error loading cart from Firestore:", error);
      set({ cart: [] }); // Fallback to empty cart on error
    }
  },

  // Save cart to Firestore
  saveCartToFirestore: async (userId, cartItems) => {
    if (!userId || !_firebaseDb || !_appId || !_firebaseDoc || !_firebaseSetDoc || !cartItems) {
      console.warn('Cannot save cart: Firebase, User ID, or cartItems not initialized in cartStore.saveCartToFirestore.');
      return;
    }
    try {
      const cartDocRef = _firebaseDoc(_firebaseDb, `artifacts/${_appId}/users/${userId}/cart/data`);
      await _firebaseSetDoc(cartDocRef, { items: cartItems });
      console.log("Cart saved to Firestore.");
    } catch (error) {
      console.error("Error saving cart to Firestore:", error);
    }
  }
}));