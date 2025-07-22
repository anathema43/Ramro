import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { CheckIcon } from '@heroicons/react/24/outline';

// CORRECTLY RECEIVING PROPS HERE
const ProductCard = ({ product, showMessage }) => {
  const { id, name, price, image } = product;
  const { addToCart, increaseQuantity, decreaseQuantity, cart } = useCartStore();
  const itemInCart = cart.find(item => item.id === id);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    showMessage(`'${name}' added to cart!`, 'success');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white text-stone-800 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
       {/* ... rest of your ProductCard JSX ... */}
    </div>
  );
};

export default ProductCard;