import { create } from "zustand";
import { saveCartToFirestore } from "../firebase/firestoreService";
import { useAuthStore } from "./authStore";

// This is a helper to prevent saving to the database on every single click.
// It waits for 1 second of inactivity before saving.
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
}, 1000);

export const useCartStore = create((set, get) => ({
  cart: [],
  
  // This is used to load the cart from the database on login.
  loadCart: (cartItems) => set({ cart: cartItems }),

  // This clears the cart from memory ONLY. It's used on logout.
  clearLocalCart: () => set({ cart: [] }),

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

  // This function is for the user to click. It clears the cart AND saves the empty cart to the DB.
  clearCart: () => {
    set({ cart: [] });
    saveCart([]); // Save the empty cart to the database
  },
}));