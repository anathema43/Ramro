import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setErr("");
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    try {
      await signup(email, password, name);
      navigate("/");
    } catch (error) {
      setErr("Signup failed. Try a different email.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-himalaya-light to-blue-200">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        {err && <p className="text-red-600 mb-2">{err}</p>}
        <input className="w-full border rounded p-2 mb-3" value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Full Name" required />
        <input className="w-full border rounded p-2 mb-3" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
        <input className="w-full border rounded p-2 mb-4" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password (min 6 chars)" required />
        <button className="w-full bg-organic-primary text-white py-2 rounded hover:opacity-90 transition-all" type="submit">Sign Up</button>
        <div className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-himalaya underline">Login</Link>
        </div>
      </form>
    </div>
  );
}