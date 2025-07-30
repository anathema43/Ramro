// src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/account");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-himalaya-light">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-himalaya-dark text-center">Login to Ramro</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-himalaya-dark font-medium mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-himalaya"
              data-cy="login-email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-himalaya-dark font-medium mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-himalaya"
              data-cy="login-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-organic-primary hover:opacity-90 text-white font-semibold rounded py-2 transition"
            data-cy="login-submit"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-himalaya-dark">
          New here?{" "}
          <Link to="/signup" className="underline hover:text-himalaya-dark">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
