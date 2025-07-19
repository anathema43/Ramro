import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: [],
  addToCart: (product) => {
    const existing = get().cart.find((item) => item.id === product.id);
    if (existing) {
      const updated = get().cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      set({ cart: updated });
    } else {
      set((state) => ({ cart: [...state.cart, { ...product, quantity: 1 }] }));
    }
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
}));