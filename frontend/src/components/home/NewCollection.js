import React, { useContext } from 'react';
import { ProductContext } from '../../contexts/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../product/ProductCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { LoadingSpinner, Button, ErrorState } from '../ui';

const CustomPrevArrow = ({ onClick, className }) => (
    <button
        onClick={onClick}
        className={`${className} absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white p-2 hover:bg-light transition-colors`}
        aria-label="Previous slide"
    >
        <svg className="w-5 h-5 text-neutral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    </button>
);

const CustomNextArrow = ({ onClick, className }) => (
    <button
        onClick={onClick}
        className={`${className} absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white p-2 hover:bg-light transition-colors`}
        aria-label="Next slide"
    >
        <svg className="w-5 h-5 text-neutral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </button>
);

const NewCollection = () => {
    const { products, loading, error } = useContext(ProductContext);

    const getNewProducts = () => {
        return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 12);
    };

    const newProducts = getNewProducts();

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        cssEase: 'ease',
        swipeToSlide: true,
        lazyLoad: false,
        adaptiveHeight: false,
        centerMode: false,
        focusOnSelect: false,
        accessibility: true,
        arrows: true,
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">New Collection</h2>
                    <p className="text-neutral text-lg max-w-2xl mx-auto">
                        Discover our latest arrivals and newest additions to our collection
                    </p>
                </div>

                {loading && (
                    <div className="text-center py-12">
                        <LoadingSpinner size="lg" variant="primary" text="Loading new products..." />
                    </div>
                )}

                {error && <ErrorState error={error} onRetry={() => window.location.reload()} />}

                {!loading && !error && newProducts.length > 0 && (
                    <div className="relative mb-8" data-aos="fade-up" data-aos-delay="200">
                        <Slider {...sliderSettings}>
                            {newProducts.map((product) => (
                                <div key={product.id} className="px-3">
                                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <ProductCard product={product} />
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}

                {!loading && !error && newProducts.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-primary mb-2">No New Products Available</h3>
                        <p className="text-neutral mb-4">
                            {products.length === 0
                                ? "We're currently setting up our product catalog. Check back soon!"
                                : 'No new products found in our collection.'}
                        </p>
                        {products.length === 0 && (
                            <Button variant="accent" size="md" as={Link} to="/products">
                                Browse All Products
                            </Button>
                        )}
                    </div>
                )}

                {!loading && !error && newProducts.length > 0 && (
                    <div className="text-center" data-aos="fade-up" data-aos-delay="400">
                        <Button variant="primary" size="xl" as={Link} to="/products?category=new">
                            View All New Products
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewCollection;
