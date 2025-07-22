import { create } from "zustand";
import { saveCartToFirestore } from "../firebase/firestoreService";
import { useAuthStore } from "./authStore"; // Import authStore to get the user ID

// This function will automatically save the cart to Firestore after any change
const saveCartMiddleware = (config) => (set, get, api) => 
  config(
    (...args) => {
      set(...args);
      const { cart } = get();
      const { currentUser } = useAuthStore.getState();
      if (currentUser) {
        saveCartToFirestore(currentUser.uid, cart);
      }
    },
    get,
    api
  );

export const useCartStore = create(saveCartMiddleware((set) => ({
  cart: [],
  
  // New action to load the cart from Firestore
  loadCart: (cartItems) => set({ cart: cartItems }),

  addToCart: (product) => {
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    });
  },

  increaseQuantity: (id) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  },

  decreaseQuantity: (id) => {
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0),
    }));
  },

  removeFromCart: (id) => {
    set((state) => ({ cart: state.cart.filter((item) => item.id !== id) }));
  },

  clearCart: () => set({ cart: [] }),
})));