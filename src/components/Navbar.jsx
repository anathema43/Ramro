import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { ShoppingCartIcon, Bars3Icon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = ({ onMenuClick }) => {
  const { cart } = useCartStore();
  const { currentUser } = useAuthStore();
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  const logoUrl = "https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752951217/logo_ev3bxa.jpg";

  return (
    <nav className="flex justify-between items-center px-4 sm:px-6 py-4 shadow bg-stone-900 text-white sticky top-0 z-10">
      
      <div className="flex items-center gap-6">
        <button onClick={onMenuClick} className="sm:hidden text-white focus:outline-none" aria-label="Open menu">
          <Bars3Icon className="w-8 h-8" />
        </button>
        <div className="hidden sm:flex items-center space-x-6">
          <Link to="/" className="text-lg hover:text-amber-300 transition-colors">Home</Link>
          <Link to="/products" className="text-lg hover:text-amber-300 transition-colors">Shop</Link>
          <Link to="/about" className="text-lg hover:text-amber-300 transition-colors">About</Link>
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Link to="/products" className="flex items-center">
          <img src={logoUrl} alt="Ramro Logo" className="h-8 w-auto" />
          <span className="text-2xl font-bold text-amber-500 ml-2 hidden md:inline">Ramro</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4 sm:space-x-6">
        {currentUser ? (
          <Link to="/account" className="hover:text-amber-300 transition-colors" aria-label="My Account">
            <UserCircleIcon className="w-7 h-7" />
          </Link>
        ) : (
          <Link to="/login" className="hover:text-amber-300 transition-colors" aria-label="Login">
             <ArrowRightOnRectangleIcon className="w-7 h-7" />
          </Link>
        )}

        <Link to="/cart" className="relative hover:text-amber-300 transition-colors" aria-label="View cart">
          <ShoppingCartIcon className="w-7 h-7" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;