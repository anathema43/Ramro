import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// Firebase Imports
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Import all page components
import LandingPage from "./pages/LandingPage.jsx";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

// Import all component parts
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import AppMessage from "./components/AppMessage.jsx";

// Import Zustand stores
import { useAuthStore } from "./store/authStore.js";


// AuthRedirector component (must be a child of Router)
const AuthRedirector = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    // Redirect if logged in and trying to access auth pages
    if (isLoggedIn && (window.location.hash === '#/login' || window.location.hash === '#/signup')) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  return null;
};


const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appMessage, setAppMessage] = useState({ message: '', type: '' });
  const setFirebaseInstances = useAuthStore((state) => state.setFirebaseInstances);
  const listenToAuthChanges = useAuthStore((state) => state.listenToAuthChanges);
  
  const showMessage = (message, type) => {
    setAppMessage({ message, type });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Firebase Initialization and Auth State Listener
  useEffect(() => {
    let firebaseApp;
    let authInstance;
    let dbInstance;
    let currentAppId;

    try {
      // For local development, use environment variables
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
      };

      currentAppId = firebaseConfig.projectId;

      if (!firebaseConfig.apiKey) {
        console.error("Firebase config not found. Please set VITE_FIREBASE_... environment variables.");
        showMessage("Firebase config missing. Auth will not work.", "error");
        return;
      }

      firebaseApp = initializeApp(firebaseConfig);
      authInstance = getAuth(firebaseApp);
      dbInstance = getFirestore(firebaseApp);

      setFirebaseInstances(
        authInstance, 
        dbInstance, 
        currentAppId, 
        onAuthStateChanged, 
        signInWithEmailAndPassword, 
        createUserWithEmailAndPassword, 
        signOut, 
        doc, 
        setDoc, 
        getDoc
      );

      signInAnonymously(authInstance)
        .then(() => console.log("Signed in anonymously or already authenticated."))
        .catch(error => console.error("Anonymous sign-in failed:", error));
      
      listenToAuthChanges();

    } catch (error) {
      console.error("Firebase initialization error:", error);
      showMessage("Firebase setup failed. Auth will not work.", "error");
    }
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = '#292524';
    document.body.style.fontFamily = 'Inter, sans-serif';
    document.body.style.margin = '0';
    document.body.style.webkitFontSmoothing = 'antialiased';
    document.body.style.mozOsxFontSmoothing = 'grayscale';
    document.body.style.scrollBehavior = 'smooth';
  }, []);


  return (
    <Router>
      <AuthRedirector /> 
      {/* GlobalCssAnimations is not needed in a multi-file setup as it's in index.css */}
      <div className="min-h-screen flex flex-col bg-stone-900">
        <Navbar onMenuClick={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        <AppMessage message={appMessage.message} type={appMessage.type} onClose={() => setAppMessage({ message: '', type: '' })} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<Home showMessage={showMessage} />} />
            <Route path="/products/:id" element={<ProductDetail showMessage={showMessage} />} />
            <Route path="/cart" element={<Cart showMessage={showMessage} />} />
            <Route path="/login" element={<Login showMessage={showMessage} />} />
            <Route path="/signup" element={<Signup showMessage={showMessage} />} />
            <Route path="/about" element={<div className="min-h-screen bg-stone-900 text-white p-8 flex items-center justify-center"><h1 className="text-4xl text-center">About Us Page - Coming Soon!</h1></div>} />
            <Route path="/contact" element={<div className="min-h-screen bg-stone-900 text-white p-8 flex items-center justify-center"><h1 className="text-4xl text-center">Contact Us Page - Coming Soon!</h1></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;