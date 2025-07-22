import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth';
import { useAuthStore } from '../store/authStore';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const auth = getAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update user display name
      await updateProfile(userCredential.user, { displayName: name });

      // Zustand store will sync user via listener in App.jsx
      navigate('/products');
    } catch (err) {
      console.error("Signup error:", err.code);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Try logging in.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white p-6 rounded shadow space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Sign Up</h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 chars)"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-stone-800"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-500 mt-2">
          Already have an account?{' '}
          <a href="#/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
