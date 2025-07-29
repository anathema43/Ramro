import React from "react";
import { Link } from "react-router-dom";
import ReviewStars from "./ReviewStars";
import WishlistButton from "./WishlistButton";
import AddToCartButton from "./AddToCartButton";
import formatCurrency from "../utils/formatCurrency";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col transition hover:shadow-xl">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-cover rounded-md mb-2"
        />
        <div className="absolute top-2 right-2">
          <WishlistButton productId={product.id} />
        </div>
        {product.quantityAvailable === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col">
        <h2 className="text-lg font-bold text-organic-text mb-1">{product.name}</h2>
        <ReviewStars rating={product.rating} />
        <p className="text-organic-text opacity-75 mb-2 text-sm flex-1 line-clamp-3">{product.description}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold text-organic-text">{formatCurrency(product.price)}</span>
            <Link 
              to={`/products/${product.id}`} 
              className="text-organic-primary hover:text-organic-text text-sm font-medium underline hover:no-underline transition-all"
            >
              View Details
            </Link>
          </div>
          
          <AddToCartButton product={product} className="w-full" />
          
          {product.quantityAvailable > 0 && product.quantityAvailable <= 5 && (
            <p className="text-orange-600 text-xs mt-1 text-center">
              Only {product.quantityAvailable} left in stock!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}