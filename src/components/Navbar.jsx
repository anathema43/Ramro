import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { Bars3Icon, ShoppingCartIcon, UserIcon, ArrowRightOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const Navbar = ({ onMenuClick }) => {
  const { cart } = useCartStore();
  const { isLoggedIn, user, logout } = useAuthStore();
  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-stone-800 text-white p-4 shadow-lg sticky top-0 z-40 animate-fade-in-down">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="text-2xl font-bold text-amber-500 hover:text-amber-400 transition-colors">
          Ramro
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <Link to="/products" className="hover:text-amber-400 transition-colors">Shop</Link>
          <Link to="/about" className="hover:text-amber-400 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link>
          
          {/* Cart Icon */}
          <Link to="/cart" className="relative hover:text-amber-400 transition-colors">
            <ShoppingCartIcon className="w-6 h-6" />
            {totalItemsInCart > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItemsInCart}
              </span>
            )}
          </Link>

          {/* Auth Links */}
          {isLoggedIn ? (
            <>
              {/* User Profile Display in Navbar - Clickable */}
              <button
                onClick={() => alert(`Logged in as:\nName: ${user?.name || 'N/A'}\nEmail: ${user?.email || 'N/A'}`)}
                className="text-stone-300 flex items-center space-x-1 hover:text-amber-400 transition-colors cursor-pointer"
                title="View Profile"
              >
                <UserIcon className="w-5 h-5" />
                <span>{user?.name || user?.email}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center space-x-1 hover:text-amber-400 transition-colors">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="flex items-center space-x-1 px-3 py-1 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors">
                <UserPlusIcon className="w-5 h-5" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button and Cart Icon */}
        <div className="md:hidden flex items-center space-x-4">
          <Link to="/cart" className="relative text-white hover:text-amber-400 transition-colors">
            <ShoppingCartIcon className="w-6 h-6" />
            {totalItemsInCart > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItemsInCart}
              </span>
            )}
          </Link>
          <button onClick={onMenuClick} className="text-white hover:text-amber-400 focus:outline-none" aria-label="Open menu">
            <Bars3Icon className="w-7 h-7" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;