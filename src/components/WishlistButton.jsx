import React from "react";
import { useWishlistStore } from "../store/wishlistStore";
import { useAuthStore } from "../store/authStore";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

const WishlistButton = ({ productId, product, className = "" }) => {
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { currentUser } = useAuthStore();
  
  // Use productId if provided, otherwise fall back to product.id
  const id = productId || (product && product.id);
  if (!id) return null;

  const isWishlisted = isInWishlist(id);

  const handleToggle = () => {
    if (!currentUser) {
      // Redirect to login or show login prompt
      window.location.hash = '#/login';
      return;
    }
    
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
        isWishlisted 
          ? "text-red-500 hover:text-red-600" 
          : "text-gray-400 hover:text-red-500"
      } ${className}`}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      data-cy="wishlist-button"
    >
      {isWishlisted ? (
        <HeartSolidIcon className="w-5 h-5" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default WishlistButton;