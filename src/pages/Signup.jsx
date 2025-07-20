import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { useAuthStore } from "../store/authStore";

const Signup = ({ showMessage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const signup = useAuthStore((state) => state.signup);
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

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setFormError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    const result = await signup(name, email, password);
    if (result.success) {
      showMessage('Account created successfully! Welcome to Ramro!', 'success');
      navigate('/');
    } else {
      showMessage(`Signup failed: ${result.error}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <HeroSection
        title="Join Ramro"
        imageSrc="https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/tea_field_bg_v49v3u.avif"
        heightClass="h-72"
      />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg my-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-stone-800">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Your Name</label>
            <input
              type="text"
              id="name"
              className="w-full p-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 text-stone-800"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={authLoading}
              required
            />
          </div>
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
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 text-stone-800"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              'Sign Up'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-stone-600">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;