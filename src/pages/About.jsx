import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-organic-background" data-cy="about-page">
      {/* Hero Section */}
      <section className="py-20 bg-organic-text text-white" data-cy="about-hero">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed">
            Connecting the world with authentic Himalayan craftsmanship and organic goodness
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-display text-3xl font-bold text-organic-text mb-6">
              Born in the Mountains
            </h2>
            <p className="text-organic-text mb-6 leading-relaxed">
              Ramro began as a dream to bridge the gap between the pristine Himalayan highlands and the global community. 
              Founded by mountain enthusiasts who witnessed firsthand the incredible craftsmanship and organic farming 
              practices of local communities, we set out to create a platform that honors tradition while embracing modernity.
            </p>

            <h2 className="font-display text-3xl font-bold text-organic-text mb-6 mt-12">
              Our Mission
            </h2>
            <p className="text-organic-text mb-6 leading-relaxed">
              We believe in the power of authentic, handcrafted products to tell stories, preserve traditions, and 
              support sustainable livelihoods. Every item in our collection is carefully selected for its quality, 
              authenticity, and the positive impact it creates for local artisans and farmers.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-12">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-xl text-organic-text mb-3">🌱 Sustainability First</h3>
                <p className="text-organic-text">
                  We prioritize eco-friendly practices, from sourcing to packaging, ensuring our impact on the 
                  environment is positive and regenerative.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-xl text-organic-text mb-3">🤝 Fair Trade</h3>
                <p className="text-organic-text">
                  Our partnerships with local artisans ensure fair compensation and long-term relationships 
                  that benefit entire communities.
                </p>
              </div>
            </div>

            <h2 className="font-display text-3xl font-bold text-organic-text mb-6 mt-12">
              The Ramro Promise
            </h2>
            <ul className="list-disc list-inside text-organic-text space-y-3 mb-8">
              <li>100% authentic products sourced directly from artisans</li>
              <li>Organic certification for all food products</li>
              <li>Fair trade practices ensuring artisan welfare</li>
              <li>Sustainable packaging and carbon-neutral shipping</li>
              <li>Cultural preservation through traditional crafts</li>
            </ul>

            <div className="text-center mt-12">
              <Link 
                to="/shop" 
                className="inline-block bg-organic-primary text-white font-bold px-8 py-4 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Explore Our Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}