import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slider images - you can replace these with your actual images
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Fresh Fashion Finds",
      subtitle: "New Collection",
      tag: "Hot Trend",
      color: "bg-cyan-700"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Summer Collection",
      subtitle: "Light & Breezy",
      tag: "New Arrival",
      color: "bg-pink-600"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      title: "Elegant Style",
      subtitle: "Timeless Fashion",
      tag: "Featured",
      color: "bg-purple-600"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  // Go to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Go to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden">
      {/* Image Slider */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Light overlay for better text readability - reduced opacity */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          </div>
        ))}

        {/* Content */}
        <div className="relative z-0 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center sm:justify-around h-full">
          <div className="flex flex-col justify-center w-full max-w-4xl text-center sm:text-left">
            <div className="font-semibold flex items-center justify-center sm:justify-start uppercase text-white mb-2 sm:mb-3 md:mb-4">
              <div className={`w-6 h-[2px] sm:w-8 md:w-10 mr-2 sm:mr-3 ${slides[currentSlide].color}`}></div>
              <span className="text-xs sm:text-sm md:text-lg tracking-wide">{slides[currentSlide].tag}</span>
            </div>
            <h1 className="uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-[70px] leading-tight sm:leading-[1.1] font-semibold mb-3 sm:mb-4 md:mb-6 text-white px-2 sm:px-0">
              {slides[currentSlide].title}<br />
              <span className="font-light">{slides[currentSlide].subtitle}</span>
            </h1>
            <Link 
              to={'/'} 
              className='self-center sm:self-start uppercase font-semibold text-white transition-colors duration-200 relative group text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-0'
            >
              Discover More
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
            </Link>
          </div>
        </div>

        {/* Navigation Arrows - Hidden on very small screens, smaller on mobile */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 hover:text-primary p-2 sm:p-3 rounded-full transition-all duration-300 z-20"
        >
          <BsChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 hover:text-primary p-2 sm:p-3 rounded-full transition-all duration-300 z-20"
        >
          <BsChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Navigation Dots - Smaller and closer together on mobile */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
