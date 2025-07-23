import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Signup = ({ showMessage }) => {
  const navigate = useNavigate();
  const { signup, authError, authLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    const res = await signup(name, email, password);
    if (res.success) {
      showMessage('Signup successful!', 'success');
      navigate('/');
    } else {
      showMessage(res.error, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center">
      <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 bg-stone-800 border border-stone-700 rounded"
        />
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 bg-stone-800 border border-stone-700 rounded"
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 bg-stone-800 border border-stone-700 rounded"
        />
        <button
          type="submit"
          disabled={authLoading}
          className="w-full bg-green-600 py-3 rounded font-semibold hover:bg-green-700 transition"
        >
          {authLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        {authError && <p className="text-red-400 text-sm text-center">{authError}</p>}
      </form>
    </div>
  );
};

export default Signup;
