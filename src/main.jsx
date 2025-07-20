import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// FIX: Attach Zustand stores to the window object for cross-store access
import { useCartStore } from './store/cartStore';
import { useAuthStore } from './store/authStore';

window.useCartStore = useCartStore;
window.useAuthStore = useAuthStore;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);