import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import HeroSection from "../components/HeroSection";

const Cart = ({ showMessage }) => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCartStore();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

  return (
    <>
      <HeroSection 
        title="Your Shopping Cart"
        imageSrc="https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/darjeeling_qicpwi.avif"
        heightClass="h-72"
      />
      <div className="max-w-4xl mx-auto p-6 bg-stone-100 rounded-lg shadow-lg my-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-stone-800">🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">Your cart is empty. Start shopping!</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-center border-b pb-4 sm:pb-6 last:border-b-0 last:pb-0">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover shadow-sm" />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg font-semibold text-stone-800">{item.name}</h2>
                  <p className="text-amber-600 font-bold">Rs. {item.price.toFixed(2)}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                    <button
                      onClick={() => handleQuantityChange('decrease', item.id, index)}
                      className="px-3 py-1 border border-stone-300 rounded-md text-stone-700 hover:bg-stone-200 transition-colors active:scale-95"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </button>
                    <span ref={el => quantityRefs.current[index] = el} className="text-lg font-medium transition-colors duration-200">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange('increase', item.id, index)}
                      className="px-3 py-1 border border-stone-300 rounded-md text-stone-700 hover:bg-stone-200 transition-colors active:scale-95"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="ml-6 text-amber-600 hover:text-amber-700 hover:underline transition-colors active:scale-95"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t mt-6">
              <button
                onClick={handleClearCart}
                className="bg-stone-200 text-stone-700 px-5 py-2 rounded-md hover:bg-stone-300 transition-colors mb-4 sm:mb-0 active:scale-95"
              >
                Clear Cart
              </button>
              <div className="text-2xl font-bold text-stone-900">Total: Rs. {total.toFixed(2)}</div>
            </div>
          </div>
        )}
        <div className="flex justify-center mt-8">
            <Link to="/products" className="bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500">
                Continue Shopping
            </Link>
        </div>
      </div>
    </>
  );
};

export default Cart;