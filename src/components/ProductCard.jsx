// src/components/ProductCard.jsx
import React from 'react';

const ProductCard = ({ name, price, image }) => {
  return (
    // Added hover:scale-105 and transition-all duration-300 for a lift effect
    <div className="bg-zinc-900 text-white rounded-xl shadow hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-4 w-full max-w-xs mx-auto flex flex-col justify-between">
      <img
        src={image}
        alt={name}
        className="rounded-lg object-cover w-full h-48 mb-4"
      />
      <div> {/* Group text content for better spacing */}
        <h2 className="text-lg font-semibold mb-1 truncate">{name}</h2> {/* Added truncate */}
        <p className="text-xl font-bold text-green-400 mb-4">₹{price.toFixed(2)}</p> {/* Price formatting and more prominent styling */}
      </div>
      <button
        className="bg-white text-black font-semibold px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" // Added focus state
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;