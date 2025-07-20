import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import HeroSection from "../components/HeroSection";
import { allProducts } from "../data/products";

const ImageSkeleton = () => (
  <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
);

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
      <div className="min-h-screen bg-stone-100 text-stone-900 flex items-center justify-center p-8">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    showMessage(`'${product.name}' added to cart!`, 'success');
  };

  const handleQuantityChange = (action, itemId) => {
    if (action === 'increase') {
      increaseQuantity(itemId);
    } else {
      decreaseQuantity(itemId);
    }
    showMessage(`Quantity of '${product.name}' updated!`, 'success');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <HeroSection 
        title={product.name} 
        imageSrc={product.image}
        heightClass="h-72"
      />
      <div className="container mx-auto p-6 sm:p-8 lg:p-10 bg-white rounded-lg shadow-lg my-8">
        <Link to="/products" className="text-amber-600 hover:underline mb-4 inline-block active:scale-95">
          &larr; Back to Shop
        </Link>
        <div className="flex flex-col md:flex-row gap-8 mt-4">
          <div className="md:w-1/2 relative">
            {!imageLoaded && <ImageSkeleton />}
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-auto object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x450/334155/f8fafc?text=Image+Error`; }}
            />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold mb-2 text-stone-900">{product.name}</h1>
            <p className="text-amber-600 font-extrabold text-3xl mb-4">Rs. {product.price.toFixed(2)}</p>
            
            <p className="text-stone-700 mb-4 leading-relaxed">
              Experience the authentic taste of the Himalayas with our {product.name}. Handcrafted using traditional methods and the finest local ingredients from the pristine regions of Darjeeling, Nepal, and Kalimpong. Each bite brings a piece of home, a memory of the misty mountains and vibrant cultures. Perfect for pairing with your meals or as a delightful snack.
            </p>
            
            <p className="text-sm text-stone-600 mb-6">
              <span className="font-semibold text-amber-700">Only {Math.floor(Math.random() * 10) + 1} left!</span> | Over {Math.floor(Math.random() * 500) + 100} people bought this in the last month.
            </p>

            <div className="flex flex-col gap-4">
              {itemInCart ? (
                <div className="flex items-center gap-3 w-full justify-center sm:justify-start">
                  <button
                    onClick={() => handleQuantityChange('decrease', product.id)}
                    className="px-4 py-2 border border-amber-600 text-amber-600 rounded-md hover:bg-amber-600 hover:text-white transition-colors active:scale-95"
                    aria-label={`Decrease quantity of ${product.name}`}
                  >
                    -
                  </button>
                  <span className="text-xl font-medium">{itemInCart.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('increase', product.id)}
                    className="px-4 py-2 border border-amber-600 text-amber-600 rounded-md hover:bg-amber-600 hover:text-white transition-colors active:scale-95"
                    aria-label={`Increase quantity of ${product.name}`}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors duration-200 w-full active:scale-95
                               focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;