import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],

  _db: null,
  _appId: null,
  _doc: null,
  _getDoc: null,
  _setDoc: null,

  setFirebaseCartFunctions: (db, appId, doc, getDoc, setDoc) => {
    set({ _db: db, _appId: appId, _doc: doc, _getDoc: getDoc, _setDoc: setDoc });
  },

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

  saveCartToFirestore: async (userId, cartItems) => {
    const { _db, _doc, _setDoc, _appId } = get();
    if (!_db || !_appId) return;
    const cartRef = _doc(_db, `artifacts/${_appId}/users/${userId}/cart/data`);
    await _setDoc(cartRef, { items: cartItems });
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
      return { cart: newCart };
    });
    const { cart, saveCartToFirestore, _appId } = get();
    const userId = window.useAuthStore?.getState()?.user?.uid;
    if (userId && _appId) saveCartToFirestore(userId, cart);
  },

  removeFromCart: (id) => {
    set((state) => ({ cart: state.cart.filter((item) => item.id !== id) }));
    const { cart, saveCartToFirestore, _appId } = get();
    const userId = window.useAuthStore?.getState()?.user?.uid;
    if (userId && _appId) saveCartToFirestore(userId, cart);
  },

  increaseQuantity: (id) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
    const { cart, saveCartToFirestore, _appId } = get();
    const userId = window.useAuthStore?.getState()?.user?.uid;
    if (userId && _appId) saveCartToFirestore(userId, cart);
  },

  decreaseQuantity: (id) => {
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0),
    }));
    const { cart, saveCartToFirestore, _appId } = get();
    const userId = window.useAuthStore?.getState()?.user?.uid;
    if (userId && _appId) saveCartToFirestore(userId, cart);
  },

  clearCart: () => set({ cart: [] }),
}));
