import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import HeroSection from "../components/HeroSection";
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { allProducts } from "../data/products";

const Home = ({ showMessage }) => {
  const categories = ["All", "Pickle", "Cold Cuts", "Tea", "Ready to Eat", "Noodles"];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  useEffect(() => {
    let currentProducts = [...allProducts];

    if (selectedCategory !== "All") {
      currentProducts = currentProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      currentProducts = currentProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === "price-asc") {
      currentProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      currentProducts.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "name-asc") {
      currentProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(currentProducts);
  }, [searchTerm, selectedCategory, sortOrder]);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <HeroSection 
        title="Our Shop" 
        imageSrc="https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/darjeeling_qicpwi.avif"
        heightClass="h-72"
      />

      <div className="container mx-auto p-6 sm:p-8 lg:p-10">
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-3 pl-10 rounded-md bg-stone-200 text-stone-800 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search products"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 focus:outline-none"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4 lg:w-1/5 flex-shrink-0">
            <h3 className="text-xl font-bold mb-4 hidden md:block">Categories</h3>
            <div className="flex md:flex-col gap-3 md:space-y-2 md:space-x-0 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full font-semibold transition-colors duration-200 whitespace-nowrap active:scale-95
                    ${selectedCategory === category
                      ? "bg-amber-600 text-white shadow-md"
                      : "bg-stone-200 text-stone-700 hover:bg-stone-300 hover:text-stone-900"
                    }`}
                >
                  {category} ({allProducts.filter(p => category === "All" || p.category === category).length})
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-6 flex justify-end">
              <select
                className="p-2 rounded-md bg-stone-200 text-stone-800 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                aria-label="Sort products by"
              >
                <option value="default">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <p className="text-center text-xl text-stone-600 mt-10">No products found for your selection.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} {...p} showMessage={showMessage} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;