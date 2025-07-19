// src/pages/Home.jsx
import React from 'react';
import ProductCard from "./components/ProductCard";

 // Make sure this path is correct

const products = [
  {
    id: 1,
    name: 'Spicy Chicken Pickle',
    price: 1499,
    image: 'https://via.placeholder.com/300x200/8B0000/FFFFFF?text=Chicken+Pickle',
  },
  {
    id: 2,
    name: 'Nike Red Shoe', // Keeping this for now, you can update with a working shoe image later if needed
    price: 999,
    image: 'https://cdn.pixabay.com/photo/2016/11/19/18/06/shoe-1840902_1280.jpg', // Verified Pixabay shoe image
  },
  {
    id: 3,
    name: 'Sweet Mango Pickle',
    price: 1299,
    image: 'https://cdn.pixabay.com/photo/2017/02/09/16/09/pickles-2053147_1280.jpg',
  },
  {
    id: 4,
    name: 'Assorted Veggie Pickle',
    price: 899,
    image: 'https://cdn.pixabay.com/photo/2017/07/20/09/59/spices-2521197_1280.jpg',
  },
  {
    id: 5,
    name: 'Fresh Mangoes for Pickle', // Example for using the mango image
    price: 50,
    image: 'https://cdn.pixabay.com/photo/2018/06/15/23/06/mango-3478051_1280.jpg',
  },
];

const Home = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;