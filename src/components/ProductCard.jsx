import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { CheckIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ product, showMessage }) => {
  const { id, name, price, image } = product;
  const { addToCart, increaseQuantity, decreaseQuantity, cart } = useCartStore();
  const itemInCart = cart.find(item => item.id === id);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    if (showMessage) {
      showMessage(`'${name}' added to cart!`, 'success');
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white text-stone-800 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      <Link to={`/products/${id}`} className="block">
        <div className="relative h-48 w-full">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${id}`} className="block">
          <h2 className="text-lg font-semibold text-stone-800 mb-1 truncate">{name}</h2>
          <p className="text-amber-600 font-bold mb-3">Rs. {price.toFixed(2)}</p>
        </Link>
        <div className="mt-auto">
          {itemInCart ? (
            <div className="flex items-center justify-center gap-3 w-full">
              <button onClick={() => decreaseQuantity(id)} className="px-3 py-1 border rounded-md hover:bg-stone-100 active:scale-95">-</button>
              <span className="text-lg font-medium w-8 text-center">{itemInCart.quantity}</span>
              <button onClick={() => increaseQuantity(id)} className="px-3 py-1 border rounded-md hover:bg-stone-100 active:scale-95">+</button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full px-4 py-2 rounded-md font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center ${added ? 'bg-green-500 text-white' : 'bg-amber-600 text-white hover:bg-amber-700'}`}
            >
              {added ? <CheckIcon className="w-5 h-5 mr-2"/> : null}
              {added ? 'Added!' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;