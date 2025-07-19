import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { ShoppingCartIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Navbar = ({ onMenuClick }) => {
  const { cart } = useCartStore();
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  const logoUrl = "https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752951217/logo_ev3bxa.jpg"; // Your uploaded logo URL

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow bg-stone-900 text-white sticky top-0 z-10">
      {/* Hamburger icon for small screens */}
      <button onClick={onMenuClick} className="sm:hidden text-white text-3xl focus:outline-none" aria-label="Open menu">
        <Bars3Icon className="w-8 h-8" />
      </button>
      {/* Site title/logo */}
      <Link to="/products" className="flex items-center">
        <img src={logoUrl} alt="Ramro Logo" className="h-8 w-auto mr-2" />
        <span className="text-2xl font-bold text-amber-500 hidden sm:inline">Ramro</span>
      </Link>
      
      {/* Group for Navigation Links and Cart Icon (aligned to the right) */}
      <div className="flex items-center space-x-6">
        {/* Primary Navigation Links for larger screens (hidden on small) */}
        <div className="hidden sm:flex space-x-6">
          <Link to="/" className="text-lg hover:text-amber-300 transition-colors">Home</Link>
          <Link to="/products" className="text-lg hover:text-amber-300 transition-colors">Shop</Link>
          <Link to="/about" className="text-lg hover:text-amber-300 transition-colors">About Us</Link>
          <Link to="/contact" className="text-lg hover:text-amber-300 transition-colors">Contact</Link>
        </div>
        {/* Cart link with badge */}
        <Link to="/cart" className="relative flex items-center text-lg hover:text-amber-300 transition-colors" aria-label="View cart">
          <ShoppingCartIcon className="w-6 h-6" />
          <span className="ml-2">Cart</span>
          {count > 0 && (
            <span className="absolute -top-3 -right-3 bg-amber-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce-once">
              {count}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;