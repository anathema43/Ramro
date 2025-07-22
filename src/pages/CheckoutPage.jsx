import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const CheckoutPage = () => {
  const { cart, clearCart } = useCartStore();
  const { currentUser, loading } = useAuthStore();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    // In a real application, this is where you would process payment and save the order.
    console.log("Order placed successfully!");
    clearCart();
    navigate('/products'); 
  };

  // This hook correctly handles redirection.
  useEffect(() => {
    // Once loading is false, if there's still no user, redirect to login.
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [loading, currentUser, navigate]); // This effect runs whenever these values change.

  // 1. Show a loading screen while we check for a user.
  if (loading) {
    return <div className="min-h-screen bg-stone-100 flex items-center justify-center">Verifying account...</div>;
  }
  
  // 2. If loading is done and there's no user, render nothing while the redirect happens.
  if (!currentUser) {
    return null; 
  }

  // 3. If the user is logged in but the cart is empty, send them to the products page.
  if (cart.length === 0) {
    // Use a timeout to allow the user to see the message before redirecting.
    setTimeout(() => navigate('/products'), 1500);
    return <div className="min-h-screen bg-stone-100 flex items-center justify-center">Your cart is empty. Redirecting...</div>;
  }

  // 4. If all checks pass, show the checkout page.
  return (
    <div className="min-h-screen bg-stone-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-8 text-center">Checkout</h1>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-stone-800 border-b pb-4 mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-stone-800">{item.name}</p>
                  <p className="text-sm text-stone-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-stone-900">Rs. {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-lg">
              <p className="text-stone-600">Subtotal</p>
              <p className="font-semibold text-stone-900">Rs. {total.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-lg">
              <p className="text-stone-600">Shipping</p>
              <p className="font-semibold text-stone-900">FREE</p>
            </div>
            <div className="flex justify-between text-2xl font-bold border-t pt-4 mt-4">
              <p className="text-stone-800">Total</p>
              <p className="text-amber-600">Rs. {total.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full mt-8 bg-amber-600 text-white text-lg font-semibold px-6 py-3 rounded-md hover:bg-amber-700 transition-colors duration-200 active:scale-95"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;