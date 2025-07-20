import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Removed Router import
import HeroSection from "../components/HeroSection";
import { useAuthStore } from "../store/authStore";

const Login = ({ showMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const login = useAuthStore((state) => state.login);
  const authLoading = useAuthStore((state) => state.authLoading);
  const authStoreError = useAuthStore((state) => state.authError);
  const navigate = useNavigate();

  useEffect(() => {
    if (authStoreError) {
      setFormError(authStoreError);
    }
  }, [authStoreError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const result = await login(email, password);
    if (result.success) {
      showMessage('Login successful!', 'success');
      // After successful login, check if there's a cart to redirect back to
      const currentHash = window.location.hash;
      const redirectPath = currentHash.includes('/cart') ? '/cart' : '/'; // Redirect to cart if came from there, else home
      navigate(redirectPath);
    } else {
      showMessage(`Login failed: ${result.error}`, 'error');
    }
  };

  const HERO_BACKGROUND_IMAGE = "https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/darjeeling_qicpwi.avif";

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <HeroSection
        title="Login to Ramro"
        imageSrc={HERO_BACKGROUND_IMAGE}
        heightClass="h-72"
      />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg my-8 text-stone-900">
        <h1 className="text-3xl font-bold mb-6 text-center text-stone-800">Welcome Back!</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 text-stone-800"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={authLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 text-stone-800"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={authLoading}
              required
            />
          </div>
          {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
          <button
            type="submit"
            className="w-full bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors duration-200 active:scale-95 flex items-center justify-center font-semibold"
            disabled={authLoading}
          >
            {authLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-stone-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-amber-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;