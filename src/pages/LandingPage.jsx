import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [showShopButton, setShowShopButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowShopButton(true);
    }, 1500); // Show button after 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src="https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/darjeeling_qicpwi.avif"
        alt="Darjeeling Landscape"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/70 to-transparent flex flex-col items-center justify-center p-8 text-white text-center">
        <h1 className="text-5xl sm:text-7xl font-extrabold drop-shadow-lg mb-4 animate-fade-in-up">
          Ramro
        </h1>
        <p className="text-xl sm:text-2xl mb-12 max-w-2xl drop-shadow-md animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Bringing the authentic tastes and crafts of the Himalayas to your home.
        </p>
        {showShopButton && (
          <Link
            to="/products"
            className="bg-amber-600 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            Shop Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default LandingPage;