import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Button } from '../ui';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            title: "Men's Collection",
            subtitle: 'Sophisticated Style',
            tag: "Men's Fashion",
            link: '/products?category=men',
        },
        {
            image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            title: "Women's Collection",
            subtitle: 'Elegant & Chic',
            tag: "Women's Fashion",
            link: '/products?category=women',
        },
        {
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
            title: 'New Arrivals',
            subtitle: 'Latest Trends',
            tag: 'Hot & New',
            link: '/products?category=new',
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <section className="relative h-96 md:h-[600px] overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    </div>
                </div>
            ))}

            <div className="relative z-10 container mx-auto px-4 flex items-center justify-center h-full">
                <div className="text-center text-white max-w-2xl mx-auto">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-8 h-1 bg-secondary mr-3"></div>
                        <span className="text-sm uppercase tracking-wide">{slides[currentSlide].tag}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        {slides[currentSlide].title}
                        <br />
                        <span className="font-light">{slides[currentSlide].subtitle}</span>
                    </h1>
                    <Button
                        variant="light"
                        size="lg"
                        as={Link}
                        to={slides[currentSlide].link}
                        className="!bg-white !text-primary hover:!bg-gray-100"
                    >
                        Shop Now
                    </Button>
                </div>
            </div>

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors group"
                title={`Previous slide: ${slides[(currentSlide - 1 + slides.length) % slides.length].title}`}
            >
                <BsChevronLeft size={20} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors group"
                title={`Next slide: ${slides[(currentSlide + 1) % slides.length].title}`}
            >
                <BsChevronRight size={20} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                        title={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;
