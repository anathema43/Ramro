import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: [],
  // Firebase functions - will be set by App.jsx
  _db: null,
  _appId: null,
  _doc: null,
  _getDoc: null,
  _setDoc: null,

  // This function is called by App.jsx to give the store access to Firebase
  setFirebaseCartFunctions: (db, appId, doc, getDoc, setDoc) => {
    set({ _db: db, _appId: appId, _doc: doc, _getDoc: getDoc, _setDoc: setDoc });
  },

  // Fetches the cart from the correct Firestore path
  loadCartFromFirestore: async (userId) => {
    const { _db, _doc, _getDoc, _appId } = get();
    if (!_db || !_appId) return;
    try {
      const cartRef = _doc(_db, `artifacts/${_appId}/users/${userId}/cart/data`);
      const docSnap = await _getDoc(cartRef);
      if (docSnap.exists() && docSnap.data().items) {
        set({ cart: docSnap.data().items });
      } else {
        set({ cart: [] }); // If no cart in DB, start with an empty one
      }
    } catch (error) {
      console.error("Failed to load cart from Firestore:", error);
    }
  },

  // Saves the cart to the correct Firestore path
  saveCartToFirestore: async (userId, cartItems) => {
    const { _db, _doc, _setDoc, _appId } = get();
    if (!_db || !_appId) return;
    try {
      const cartRef = _doc(_db, `artifacts/${_appId}/users/${userId}/cart/data`);
      await _setDoc(cartRef, { items: cartItems });
    } catch (error) {
      console.error("Failed to save cart to Firestore:", error);
    }
  },
  
  // Your existing local cart functions
  addToCart: (product) => { /* ... your existing logic ... */ },
  increaseQuantity: (id) => { /* ... your existing logic ... */ },
  decreaseQuantity: (id) => { /* ... your existing logic ... */ },
  removeFromCart: (id) => { /* ... your existing logic ... */ },
  clearCart: () => set({ cart: [] }),
}));