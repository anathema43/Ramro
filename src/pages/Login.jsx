import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Login = ({ showMessage }) => {
  const navigate = useNavigate();
  const { login, authError, authLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const res = await login(email, password);
    if (res.success) {
      showMessage('Login successful!', 'success');
      navigate('/');
    } else {
      showMessage(res.error, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center">
      <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-center">Login</h2>
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
          className="w-full bg-blue-600 py-3 rounded font-semibold hover:bg-blue-700 transition"
        >
          {authLoading ? 'Logging in...' : 'Login'}
        </button>
        {authError && <p className="text-red-400 text-sm text-center">{authError}</p>}
      </form>
    </div>
  );
};

export default Login;
