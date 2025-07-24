import { create } from "zustand";

// This helper function prevents saving to the database on every single click.
// It waits for 1 second of inactivity before saving.
const debouncedSave = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const useCartStore = create((set, get) => ({
  cart: [],
  
  // Firebase instances - will be set by App.jsx
  _db: null,
  _doc: null,
  _getDoc: null,
  _setDoc: null,

  // This function is called once by App.jsx to give the store access to Firebase
  setFirebaseCartFunctions: (db, doc, getDoc, setDoc) => {
    set({
      _db: db,
      _doc: doc,
      _getDoc: getDoc,
      _setDoc: setDoc,
    });
  },

  // Save cart to Firestore (debounced)
  saveCartToFirestore: debouncedSave(async (userId, cartItems) => {
    const { _db, _doc, _setDoc } = get();
    if (_db && _doc && _setDoc && userId) {
      try {
        const cartRef = _doc(_db, 'users', userId, 'cart', 'items');
        await _setDoc(cartRef, { items: cartItems });
      } catch (error) {
        console.error('Error saving cart to Firestore:', error);
      }
    }
  }, 1000),

  // Load cart from Firestore
  loadCartFromFirestore: async (userId) => {
    const { _db, _doc, _getDoc } = get();
    if (_db && _doc && _getDoc && userId) {
      try {
        const cartRef = _doc(_db, 'users', userId, 'cart', 'items');
        const docSnap = await _getDoc(cartRef);
        const cartItems = docSnap.exists() ? docSnap.data().items : [];
        set({ cart: cartItems });
      } catch (error) {
        console.error('Error loading cart from Firestore:', error);
      }
    }
  },
  
  loadCart: (cartItems) => set({ cart: cartItems }),
  
  // This clears the cart from local memory ONLY. It's used on logout.
  clearLocalCart: () => set({ cart: [] }),

  addToCart: (product) => {
    const { cart, saveCartToFirestore } = get();
    const existing = cart.find((item) => item.id === product.id);
    let updatedCart;
    if (existing) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    set({ cart: updatedCart });
    
    // Save to Firestore if user is logged in
    if (window.useAuthStore) {
      const { currentUser } = window.useAuthStore.getState();
      if (currentUser) {
        saveCartToFirestore(currentUser.uid, updatedCart);
      }
    }
  },

  increaseQuantity: (id) => {
    const { cart, saveCartToFirestore } = get();
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    set({ cart: updatedCart });
    
    // Save to Firestore if user is logged in
    if (window.useAuthStore) {
      const { currentUser } = window.useAuthStore.getState();
      if (currentUser) {
        saveCartToFirestore(currentUser.uid, updatedCart);
      }
    }
  },

  decreaseQuantity: (id) => {
    const { cart, saveCartToFirestore } = get();
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    set({ cart: updatedCart });
    
    // Save to Firestore if user is logged in
    if (window.useAuthStore) {
      const { currentUser } = window.useAuthStore.getState();
      if (currentUser) {
        saveCartToFirestore(currentUser.uid, updatedCart);
      }
    }
  },

  removeFromCart: (id) => {
    const { cart, saveCartToFirestore } = get();
    const updatedCart = cart.filter((item) => item.id !== id);
    set({ cart: updatedCart });
    
    // Save to Firestore if user is logged in
    if (window.useAuthStore) {
      const { currentUser } = window.useAuthStore.getState();
      if (currentUser) {
        saveCartToFirestore(currentUser.uid, updatedCart);
      }
    }
  },

  // This function is for the user to click. It clears the cart and saves the empty cart to the database.
  clearCart: () => {
    const { saveCartToFirestore } = get();
    set({ cart: [] });
    
    // Save to Firestore if user is logged in
    if (window.useAuthStore) {
      const { currentUser } = window.useAuthStore.getState();
      if (currentUser) {
        saveCartToFirestore(currentUser.uid, []);
      }
    }
  },
}));