import React, { useState, useEffect } from "react";
import { allProducts } from "../data/products.js";
import ProductCard from "../components/ProductCard";
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Home = ({ showMessage }) => {
  const categories = ["All", "Pickle", "Cold Cuts", "Tea", "Ready to Eat", "Noodles"];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  useEffect(() => {
    let currentProducts = [...allProducts];
    if (selectedCategory !== "All") {
      currentProducts = currentProducts.filter(p => p.category === selectedCategory);
    }
    if (searchTerm) {
      currentProducts = currentProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (sortOrder === "price-asc") currentProducts.sort((a, b) => a.price - b.price);
    if (sortOrder === "price-desc") currentProducts.sort((a, b) => b.price - a.price);
    if (sortOrder === "name-asc") currentProducts.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredProducts(currentProducts);
  }, [searchTerm, selectedCategory, sortOrder]);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-800">Our Products</h1>
          <p className="text-stone-600 mt-2">Authentic tastes from the heart of the Himalayas.</p>
        </div>
        
        <div className="mb-8 relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search for pickles, tea, snacks..."
            className="w-full p-3 pl-10 rounded-full bg-white text-stone-800 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4 lg:w-1/5">
             <h3 className="text-xl font-bold mb-4 text-stone-800">Categories</h3>
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-2 rounded-md font-semibold transition-colors duration-200 whitespace-nowrap ${selectedCategory === category ? "bg-amber-600 text-white shadow-sm" : "bg-transparent text-stone-700 hover:bg-stone-200"}`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-stone-600">{filteredProducts.length} Products</p>
              <select
                className="p-2 rounded-md bg-white text-stone-800 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="default">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16"><p className="text-xl text-stone-600">No products found.</p></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} showMessage={showMessage} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;