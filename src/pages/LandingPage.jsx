import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [showShopButton, setShowShopButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowShopButton(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-stone-900 text-white overflow-hidden">
      <img
        src="https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/darjeeling_qicpwi.avif"
        alt="Himalayan landscape"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 animate-fade-in-up">
          Ramro
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-light mb-8 animate-fade-in-up delay-200">
          Authentic Tastes from the Himalayas
        </p>
        {showShopButton && (
          <Link
            to="/products"
            className="bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-bounce-once"
          >
            Shop Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default LandingPage;