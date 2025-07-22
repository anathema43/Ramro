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
    // ... filtering logic ...
  }, [searchTerm, selectedCategory, sortOrder]);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* ... search and filter UI ... */}
        <main className="flex-1">
            {/* ... other UI ... */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                    // CORRECTLY PASSING PROPS HERE
                    <ProductCard key={p.id} product={p} showMessage={showMessage} />
                ))}
            </div>
        </main>
      </div>
    </div>
  );
};

export default Home;