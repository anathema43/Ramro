import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore'; // Import the cart store

// --- Firebase Imports ---
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// --- Page Imports ---
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import CheckoutPage from "./pages/CheckoutPage";

// --- Component Imports ---
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AppMessage from "./components/AppMessage";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appMessage, setAppMessage] = useState({ message: '', type: '' });
  
  // This useEffect handles all Firebase initialization and store setup once.
  useEffect(() => {
    try {
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      };

      if (!firebaseConfig.apiKey) {
        throw new Error("Firebase configuration is missing. Check your .env.local file.");
      }

      const firebaseApp = initializeApp(firebaseConfig);
      const auth = getAuth(firebaseApp);
      const db = getFirestore(firebaseApp);
      const appId = firebaseConfig.projectId;

      // Set up the auth store with all necessary Firebase instances and functions
      useAuthStore.getState().setFirebaseInstances(
          auth, db, appId,
          onAuthStateChanged,
          signInWithEmailAndPassword,
          createUserWithEmailAndPassword,
          signOut,
          doc, setDoc, getDoc
      );

      // --- THIS IS THE CRITICAL FIX FOR YOUR CART ---
      // Set up the cart store with the necessary Firebase functions
      useCartStore.getState().setFirebaseCartFunctions(db, appId, doc, getDoc, setDoc);

      // Start listening for authentication changes
      useAuthStore.getState().listenToAuthChanges();

    } catch (error) {
      console.error("Firebase Initialization Error:", error);
      showMessage("Application failed to start: " + error.message, "error");
    }
  }, []);

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
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={<div className="min-h-screen bg-stone-100 p-8"><h1 className="text-4xl text-center">About Us</h1></div>} />
        <Route path="/contact" element={<div className="min-h-screen bg-stone-100 p-8"><h1 className="text-4xl text-center">Contact Us</h1></div>} />
      </Routes>
    </Router>
  );
};

export default App;