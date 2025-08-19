import React from "react";
import Hero from '../components/Hero'
import FeaturedCollection from '../components/FeaturedCollection'
import ProductShowcase from '../components/ProductShowcase'

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedCollection />
      <ProductShowcase />
    </div>
  );
};

export default Home;
