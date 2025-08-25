import React from "react";
import Hero from '../components/home/Hero'
import FeaturedCollection from '../components/home/FeaturedCollection'
import RepasseCollections from '../components/home/RepasseCollections'
import ServiceInfo from '../components/home/ServiceInfo'
import TrendingProducts from '../components/home/TrendingProducts'
import NewCollection from '../components/home/NewCollection'

const Home = () => {
  return (
    <div className="pt-16">
      <Hero />
      <ServiceInfo />
      <FeaturedCollection />
      <TrendingProducts />
      <RepasseCollections />
      <NewCollection />
    </div>
  );
};

export default Home;
