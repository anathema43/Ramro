import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Import all page components (using default imports)
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home"; // This is your Products page
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail"; // New Product Detail page

// Import all component parts (using default imports)
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// AppMessage component (defined here for simplicity as it's a global utility)
const AppMessage = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 3000); // Message disappears after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible || !message) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 p-3 rounded-lg shadow-lg text-white z-50 ${bgColor} animate-fade-in-down`}>
      {message}
    </div>
  );
};


// Define allProducts here so it's accessible to all components that need it
// In a real app, this would come from a backend API.
const allProducts = [
  { id: 1, name: "Darjeeling Pickle 1", price: 249, image: "https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/pickle_3_co88iu.jpg", category: "Pickle" },
  { id: 2, name: "Spicy Pickle 2", price: 349, image: "https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/pickle_1_aiw5nw.jpg", category: "Pickle" },
  { id: 3, name: "Sweet Mango Pickle", price: 299, image: "https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/pickle_1_aiw5nw.jpg", category: "Pickle" },
  { id: 4, name: "Himalayan Herbs Pickle", price: 499, image: "https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/pickle_3_co88iu.jpg", category: "Pickle" },
  { id: 5, name: "Mixed Vegetable Pickle", price: 279, image: "https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/pickle_1_aiw5nw.jpg", category: "Pickle" },
  { id: 6, name: "Smoked Chicken Sausage", price: 650, image: "https://placehold.co/300x200/FF5733/FFFFFF?text=Cold+Cuts", category: "Cold Cuts" },
  { id: 7, name: "Pork Salami", price: 720, image: "https://placehold.co/300x200/C70039/FFFFFF?text=Cold+Cuts", category: "Cold Cuts" },
  { id: 8, name: "Beef Jerky", price: 580, image: "https://placehold.co/300x200/900C3F/FFFFFF?text=Cold+Cuts", category: "Cold Cuts" },
  { id: 9, name: "Lamb Pepperoni", price: 690, image: "https://placehold.co/300x200/581845/FFFFFF?text=Cold+Cuts", category: "Cold Cuts" },
  { id: 10, name: "Chicken Ham Slices", price: 480, image: "https://placehold.co/300x200/2A0A5E/FFFFFF?text=Cold+Cuts", category: "Cold Cuts" },
  { id: 11, name: "First Flush Darjeeling Tea", price: 850, image: "https://placehold.co/300x200/007BFF/FFFFFF?text=Tea", category: "Tea" },
  { id: 12, name: "Nepali Green Tea", price: 550, image: "https://placehold.co/300x200/00BFFF/FFFFFF?text=Tea", category: "Tea" },
  { id: 13, name: "Kalimpong Black Tea", price: 620, image: "https://placehold.co/300x200/00CED1/FFFFFF?text=Tea", category: "Tea" },
  { id: 14, name: "Assam CTC Blend", price: 380, image: "https://placehold.co/300x200/40E0D0/FFFFFF?text=Tea", category: "Tea" },
  { id: 15, name: "Herbal Infusion Pack", price: 450, image: "https://placehold.co/300x200/48D1CC/FFFFFF?text=Tea", category: "Tea" },
  { id: 16, name: "Instant Momos (Chicken)", price: 220, image: "https://placehold.co/300x200/50C878/FFFFFF?text=Ready+To+Eat", category: "Ready to Eat" },
  { id: 17, name: "Thukpa Bowl (Veg)", price: 180, image: "https://placehold.co/300x200/228B22/FFFFFF?text=Ready+To+Eat", category: "Ready to Eat" },
  { id: 18, name: "Sel Roti Pack", price: 150, image: "https://placehold.co/300x200/3CB371/FFFFFF?text=Ready+To+Eat", category: "Ready to Eat" },
  { id: 19, name: "Gundruk Soup Mix", price: 190, image: "https://placehold.co/300x200/6B8E23/FFFFFF?text=Ready+To+Eat", category: "Ready to Eat" },
  { id: 20, name: "Aloo Dum (Spiced Potato)", price: 160, image: "https://placehold.co/300x200/8FBC8F/FFFFFF?text=Ready+To+Eat", category: "Ready to Eat" },
  { id: 21, name: "Nepali Wai Wai Noodles", price: 50, image: "https://placehold.co/300x200/FFD700/000000?text=Noodles", category: "Noodles" },
  { id: 22, name: "Instant Ramen (Spicy)", price: 70, image: "https://placehold.co/300x200/FFC107/000000?text=Noodles", category: "Noodles" },
  { id: 23, name: "Chicken Flavored Noodles", price: 60, image: "https://placehold.co/300x200/FFA000/000000?text=Noodles", category: "Noodles" },
  { id: 24, name: "Vegetable Noodles Pack", price: 65, image: "https://placehold.co/300x200/FF8F00/000000?text=Noodles", category: "Noodles" },
  { id: 25, name: "Soupy Noodles", price: 75, image: "https://placehold.co/300x200/FF6F00/FFFFFF?text=Noodles", category: "Noodles" },
];

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appMessage, setAppMessage] = useState({ message: '', type: '' });

  const showMessage = (message, type) => {
    setAppMessage({ message, type });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar onMenuClick={toggleSidebar} />
      {/* Sidebar for mobile navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      {/* Global message/toast component */}
      <AppMessage message={appMessage.message} type={appMessage.type} onClose={() => setAppMessage({ message: '', type: '' })} />
      
      {/* Define routes for different pages */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<Home allProducts={allProducts} showMessage={showMessage} />} />
        <Route path="/products/:id" element={<ProductDetail allProducts={allProducts} showMessage={showMessage} />} />
        <Route path="/cart" element={<Cart showMessage={showMessage} />} />
        {/* Placeholder pages for About and Contact */}
        <Route path="/about" element={<div className="min-h-screen bg-stone-900 text-white p-8 flex items-center justify-center"><h1 className="text-4xl text-center">About Us Page - Coming Soon!</h1></div>} />
        <Route path="/contact" element={<div className="min-h-screen bg-stone-900 text-white p-8 flex items-center justify-center"><h1 className="text-4xl text-center">Contact Us Page - Coming Soon!</h1></div>} />
      </Routes>
    </Router>
  );
};

export default App;