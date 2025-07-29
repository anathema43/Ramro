// src/config/razorpay.js
const razorpayConfig = {
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
  keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET,
  currency: 'INR',
  name: 'Ramro - Himalayan Products',
  description: 'Authentic products from the Himalayas',
  image: '/logo.png', // Your logo URL
  theme: {
    color: '#B97D4B' // Your brand color
  }
};

// Check if Razorpay keys are configured
const isRazorpayConfigured = razorpayConfig.keyId && 
  !razorpayConfig.keyId.includes('placeholder') && 
  !razorpayConfig.keyId.includes('your_') && 
  razorpayConfig.keyId !== '';

if (!isRazorpayConfigured) {
  console.warn('⚠️ Razorpay key is not configured. Please check your .env file and set VITE_RAZORPAY_KEY_ID.');
}

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export { razorpayConfig, loadRazorpayScript, isRazorpayConfigured };
export default razorpayConfig;