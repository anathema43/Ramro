import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { UserCircleIcon, Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { currentUser, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = getTotalItems();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    closeMobileMenu();
  };

  return (
    <>
      <nav className="flex items-center justify-between bg-organic-text p-4 text-organic-white shadow-md relative">
        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-md hover:bg-organic-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6 text-organic-white" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-organic-white" />
          )}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-wide hover:text-organic-primary transition-colors">
          <span role="img" aria-label="mountain">🏔️</span> Ramro
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-organic-white hover:text-organic-primary transition-colors duration-200 font-medium">Home</Link>
          <Link to="/shop" className="text-organic-white hover:text-organic-primary transition-colors duration-200 font-medium">Shop</Link>
          <Link to="/cart" className="relative text-organic-white hover:text-organic-primary transition-colors duration-200">
            <div className="flex items-center gap-1">
              <ShoppingCartIcon className="w-6 h-6 text-organic-white" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs font-bold min-w-[1.25rem] h-5 flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </div>
          </Link>
          {currentUser ? (
            <>
              <Link to="/account" className="text-organic-white hover:text-organic-primary transition-colors duration-200">
                <UserCircleIcon className="w-7 h-7 text-organic-white" />
              </Link>
              <button
                className="px-4 py-2 bg-organic-white text-organic-text rounded-md hover:bg-organic-primary hover:text-organic-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-organic-white hover:text-organic-primary transition-colors duration-200 font-medium">Login</Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 bg-organic-white text-organic-text rounded-md hover:bg-organic-primary hover:text-organic-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Cart Icon */}
        <div className="md:hidden">
          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="w-6 h-6 text-organic-white" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs font-bold min-w-[1.25rem] h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden" onClick={closeMobileMenu}>
          <div className="fixed left-0 top-0 h-full w-64 bg-organic-text shadow-2xl z-50 transform transition-transform duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-organic-white">Menu</span>
                <button 
                  onClick={closeMobileMenu} 
                  className="p-2 rounded-md hover:bg-organic-primary transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  <XMarkIcon className="w-6 h-6 text-organic-white" />
                </button>
              </div>
              
              <div className="space-y-4">
                <Link 
                  to="/" 
                  className="block py-3 px-4 text-organic-white hover:bg-organic-primary hover:text-organic-white rounded-md transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
                <Link 
                  to="/shop" 
                  className="block py-3 px-4 text-organic-white hover:bg-organic-primary hover:text-organic-white rounded-md transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  Shop
                </Link>
                <Link 
                  to="/cart" 
                  className="block py-3 px-4 text-organic-white hover:bg-organic-primary hover:text-organic-white rounded-md transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-organic-white">Cart</span>
                    {totalItems > 0 && (
                      <span className="bg-red-600 text-white rounded-full px-2 py-1 text-xs font-bold">
                        {totalItems}
                      </span>
                    )}
                  </div>
                </Link>
                
                <hr className="border-organic-primary border-opacity-30 my-4" />
                
                {currentUser ? (
                  <>
                    <Link 
                      to="/account" 
                      className="block py-3 px-4 text-organic-white hover:bg-organic-primary hover:text-organic-white rounded-md transition-colors duration-200"
                      onClick={closeMobileMenu}
                    >
                      <div className="flex items-center gap-2">
                        <UserCircleIcon className="w-5 h-5 text-organic-white" />
                        <span className="text-organic-white">Account</span>
                      </div>
                    </Link>
                    <button
                      className="w-full text-left py-3 px-4 text-organic-white hover:bg-organic-primary hover:text-organic-white rounded-md transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block py-3 px-4 text-organic-white hover:bg-organic-primary hover:text-organic-white rounded-md transition-colors duration-200"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      className="block py-3 px-4 text-organic-white hover:bg-organic-primary hover:text-organic-white rounded-md transition-colors duration-200"
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}