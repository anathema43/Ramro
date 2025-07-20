import React from "react";
import { Link } from "react-router-dom";
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore'; // Import the auth store

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser } = useAuthStore(); // Get the current user

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-stone-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:hidden`}
      >
        <div className="p-6">
          <button onClick={onClose} className="text-white text-3xl absolute top-4 right-4" aria-label="Close menu">
            <XMarkIcon className="w-8 h-8" />
          </button>
          <h2 className="text-2xl font-bold mb-8 text-amber-500">Menu</h2>
          <nav className="flex flex-col space-y-4">
            <Link to="/" onClick={onClose} className="text-lg hover:text-amber-300 transition-colors">Home</Link>
            <Link to="/products" onClick={onClose} className="text-lg hover:text-amber-300 transition-colors">Shop</Link>
            
            {/* DYNAMIC LINK FOR ACCOUNT/LOGIN */}
            {currentUser ? (
              <Link to="/account" onClick={onClose} className="text-lg hover:text-amber-300 transition-colors">My Account</Link>
            ) : (
              <Link to="/login" onClick={onClose} className="text-lg hover:text-amber-300 transition-colors">Login</Link>
            )}

            <Link to="/about" onClick={onClose} className="text-lg hover:text-amber-300 transition-colors">About Us</Link>
            <Link to="/contact" onClick={onClose} className="text-lg hover:text-amber-300 transition-colors">Contact</Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;