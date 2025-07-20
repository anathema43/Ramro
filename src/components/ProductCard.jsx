import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

const ImageSkeleton = () => (
  <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
);

const ProductCard = ({ id, name, price, image, showMessage }) => {
  const { addToCart, increaseQuantity, decreaseQuantity, cart } = useCartStore();
  const itemInCart = cart.find(item => item.id === id);

  const [addedToCartFeedback, setAddedToCartFeedback] = useState(false);
  const quantityRef = useRef(null);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCartFeedback(true);
    showMessage(`'${product.name}' added to cart!`, 'success');
    setTimeout(() => setAddedToCartFeedback(false), 1000);
  };

  const handleQuantityChange = (action, itemId) => {
    if (action === 'increase') {
      increaseQuantity(itemId);
    } else {
      decreaseQuantity(itemId);
    }
    showMessage(`Quantity of '${name}' updated!`, 'success');
    if (quantityRef.current) {
      quantityRef.current.classList.add('animate-flash-bg');
      setTimeout(() => {
        if (quantityRef.current) {
          quantityRef.current.classList.remove('animate-flash-bg');
        }
      }, 300);
    }
  };

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-stone-100 text-stone-800 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden">
      <Link to={`/products/${id}`} className="block">
        <div className="relative h-48 w-full">
          {!imageLoaded && <ImageSkeleton />}
          <img
            src={image}
            alt={name}
            className={`h-48 w-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/334155/f8fafc?text=Image+Error`; }}
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-stone-800 mb-1 truncate">{name}</h2>
          <p className="text-amber-600 font-bold mb-3">Rs. {price.toFixed(2)}</p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <div className="flex flex-col gap-2">
          {itemInCart ? (
            <div className="flex items-center justify-center gap-3 w-full">
              <button
                onClick={() => decreaseQuantity(id)}
                className="px-3 py-1 border border-amber-600 text-amber-600 rounded-md hover:bg-amber-600 hover:text-white transition-colors active:scale-95"
                aria-label={`Decrease quantity of ${name}`}
              >
                -
              </button>
              <span ref={quantityRef} className="text-lg font-medium transition-colors duration-200">{itemInCart.quantity}</span>
              <button
                onClick={() => increaseQuantity(id)}
                className="px-3 py-1 border border-amber-600 text-amber-600 rounded-md hover:bg-amber-600 hover:text-white transition-colors active:scale-95"
                aria-label={`Increase quantity of ${name}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleAddToCart({ id, name, price, image })}
              className={`bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors duration-200 w-full active:scale-95
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50
                           ${addedToCartFeedback ? 'bg-green-600' : ''}`}
              disabled={addedToCartFeedback}
              aria-label={`Add ${name} to cart`}
            >
              {addedToCartFeedback ? 'Added!' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;