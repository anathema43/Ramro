import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import HeroSection from '../components/HeroSection';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/products');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error("Login Error:", err);
    }
  };

  return (
    <>
      <HeroSection
        title="Login to Your Account"
        imageSrc="https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/darjeeling_qicpwi.avif"
        heightClass="h-72"
      />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl my-8 -mt-20 relative">
        <h2 className="text-2xl font-bold mb-6 text-center text-stone-800">Welcome Back!</h2>
        {error && <p className="bg-red-200 text-red-800 p-3 rounded-md text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-stone-700 font-semibold mb-1" htmlFor="email">Email Address</label>
            <input
              type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-stone-100 text-stone-800 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="you@example.com" required
            />
          </div>
          <div>
            <label className="block text-stone-700 font-semibold mb-1" htmlFor="password">Password</label>
            <input
              type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-stone-100 text-stone-800 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="••••••••" required
            />
          </div>
          <button type="submit" className="w-full bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors duration-200 active:scale-95">
            Login
          </button>
        </form>
        <p className="text-center text-stone-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-amber-600 hover:underline font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;