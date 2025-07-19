import React from "react";

const HeroSection = ({ title, imageSrc = "", heightClass = "h-72" }) => {
  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-b-lg shadow-lg`}>
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent flex items-end justify-center p-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center drop-shadow-lg z-10 animate-fade-in-up">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default HeroSection;