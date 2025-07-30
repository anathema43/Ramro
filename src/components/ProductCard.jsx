import React from "react";
import { Link } from "react-router-dom";
import ResponsiveImage from "./ResponsiveImage";
import ReviewStars from "./ReviewStars";
import WishlistButton from "./WishlistButton";
import AddToCartButton from "./AddToCartButton";
import formatCurrency from "../utils/formatCurrency";
import ArtisanCard from "./ArtisanCard";

export default function ProductCard({ product }) {
  return (
    <article className="bg-white rounded-lg shadow-lg p-4 flex flex-col transition hover:shadow-xl" data-cy="product-card">
      <div className="relative">
        <ResponsiveImage
          src={product.image}
          alt={`${product.name} - ${product.description}`}
          className="w-full h-44 rounded-md mb-2"
          sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
          data-cy="product-image"
        />
        <ResponsiveImage
          src={product.image}
          alt={`${product.name} - ${product.description}`}
          className="w-full h-44 rounded-md mb-2"
          sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
          data-cy="product-image"
        />
        <div className="absolute top-2 right-2">
          <WishlistButton productId={product.id} />
        </div>
        {product.quantityAvailable === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md" data-cy="out-of-stock-badge">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col">
        <h2 className="text-lg font-bold text-organic-text mb-1" data-cy="product-name">{product.name}</h2>
        <div data-cy="product-rating">
          <ReviewStars rating={product.rating} />
        </div>
        <p className="text-organic-text opacity-75 mb-2 text-sm flex-1 line-clamp-3">{product.description}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold text-organic-text" data-cy="product-price">{formatCurrency(product.price)}</span>
            <Link 
              to={`/products/${product.id}`} 
              className="text-organic-primary hover:text-organic-text text-sm font-medium underline hover:no-underline transition-all"
              data-cy="view-details-link"
            >
              View Details
            </Link>
          </div>
          
          <AddToCartButton product={product} className="w-full" />
          
          {/* Artisan Link */}
          {product.artisanId && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-organic-text opacity-75 mb-2">Crafted by:</p>
              <Link 
                to={`/artisans/${product.artisanId}`}
                className="text-organic-primary hover:text-organic-text text-sm font-medium underline hover:no-underline transition-all"
              >
                {product.artisan || 'View Artisan Profile'} →
              </Link>
            </div>
          )}
          
          {product.quantityAvailable > 0 && product.quantityAvailable <= 5 && (
            <p className="text-orange-600 text-xs mt-1 text-center" data-cy="stock-warning">
              Only {product.quantityAvailable} left in stock!
            </p>
          )}
        </div>
      </div>
    </article>
  );
}