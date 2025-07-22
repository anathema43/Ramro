import { create } from "zustand";
import { saveCartToFirestore } from "../firebase/firestoreService";
import { useAuthStore } from "./authStore";

const debouncedSave = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const saveCart = debouncedSave((cart) => {
  const { currentUser } = useAuthStore.getState();
  if (currentUser) {
    saveCartToFirestore(currentUser.uid, cart);
  }
}, 1000); // Debounce save by 1 second

export const useCartStore = create((set, get) => ({
  cart: [],
  
  loadCart: (cartItems) => set({ cart: cartItems }),

  addToCart: (product) => {
    const { cart } = get();
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
    saveCart(updatedCart);
  },

  increaseQuantity: (id) => {
    const { cart } = get();
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    set({ cart: updatedCart });
    saveCart(updatedCart);
  },

  decreaseQuantity: (id) => {
    const { cart } = get();
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    set({ cart: updatedCart });
    saveCart(updatedCart);
  },

  removeFromCart: (id) => {
    const { cart } = get();
    const updatedCart = cart.filter((item) => item.id !== id);
    set({ cart: updatedCart });
    saveCart(updatedCart);
  },

  clearCart: () => {
    set({ cart: [] });
    saveCart([]);
  },
}));