import React from "react";
import { Link } from "react-router-dom";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-organic-background">
      {/* Hero Section */}
      <section className="py-20 bg-organic-text text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Shipping Policy
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed">
            Fast, reliable delivery from the Himalayas to your doorstep
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="font-display text-3xl font-bold text-organic-text mb-6">
              Delivery Information
            </h2>
            
            <div className="space-y-6 text-organic-text">
              <div>
                <h3 className="text-xl font-semibold mb-3">📦 Processing Time</h3>
                <p className="leading-relaxed">
                  Orders are usually dispatched within 2 business days. During peak seasons 
                  (festivals and holidays), processing may take up to 3-4 business days.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">🚚 Delivery Areas</h3>
                <p className="leading-relaxed mb-3">
                  We deliver across India and internationally to selected countries:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>India: All states and union territories</li>
                  <li>International: USA, Canada, UK, Australia, Germany, France</li>
                  <li>Express delivery available in major cities</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">⏰ Delivery Times</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-organic-background p-4 rounded-lg">
                    <h4 className="font-semibold">Domestic (India)</h4>
                    <p>3-7 business days</p>
                  </div>
                  <div className="bg-organic-background p-4 rounded-lg">
                    <h4 className="font-semibold">International</h4>
                    <p>7-14 business days</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">💰 Shipping Costs</h3>
                <p className="leading-relaxed mb-3">
                  <strong>Free shipping on orders over ₹500 within India!</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Orders under ₹500: ₹50 shipping fee</li>
                  <li>Express delivery: Additional ₹100</li>
                  <li>International shipping: Calculated at checkout</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">📍 Order Tracking</h3>
                <p className="leading-relaxed">
                  Once your order is shipped, you'll receive a tracking number via email. 
                  You can track your package status in your account dashboard or contact 
                  our support team for assistance.
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                to="/contact" 
                className="inline-block bg-organic-primary text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-all"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
