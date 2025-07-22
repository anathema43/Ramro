import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

const Cart = ({ showMessage }) => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemoveItem = (itemId, itemName) => {
    removeFromCart(itemId);
    showMessage(`'${itemName}' removed from cart.`, 'success');
  };

  const handleClearCart = () => {
    clearCart();
    showMessage('Your cart has been cleared.', 'success');
  };

  const handleCheckout = () => {
    // We will navigate to our new checkout page
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-8 text-center">Your Cart</h1>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
          {cart.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">Your cart is empty.</p>
              <Link to="/products" className="mt-4 inline-block bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors">
                  Start Shopping
              </Link>
            </div>
          ) : (
            <div>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-center border-b pb-4 last:border-b-0">
                    <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover shadow-sm" />
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-lg font-semibold text-stone-800">{item.name}</h2>
                      <p className="text-amber-600 font-bold">Rs. {item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <button onClick={() => decreaseQuantity(item.id)} className="px-3 py-1 border rounded-md hover:bg-stone-100 active:scale-95">-</button>
                      <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)} className="px-3 py-1 border rounded-md hover:bg-stone-100 active:scale-95">+</button>
                    </div>
                     <div className="text-lg font-semibold text-stone-800 w-24 text-center">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                     </div>
                    <button onClick={() => handleRemoveItem(item.id, item.name)} className="text-red-500 hover:text-red-700 text-sm hover:underline">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t mt-6">
                <button
                  onClick={handleClearCart}
                  className="bg-stone-200 text-stone-700 px-5 py-2 rounded-md hover:bg-stone-300 transition-colors mb-4 sm:mb-0 active:scale-95"
                >
                  Clear Cart
                </button>
                <div className="text-2xl font-bold text-stone-900">Total: Rs. {total.toFixed(2)}</div>
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={handleCheckout} className="bg-amber-600 text-white text-lg font-semibold px-8 py-3 rounded-md hover:bg-amber-700 transition-colors duration-200 active:scale-95">
                    Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;