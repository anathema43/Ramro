import { create } from "zustand";
import { persist } from "zustand/middleware";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthStore } from "./authStore";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      loading: false,
      error: null,

      loadWishlist: async () => {
        const { currentUser } = useAuthStore.getState();
        if (!currentUser) return;
        
        set({ loading: true });
        try {
          const wishlistDoc = await getDoc(doc(db, "wishlists", currentUser.uid));
          if (wishlistDoc.exists()) {
            set({ wishlist: wishlistDoc.data().productIds || [], loading: false });
          } else {
            set({ loading: false });
          }
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      saveWishlist: async () => {
        const { currentUser } = useAuthStore.getState();
        const { wishlist } = get();
        
        if (!currentUser) return;
        
        try {
          await setDoc(doc(db, "wishlists", currentUser.uid), {
            productIds: wishlist,
            updatedAt: new Date().toISOString()
          });
        } catch (error) {
          console.error("Error saving wishlist:", error);
        }
      },

      addToWishlist: (productId) => {
        set((state) => {
          if (!state.wishlist.includes(productId)) {
            const newWishlist = [...state.wishlist, productId];
            setTimeout(() => get().saveWishlist(), 100);
            return { wishlist: newWishlist };
          }
          return state;
        });
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter(id => id !== productId)
        }));
        setTimeout(() => get().saveWishlist(), 100);
      },

      toggleWishlist: (productId) => {
        const { wishlist } = get();
        if (wishlist.includes(productId)) {
          get().removeFromWishlist(productId);
        } else {
          get().addToWishlist(productId);
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
      },

      clearWishlist: () => {
        set({ wishlist: [] });
        setTimeout(() => get().saveWishlist(), 100);
      },

      getWishlistCount: () => {
        return get().wishlist.length;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "ramro-wishlist-storage",
    }
  )
);