import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { allProducts } from "../data/products.js"; // Import all products

const ProductDetail = ({ showMessage }) => {
  const { id } = useParams();
  const product = allProducts.find(p => p.id === parseInt(id));

  const { addToCart, increaseQuantity, decreaseQuantity, cart } = useCartStore();
  const itemInCart = cart.find(item => item.id === product?.id);

  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Link to="/products" className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700">
          &larr; Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    showMessage(`'${product.name}' added to cart!`, 'success');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 my-8">
        <Link to="/products" className="text-amber-600 hover:underline mb-6 inline-block">
          &larr; Back to All Products
        </Link>
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            <div className="md:w-1/2">
              <div className="relative aspect-square bg-stone-100 rounded-lg">
                {!imageLoaded && <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-lg"></div>}
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover rounded-lg shadow-md transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <span className="text-sm font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">{product.category}</span>
              <h1 className="text-4xl font-bold my-3 text-stone-900">{product.name}</h1>
              <p className="text-amber-600 font-extrabold text-3xl mb-4">Rs. {product.price.toFixed(2)}</p>
              
              <p className="text-stone-700 mb-6 leading-relaxed">
                Experience the authentic taste of the Himalayas with our {product.name}. Handcrafted using traditional methods and the finest local ingredients. Each bite brings a piece of home, a memory of the misty mountains and vibrant cultures.
              </p>
              
              <div className="flex flex-col gap-4">
                {itemInCart ? (
                  <div className="flex items-center gap-4">
                    <button onClick={() => decreaseQuantity(product.id)} className="px-4 py-2 border rounded-md hover:bg-stone-100 active:scale-95 text-xl font-bold">-</button>
                    <span className="text-2xl font-bold w-12 text-center">{itemInCart.quantity}</span>
                    <button onClick={() => increaseQuantity(product.id)} className="px-4 py-2 border rounded-md hover:bg-stone-100 active:scale-95 text-xl font-bold">+</button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors duration-200 text-lg font-semibold active:scale-95"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;