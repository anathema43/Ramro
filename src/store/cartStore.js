import { create } from "zustand";
import { persist } from "zustand/middleware";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthStore } from "./authStore";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      loading: false,
      error: null,

      loadCart: async () => {
        const { currentUser } = useAuthStore.getState();
        if (!currentUser) return;
        
        set({ loading: true });
        try {
          const cartDoc = await getDoc(doc(db, "carts", currentUser.uid));
          if (cartDoc.exists()) {
            set({ cart: cartDoc.data().items || [], loading: false });
          } else {
            set({ loading: false });
          }
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      saveCart: async () => {
        const { currentUser } = useAuthStore.getState();
        const { cart } = get();
        
        if (!currentUser) return;
        
        try {
          await setDoc(doc(db, "carts", currentUser.uid), {
            items: cart,
            updatedAt: new Date().toISOString()
          });
        } catch (error) {
          console.error("Error saving cart:", error);
        }
      },
      addToCart: (product, qty = 1) => {
        set((state) => {
          const exists = state.cart.find((item) => item.id === product.id);
          let newCart;
          if (exists) {
            newCart = {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + qty }
                  : item
              ),
            };
          } else {
            newCart = { cart: [...state.cart, { ...product, quantity: qty }] };
          }
          
          // Save to Firestore
          setTimeout(() => get().saveCart(), 100);
          return newCart;
        });
      },

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeFromCart(id);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: qty } : item
          ),
        }));
        setTimeout(() => get().saveCart(), 100);
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
        setTimeout(() => get().saveCart(), 100);
      },

      clearCart: () => {
        set({ cart: [] });
        setTimeout(() => get().saveCart(), 100);
      },

      getItemQuantity: (id) => {
        const item = get().cart.find((item) => item.id === id);
        return item ? item.quantity : 0;
      },

      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getSubtotal: () => {
        return get().getTotalPrice();
      },

      getTax: () => {
        return get().getTotalPrice() * 0.08; // 8% tax
      },

      getShipping: () => {
        const total = get().getTotalPrice();
        return total > 500 ? 0 : 50; // Free shipping over $500
      },

      getGrandTotal: () => {
        return get().getSubtotal() + get().getTax() + get().getShipping();
      },
    }),
    {
      name: "ramro-cart-storage",
    }
  )
);