import { create } from "zustand";
import { saveCartToFirestore } from "../firebase/firestoreService";
import { useAuthStore } from "./authStore";

const saveCartMiddleware = (config) => (set, get, api) => 
  config(
    (...args) => {
      set(...args);
      const { cart } = get();
      const { currentUser } = useAuthStore.getState();
      
      // --- THIS IS THE FIX ---
      // Only attempt to save the cart if there is a logged-in user.
      // This prevents the error from happening on logout.
      if (currentUser) {
        saveCartToFirestore(currentUser.uid, cart);
      }
    },
    get,
    api
  );

export const useCartStore = create(saveCartMiddleware((set) => ({
  cart: [],
  
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