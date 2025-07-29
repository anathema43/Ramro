// src/store/userStore.js
import { create } from "zustand";

export const useUserStore = create((set, get) => ({
  wishlist: [],
  toggleWishlist: (productId) => {
    const { wishlist } = get();
    if (wishlist && wishlist.includes(productId)) {
      set({ wishlist: wishlist.filter((id) => id !== productId) });
    } else {
      set({ wishlist: [...(wishlist || []), productId] });
    }
  },
  clearWishlist: () => set({ wishlist: [] }),
}));
