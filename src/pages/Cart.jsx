import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import HeroSection from "../components/HeroSection";

const Cart = ({ showMessage }) => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCartStore();
  const { isLoggedIn } = useAuthStore();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const navigate = useNavigate();
  const quantityRefs = useRef([]);

  const handleQuantityChange = (action, itemId, index) => {
    if (action === 'increase') {
      increaseQuantity(itemId);
      showMessage(`Quantity updated!`, 'success');
    } else {
      decreaseQuantity(itemId);
      showMessage(`Quantity updated!`, 'success');
    }
    if (quantityRefs.current[index]) {
      quantityRefs.current[index].classList.add('animate-flash-bg');
      setTimeout(() => {
        if (quantityRefs.current[index]) {
          quantityRefs.current[index].classList.remove('animate-flash-bg');
        }
      }, 300);
    }
  };

  const handleRemoveItem = (itemId, itemName) => {
    removeFromCart(itemId);
    showMessage(`'${itemName}' removed from cart.`, 'success');
  };

  const handleClearCart = () => {
    clearCart();
    showMessage('Your cart has been cleared.', 'success');
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      showMessage('Your cart is empty. Please add items before proceeding to checkout.', 'info');
      navigate('/products');
      return;
    }

    if (!isLoggedIn) {
      showMessage('Please log in to proceed to checkout.', 'info');
      navigate('/login');
    } else {
      // In this version, we don't have AccountPage yet.
      // So, for now, we'll keep the alert as a placeholder.
      alert('Proceeding to Checkout! (Account Page/Address Selection next)');
    }
  };

  const HERO_BACKGROUND_IMAGE = "https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/darjeeling_qicpwi.avif";

  return (
    <>
      <HeroSection 
        title="Your Shopping Cart"
        imageSrc={HERO_BACKGROUND_IMAGE}
        heightClass="h-72"
      />
      <div className="max-w-4xl mx-auto p-6 bg-stone-100 rounded-lg shadow-lg my-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-stone-800">🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center text-gray-600 text-xl py-10">
            Your cart is empty. <br/>
            <Link to="/products" className="mt-4 inline-block bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:bg-amber-700 transform hover:scale-105">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {cart.map((item, index) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-md border border-gray-600">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4 border border-gray-500" />
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-stone-800">{item.name}</h3>
                    <p className="text-amber-600 font-bold">Rs. {item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors duration-200"
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span ref={el => quantityRefs.current[index] = el} className="text-lg font-medium text-stone-800 transition-colors duration-200">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-md transition-colors duration-200"
                      disabled={item.quantity >= item.stock}
                    >+</button>
                    <button
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="bg-stone-600 hover:bg-stone-700 text-white px-3 py-1 rounded-md transition-colors duration-200"
                    >Remove</button>
                  </div>
                  <div className="ml-6 text-xl font-bold text-amber-600">Rs. {(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="text-right text-3xl font-bold text-stone-900 mb-8">
              Total: <span className="text-amber-600">Rs. {total.toFixed(2)}</span>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={clearCart}
                className="bg-stone-600 hover:bg-stone-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Clear Cart
              </button>
              <button
                onClick={handleProceedToCheckout}
                className="bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;