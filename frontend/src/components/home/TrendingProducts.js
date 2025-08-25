import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext';
import ProductCard from '../product/ProductCard';
import { Button, LoadingSpinner, ErrorState } from '../ui';

const TrendingProducts = () => {
    const { products, loading, error } = useContext(ProductContext);

    const getTrendingProducts = () => {
        return products.slice(0, 18);
    };

    const trendingProducts = getTrendingProducts();

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold text-primary mb-3 hover:text-accent transition-colors duration-300 cursor-default">
                        Trending Products
                    </h2>
                    <p className="text-neutral max-w-lg mx-auto hover:text-primary transition-colors duration-300">
                        Discover what's popular and trending right now
                    </p>
                </div>

                {loading && (
                    <div className="text-center py-12">
                        <LoadingSpinner size="md" variant="primary" text="Loading..." />
                    </div>
                )}

                {error && <ErrorState error={error} onRetry={() => window.location.reload()} />}

                {!loading && !error && trendingProducts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                        {trendingProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className="group transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && trendingProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral mb-4">
                            {products.length === 0
                                ? 'No products available at the moment.'
                                : 'No trending products found.'}
                        </p>
                        {products.length === 0 && (
                            <Link to="/products" className="text-accent hover:text-accent/80 font-medium">
                                Browse All Products
                            </Link>
                        )}
                    </div>
                )}

                {!loading && !error && trendingProducts.length > 0 && (
                    <div className="text-center" data-aos="fade-up" data-aos-delay="400">
                        <Button variant="primary" size="lg" as={Link} to="/products">
                            View All Products
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default TrendingProducts;
