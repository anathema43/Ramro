import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthStore } from './store/authStore';

// Page and Component imports
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import CheckoutPage from "./pages/CheckoutPage";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AppMessage from "./components/AppMessage";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appMessage, setAppMessage] = useState({ message: '', type: '' });
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = fetchUser();
    return () => {
      unsubscribe();
    };
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
      <AppMessage
        message={appMessage.message}
        type={appMessage.type}
        onClose={() => setAppMessage({ message: '', type: '' })}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<Home showMessage={showMessage} />} />
        <Route path="/products/:id" element={<ProductDetail showMessage={showMessage} />} />
        <Route path="/cart" element={<Cart showMessage={showMessage} />} />
        <Route path="/account" element={<AccountPage showMessage={showMessage} />} />
        <Route path="/login" element={<LoginPage showMessage={showMessage} />} />
        <Route path="/signup" element={<SignupPage showMessage={showMessage} />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={
          <div className="min-h-screen bg-stone-100 p-8">
            <h1 className="text-4xl text-center">About Us</h1>
          </div>
        } />
        <Route path="/contact" element={
          <div className="min-h-screen bg-stone-100 p-8">
            <h1 className="text-4xl text-center">Contact Us</h1>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;
