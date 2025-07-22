import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';

// Attach Zustand stores to window for safe global access between stores
window.useAuthStore = useAuthStore;
window.useCartStore = useCartStore;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);