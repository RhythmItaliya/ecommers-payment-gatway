import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1">
                        <img
                            src={require('../img/contact.jpg')}
                            alt="About us"
                            className="w-full h-auto rounded-3xl shadow-xl object-cover"
                            style={{ minHeight: '420px' }}
                        />
                    </div>

                    <div className="order-1 lg:order-2">
                        <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">About Us</h1>
                        <p className="text-neutral text-lg leading-8">
                            We are a modern fashion store focused on quality, comfort, and value. Our mission is simple:
                            make great style easy for everyone. From everyday essentials to trend-forward pieces, we
                            curate products you'll love to wear.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
