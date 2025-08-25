import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext';
import { Button, LoadingSpinner, ErrorState } from '../ui';

const FeaturedCollection = () => {
    const { products, loading, error } = useContext(ProductContext);

    const getCollections = () => {
        if (!products || products.length === 0) return [];

        const collections = [];

        const bestProducts = products.slice(0, 6);
        if (bestProducts.length > 0) {
            collections.push({
                id: 'best',
                image:
                    bestProducts[0]?.image ||
                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                tag: 'BEST SELLERS',
                title: 'BEST COLLECTION',
                subtitle: 'TOP RATED PRODUCTS',
                accentColor: 'bg-secondary',
                link: `/products`,
                productCount: bestProducts.length,
            });
        }

        const newProducts = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
        if (newProducts.length > 0) {
            collections.push({
                id: 'new',
                image:
                    newProducts[0]?.image ||
                    'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
                tag: 'NEW ARRIVALS',
                title: 'NEW COLLECTION',
                subtitle: 'FRESH & TRENDING',
                accentColor: 'bg-accent',
                link: `/products?category=new`,
                productCount: newProducts.length,
            });
        }

        const latestProducts = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
        if (latestProducts.length > 0) {
            collections.push({
                id: 'latest',
                image:
                    latestProducts[0]?.image ||
                    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                tag: 'LATEST TRENDS',
                title: 'LATEST COLLECTION',
                subtitle: 'HOT & POPULAR',
                accentColor: 'bg-success',
                link: `/products?category=latest`,
                productCount: latestProducts.length,
            });
        }

        return collections;
    };

    const collections = getCollections();

    return (
        <section className="py-16 bg-light">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Featured Collections</h2>
                    <p className="text-neutral text-lg max-w-2xl mx-auto">
                        Discover our latest curated collections designed for every style and occasion
                    </p>
                </div>

                {loading && (
                    <div className="text-center py-12">
                        <LoadingSpinner size="lg" variant="primary" text="Loading collections..." />
                    </div>
                )}

                {error && <ErrorState error={error} onRetry={() => window.location.reload()} />}

                {!loading && !error && collections.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collections.map((collection, index) => (
                            <div
                                key={collection.id}
                                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                                data-aos="fade-up"
                                data-aos-delay={index * 200}
                            >
                                <div
                                    className="relative h-80 bg-cover bg-center bg-no-repeat"
                                    style={{ backgroundImage: `url(${collection.image})` }}
                                >
                                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>

                                    <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center">
                                        <div className="flex items-center mb-4">
                                            <div className={`w-8 h-0.5 ${collection.accentColor} mr-3`}></div>
                                            <span className="text-white text-xs font-semibold tracking-wider uppercase">
                                                {collection.tag}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="text-white text-2xl md:text-3xl font-bold uppercase mb-2 leading-tight">
                                                {collection.title}
                                            </h3>
                                            <p className="text-white text-lg md:text-xl font-light uppercase">
                                                {collection.subtitle}
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <span className="text-white text-sm opacity-80">
                                                {collection.productCount} Products Available
                                            </span>
                                        </div>

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
                )}

                {!loading && !error && collections.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-neutral text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-primary mb-2">No Collections Available</h3>
                        <p className="text-neutral mb-4">
                            {products.length === 0
                                ? "We're currently setting up our collections. Check back soon!"
                                : 'No collections found at the moment.'}
                        </p>
                        {products.length === 0 && (
                            <Button variant="accent" size="md" as={Link} to="/products">
                                Browse All Products
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedCollection;
