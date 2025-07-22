import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

const Navbar = ({ onMenuClick }) => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setDropdownOpen(false);
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <nav className="bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-50">
      <button onClick={onMenuClick} className="md:hidden text-xl" aria-label="Open menu">
        ☰
      </button>

      <Link to="/" className="text-2xl font-bold text-stone-900">
        Ramro
      </Link>

      <div className="flex items-center gap-4 relative">
        <Link to="/cart" aria-label="View cart" className="relative">
          🛒
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>

        {isLoggedIn ? (
          <div className="relative">
            <button aria-label="My Account" onClick={toggleDropdown} className="text-sm text-stone-700 hover:text-stone-900">
              {user?.displayName || "My Account"}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded z-50">
                <Link to="/account" className="block px-4 py-2 hover:bg-stone-100" onClick={() => setDropdownOpen(false)}>
                  Profile
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-stone-100">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="text-sm text-stone-700 hover:text-stone-900">Login</Link>
            <Link to="/signup" className="text-sm text-stone-700 hover:text-stone-900">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
