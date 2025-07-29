import React from "react";
import { useUserStore } from "../store/userStore";

const WishlistButton = ({ productId, product }) => {
  const wishlist = useUserStore((state) => state.wishlist) || [];
  const toggleWishlist = useUserStore((state) => state.toggleWishlist);

  // Use productId if provided, otherwise fall back to product.id
  const id = productId || (product && product.id);
  if (!id) return null;

  const isWishlisted = wishlist.includes(id);

  return (
    <button
      className={`px-2 py-1 rounded ${
        isWishlisted ? "bg-red-500 text-white" : "bg-gray-200"
      }`}
      onClick={() => toggleWishlist(id)}
    >
      {isWishlisted ? "♥" : "♡"}
    </button>
  );
};

export default WishlistButton;
