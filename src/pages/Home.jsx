import React from "react";
import { Link } from "react-router-dom";
import { TruckIcon, BeakerIcon, HandRaisedIcon, StarIcon } from "@heroicons/react/24/outline";
import AddToCartButton from "../components/AddToCartButton";
import products from "../data/products";
import formatCurrency from "../utils/formatCurrency";

export default function Home() {
  // Get featured products (first 4 products)
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Provided Image */}
      <section 
        className="relative h-screen flex items-center justify-center text-organic-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(185, 125, 75, 0.7), rgba(94, 140, 49, 0.7)), url('https://res.cloudinary.com/dj4kdlwzo/image/upload/v1753652937/Gemini_Generated_Image_m5nczum5nczum5nc_c99tl7.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Floating Mountain Pattern Overlay */}
        <div className="absolute inset-0 bg-mountain-pattern opacity-20"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl px-6 animate-fade-in">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-wide leading-tight text-organic-white">
            Experience Pure<br />
            <span className="text-organic-highlight">Local Goodness</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light max-w-3xl mx-auto leading-relaxed text-organic-white">
            Handpicked, Organically Grown in the Himalayas
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/shop" 
              className="btn-primary inline-block px-10 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Shop Now
            </Link>
            <Link 
              to="#why-ramro" 
              className="btn-secondary inline-block px-10 py-4 rounded-full text-lg transition-all duration-300 border-2 border-organic-white text-organic-white hover:bg-organic-white hover:text-organic-text backdrop-blur-sm"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-organic-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-organic-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Himalayan Inspired */}
      <section className="py-20 bg-organic-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="group animate-slide-up">
              <div className="w-20 h-20 bg-organic-primary rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <TruckIcon className="w-10 h-10 text-organic-white" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3 text-organic-text">Free Delivery</h3>
              <p className="text-organic-text opacity-75 text-lg">On all orders across the mountains</p>
            </div>
            
            <div className="group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-organic-highlight rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <BeakerIcon className="w-10 h-10 text-organic-white" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3 text-organic-text">100% Organic</h3>
              <p className="text-organic-text opacity-75 text-lg">Pure & chemical free from nature</p>
            </div>
            
            <div className="group animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 bg-organic-primary rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <HandRaisedIcon className="w-10 h-10 text-organic-white" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3 text-organic-text">Fair Trade</h3>
              <p className="text-organic-text opacity-75 text-lg">Supporting mountain communities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-organic-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-organic-text mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-organic-text opacity-75 max-w-2xl mx-auto">
              Discover our handpicked selection of authentic Himalayan treasures
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="group bg-organic-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Product Badge */}
                  <div className="absolute top-4 left-4">
                    {product.category === 'grains' && (
                      <span className="bg-organic-highlight text-organic-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        🌾 Organic
                      </span>
                    )}
                    {product.category === 'honey' && (
                      <span className="bg-organic-primary text-organic-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        🍯 Pure
                      </span>
                    )}
                    {product.category === 'pickle' && (
                      <span className="bg-organic-primary text-organic-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        🌶️ Traditional
                      </span>
                    )}
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="absolute top-4 right-4 bg-organic-white bg-opacity-90 rounded-full px-2 py-1">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-organic-primary fill-current" />
                      <span className="text-sm font-semibold ml-1">{product.rating || 4.8}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-2 text-organic-text group-hover:text-organic-primary">
                    {product.name}
                  </h3>
                  <p className="text-organic-text opacity-75 mb-4 text-sm leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-2xl text-organic-text">
                      {formatCurrency(product.price)}
                    </span>
                    <Link 
                      to={`/products/${product.id}`}
                      className="text-organic-primary hover:text-organic-text text-sm font-semibold underline"
                    >
                      View Details
                    </Link>
                  </div>
                  <AddToCartButton product={product} className="w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Ramro Section */}
      <section id="why-ramro" className="py-20 bg-organic-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <img 
                src="https://res.cloudinary.com/dj4kdlwzo/image/upload/v1753654806/Gemini_Generated_Image_32y8mu32y8mu32y8_x9aecd.png" 
                alt="Himalayan landscape with traditional architecture" 
                className="w-full rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 text-organic-text">
                Why Choose Ramro - From the Hearts of Himalayas
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-organic-highlight rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-lg text-organic-text mb-1">Locally Sourced & Sustainably Grown</h4>
                    <p className="text-organic-text opacity-75">Direct from mountain communities with traditional farming methods</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-organic-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-lg text-organic-text mb-1">No Chemical Pesticides or Fertilizers</h4>
                    <p className="text-organic-text opacity-75">Pure, natural products as nature intended</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-organic-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-lg text-organic-text mb-1">Promotes Healthy Communities</h4>
                    <p className="text-organic-text opacity-75">Every purchase supports local artisans and their families</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-organic-highlight rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-lg text-organic-text mb-1">Authentic. Sustainable. Pure.</h4>
                    <p className="text-organic-text opacity-75">Connecting you with the timeless traditions of the Himalayas</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  to="/shop"
                  className="btn-primary inline-block px-8 py-4 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Explore Our Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-organic-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-organic-text mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-organic-text opacity-75">Voices from around the world</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-organic-background p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-organic-primary fill-current" />
                ))}
              </div>
              <p className="text-lg italic text-organic-text mb-4 font-display">
                "The organic red rice is absolutely incredible! You can taste the purity of the mountains."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-organic-primary rounded-full flex items-center justify-center text-organic-white font-bold mr-3">
                  S
                </div>
                <div>
                  <p className="font-semibold text-organic-text">Sarah Chen</p>
                  <p className="text-sm text-organic-text opacity-75">California, USA</p>
                </div>
              </div>
            </div>

            <div className="bg-organic-background p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-organic-primary fill-current" />
                ))}
              </div>
              <p className="text-lg italic text-organic-text mb-4 font-display">
                "Supporting local farmers while getting the best quality products. This is the future of shopping!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-organic-highlight rounded-full flex items-center justify-center text-organic-white font-bold mr-3">
                  R
                </div>
                <div>
                  <p className="font-semibold text-organic-text">Raj Patel</p>
                  <p className="text-sm text-organic-text opacity-75">Mumbai, India</p>
                </div>
              </div>
            </div>

            <div className="bg-organic-background p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-organic-primary fill-current" />
                ))}
              </div>
              <p className="text-lg italic text-organic-text mb-4 font-display">
                "The honey is pure magic! My family loves the authentic taste and the story behind each product."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-organic-primary rounded-full flex items-center justify-center text-organic-white font-bold mr-3">
                  M
                </div>
                <div>
                  <p className="font-semibold text-organic-text">Maria Rodriguez</p>
                  <p className="text-sm text-organic-text opacity-75">Barcelona, Spain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-organic-text text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mountain-pattern opacity-10"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience the Himalayan Difference?
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of customers who choose authentic, organic products from the heart of the mountains.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/shop" 
              className="inline-block bg-white text-organic-text font-bold px-10 py-4 rounded-full text-lg hover:bg-organic-background transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Shopping
            </Link>
            <Link 
              to="/signup" 
              className="inline-block border-2 border-white text-white font-bold px-10 py-4 rounded-full text-lg hover:bg-white hover:text-organic-text transition-all duration-300"
            >
              Join Our Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}