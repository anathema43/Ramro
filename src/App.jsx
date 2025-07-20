import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthStore } from './store/authStore'; // Import your auth store

// Import all page components
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/Login"; // Assuming filename is Login.jsx
import SignupPage from "./pages/Signup"; // Assuming filename is Signup.jsx


// Import component parts
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AppMessage from "./components/AppMessage"; // Assuming you moved AppMessage to its own file

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appMessage, setAppMessage] = useState({ message: '', type: '' });
  const { fetchUser } = useAuthStore();

  // This effect runs once when the app starts and sets up the Firebase listener
  useEffect(() => {
    const unsubscribe = fetchUser();
    return () => unsubscribe(); // Cleanup the listener when the app closes
  }, [fetchUser]);

  const showMessage = (message, type) => {
    setAppMessage({ message, type });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <AppMessage message={appMessage.message} type={appMessage.type} onClose={() => setAppMessage({ message: '', type: '' })} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<Home showMessage={showMessage} />} />
        <Route path="/products/:id" element={<ProductDetail showMessage={showMessage} />} />
        <Route path="/cart" element={<Cart showMessage={showMessage} />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<div className="min-h-screen bg-stone-900 text-white p-8 flex items-center justify-center"><h1 className="text-4xl text-center">About Us Page - Coming Soon!</h1></div>} />
        <Route path="/contact" element={<div className="min-h-screen bg-stone-900 text-white p-8 flex items-center justify-center"><h1 className="text-4xl text-center">Contact Us Page - Coming Soon!</h1></div>} />
      </Routes>
    </Router>
  );
};

export default App;