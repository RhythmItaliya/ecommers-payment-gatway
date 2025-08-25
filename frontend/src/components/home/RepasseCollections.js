import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';

const RepasseCollections = () => {
    const collections = [
        {
            id: 1,
            type: 'men',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            title: 'REPASSE MEN',
            subtitle: 'Sophisticated Collection',
            link: '/products?category=men&brand=repasse',
        },
        {
            id: 2,
            type: 'women',
            image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            title: 'REPASSE WOMEN',
            subtitle: 'Elegant Collection',
            link: '/products?category=women&brand=repasse',
        },
    ];

    return (
        <section className="py-16 bg-light">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="text-4xl font-bold text-primary mb-4">Repasse Collections</h2>
                    <p className="text-neutral text-lg max-w-2xl mx-auto">
                        Discover our exclusive men's and women's collections
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {collections.map((collection, index) => (
                        <div key={collection.id} className="group" data-aos="fade-up" data-aos-delay={index * 200}>
                            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={collection.image}
                                        alt={collection.title}
                                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                                </div>

                                <div className="p-8 text-center">
                                    <h3 className="text-2xl font-bold text-primary mb-2">{collection.title}</h3>
                                    <p className="text-neutral mb-6">{collection.subtitle}</p>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        as={Link}
                                        to={collection.link}
                                        className="border-primary text-primary hover:bg-primary hover:text-white"
                                    >
                                        View Collection
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RepasseCollections;
