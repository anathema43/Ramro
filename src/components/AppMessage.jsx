import React, { useState, useEffect } from "react";

const AppMessage = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible || !message) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 p-3 rounded-lg shadow-lg text-white z-50 animate-fade-in-down`}>
      {message}
    </div>
  );
};

export default AppMessage;