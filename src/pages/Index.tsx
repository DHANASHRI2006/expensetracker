
import React, { useRef } from 'react';
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { Button } from "@/components/ui/button";

const Index: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={false} 
        onFeatureClick={scrollToFeatures}
        onContactClick={scrollToContact}
      />
      <main className="flex-grow">
        <Hero />
        <div ref={featuresRef}>
          <Features />
        </div>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of users who are improving their finances with SpendSmart.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-1 mb-3 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "SpendSmart helped me pay off my credit card debt in just 8 months! The budget suggestions and spending insights were game-changers for me."
                </p>
                <p className="font-medium">Sarah Johnson</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-1 mb-3 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As a family of four, managing our finances was challenging. The family sharing feature allows us to coordinate our spending and save for our goals together."
                </p>
                <p className="font-medium">Michael & Rebecca Torres</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-1 mb-3 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The Piggy Bank feature makes saving fun! I've saved for my dream vacation and earned badges along the way. Highly recommend!"
                </p>
                <p className="font-medium">Alex Rodriguez</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-purple-light/20 to-soft-green/40">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Join SpendSmart today and start your journey toward financial wellness.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button className="bg-purple hover:bg-purple-dark text-white px-8 py-2 rounded-lg text-lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-purple text-purple hover:bg-purple hover:text-white px-8 py-2 rounded-lg text-lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <div ref={contactRef}>
        <Footer />
      </div>
      <Chatbot />
    </div>
  );
};

export default Index;
