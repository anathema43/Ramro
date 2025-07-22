import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuthStore(); // Get the signup action from the hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    try {
      await signup(email, password, name);
      navigate('/products');
    } catch (err) {
      setError('Failed to create an account. The email may already be in use.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 space-y-6">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-stone-800">Create Your Account</h2>
            <p className="text-stone-600 mt-2">Join Ramro to get started.</p>
        </div>
        {error && <p className="bg-red-200 text-red-800 p-3 rounded-md text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-stone-700 font-semibold mb-1" htmlFor="name">Full Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-md bg-stone-100 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
          </div>
          <div>
            <label className="block text-stone-700 font-semibold mb-1" htmlFor="email">Email Address</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-md bg-stone-100 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
          </div>
          <div>
            <label className="block text-stone-700 font-semibold mb-1" htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-md bg-stone-100 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="At least 6 characters" required />
          </div>
          <button type="submit" className="w-full bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors duration-200 active:scale-95">
            Create Account
          </button>
        </form>
        <p className="text-center text-stone-600">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-600 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;