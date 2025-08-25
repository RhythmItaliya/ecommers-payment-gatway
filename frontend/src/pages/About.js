import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="pt-20">
                {/* Hero Section */}
                <section className="bg-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About SnapShop</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Your trusted destination for quality clothing and fashion accessories. We bring you the
                            latest trends with exceptional service.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                                <p className="text-lg text-gray-600">
                                    To provide high-quality, affordable fashion that empowers individuals to express
                                    their unique style with confidence.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg
                                            className="w-8 h-8 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
                                    <p className="text-gray-600">
                                        We source only the finest materials and work with trusted manufacturers.
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg
                                            className="w-8 h-8 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
                                    <p className="text-gray-600">
                                        Constantly evolving with the latest fashion trends and technology.
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg
                                            className="w-8 h-8 text-purple-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h3>
                                    <p className="text-gray-600">
                                        Your satisfaction is our priority with exceptional customer service.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                                <p className="text-lg text-gray-600">
                                    Founded with a passion for fashion and a commitment to quality, SnapShop has grown
                                    from a small local store to a trusted online destination for fashion-conscious
                                    individuals.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">How It All Started</h3>
                                    <p className="text-gray-600 mb-4">
                                        What began as a small boutique has evolved into a comprehensive online fashion
                                        platform, serving customers across the country with the latest trends and
                                        timeless classics.
                                    </p>
                                    <p className="text-gray-600">
                                        Our journey is marked by continuous innovation, customer feedback, and an
                                        unwavering commitment to quality and style.
                                    </p>
                                </div>
                                <div className="bg-gray-100 rounded-lg p-8 text-center">
                                    <div className="text-4xl font-bold text-blue-600 mb-2">2024</div>
                                    <div className="text-gray-600">Years of Excellence</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
                                <p className="text-lg text-gray-600">
                                    The principles that guide everything we do at SnapShop
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainability</h3>
                                    <p className="text-gray-600">
                                        We're committed to eco-friendly practices and sustainable fashion choices that
                                        benefit both our customers and the environment.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Diversity</h3>
                                    <p className="text-gray-600">
                                        Celebrating all styles, sizes, and preferences. Fashion is for everyone, and we
                                        ensure our collection reflects that belief.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
                                    <p className="text-gray-600">
                                        Honest pricing, clear product information, and open communication with our
                                        customers at every step.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
                                    <p className="text-gray-600">
                                        Building lasting relationships with our customers and supporting the communities
                                        we serve.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-blue-600 py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Discover Your Style?</h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Explore our latest collection and find your perfect look
                        </p>
                        <a
                            href="/products"
                            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Shop Now
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
