import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { XMarkIcon, UserIcon, ArrowRightOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const { isLoggedIn, user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-64 bg-stone-800 text-white z-50 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out shadow-lg md:hidden`}
    >
      <div className="p-4 flex justify-end">
        <button onClick={onClose} className="text-white hover:text-amber-400 focus:outline-none" aria-label="Close menu">
          <XMarkIcon className="w-7 h-7" />
        </button>
      </div>
      <nav className="flex flex-col p-4 space-y-4 text-lg">
        <Link to="/" className="hover:text-amber-400 transition-colors" onClick={onClose}>Home</Link>
        <Link to="/products" className="hover:text-amber-400 transition-colors" onClick={onClose}>Shop</Link>
        <Link to="/about" className="hover:text-amber-400 transition-colors" onClick={onClose}>About</Link>
        <Link to="/contact" className="hover:text-amber-400 transition-colors" onClick={onClose}>Contact</Link>
        
        {isLoggedIn ? (
          <>
            {/* User Profile Display in Sidebar - Clickable */}
            <button
              onClick={() => {
                alert(`Logged in as:\nName: ${user?.name || 'N/A'}\nEmail: ${user?.email || 'N/A'}`);
                onClose();
              }}
              className="text-stone-300 flex items-center space-x-2 border-t border-stone-700 pt-4 mt-4 w-full justify-center"
              title="View Profile"
            >
              <UserIcon className="w-6 h-6" />
              <span>{user?.name || user?.email}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors w-full justify-center"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="flex items-center space-x-2 hover:text-amber-400 transition-colors border-t border-stone-700 pt-4 mt-4" onClick={onClose}>
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
              <span>Login</span>
            </Link>
            <Link to="/signup" className="flex items-center space-x-2 px-3 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors w-full justify-center" onClick={onClose}>
              <UserPlusIcon className="w-6 h-6" />
              <span>Sign Up</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;