import ProductCard from "../components/ProductCard";

const products = [
  {
    name: "Mix pickle",
    price: 999,
    image: "https://static.vecteezy.com/system/resources/previews/021/560/766/original/pickle-jar-png.png",
  },
  {
    name: "Chicken Pickle",
    price: 1499,
    image: "https://images.unsplash.com/photo-1602524811901-5e19e429b65b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "wai wai",
    price: 799,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
  },
];

const Home = () => {
  return (
    <div className="bg-zinc-900 text-white min-h-screen p-4">
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
