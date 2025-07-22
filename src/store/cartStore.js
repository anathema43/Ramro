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
    const cartRef = _doc(_db, `artifacts/${_appId}/users/${userId}/cart/data`);
    const docSnap = await _getDoc(cartRef);
    if (docSnap.exists() && docSnap.data().items) {
      set({ cart: docSnap.data().items });
    } else {
      set({ cart: [] });
    }
  },

  // Saves the cart to the correct Firestore path
  saveCartToFirestore: async (userId, cartItems) => {
    const { _db, _doc, _setDoc, _appId } = get();
    if (!_db || !_appId) return;
    const cartRef = _doc(_db, `artifacts/${_appId}/users/${userId}/cart/data`);
    await _setDoc(cartRef, { items: cartItems });
  },

  // --- Your existing cart functions remain the same ---
  addToCart: (product) => {
    set((state) => {
        const existing = state.cart.find((item) => item.id === product.id);
        if (existing) {
            return { cart: state.cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
    });
    // Auto-save on change
    const { cart, saveCartToFirestore, _appId } = get();
    const userId = window.useAuthStore.getState().user?.uid;
    if (userId && _appId) saveCartToFirestore(userId, cart);
  },
  increaseQuantity: (id) => { /* ... similar logic with auto-save ... */ },
  decreaseQuantity: (id) => { /* ... similar logic with auto-save ... */ },
  removeFromCart: (id) => { /* ... similar logic with auto-save ... */ },
  clearCart: () => set({ cart: [] }),
}));