import React from "react";
import { Link } from "react-router-dom";

const FeaturedCollection = () => {
  const collections = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      tag: "NEW ARRIVAL",
      title: "SUMMER COLLECTION",
      subtitle: "LIGHT & BREEZY",
      accentColor: "bg-pink-500",
      link: "/summer-collection"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      tag: "TRENDING NOW",
      title: "WINTER ESSENTIALS",
      subtitle: "WARM & STYLISH",
      accentColor: "bg-blue-600",
      link: "/winter-collection"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      tag: "LIMITED TIME",
      title: "EXCLUSIVE EDITION",
      subtitle: "PREMIUM QUALITY",
      accentColor: "bg-purple-600",
      link: "/exclusive-collection"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Collections
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our latest curated collections designed for every season and occasion
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <div key={collection.id} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              {/* Background Image */}
              <div 
                className="relative h-80 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${collection.image})` }}
              >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center">
                  {/* Top Section - Tag */}
                  <div className="flex items-center mb-4">
                    <div className={`w-8 h-0.5 ${collection.accentColor} mr-3`}></div>
                    <span className="text-white text-xs font-semibold tracking-wider uppercase">
                      {collection.tag}
                    </span>
                  </div>

                  {/* Middle Section - Title & Subtitle */}
                  <div className="mb-4">
                    <h3 className="text-white text-2xl md:text-3xl font-bold uppercase mb-2 leading-tight">
                      {collection.title}
                    </h3>
                    <p className="text-white text-lg md:text-xl font-light uppercase">
                      {collection.subtitle}
                    </p>
                  </div>

                  {/* Bottom Section - CTA Button */}
                  <div>
                    <Link 
                      to={collection.link}
                      className="inline-block text-white font-semibold uppercase text-sm tracking-wider relative group/btn"
                    >
                      Discover More
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover/btn:w-full transition-all duration-300"></span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
