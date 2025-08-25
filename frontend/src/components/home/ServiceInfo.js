import React from 'react';
import { BsTruck, BsArrowReturnLeft, BsShieldCheck, BsHeadset, BsCreditCard } from 'react-icons/bs';

const ServiceInfo = () => {
    const services = [
        {
            icon: <BsTruck className="w-8 h-8" />,
            title: 'Free Shipping',
            description: 'Free shipping on orders over ₹999',
            color: 'text-accent',
            bgColor: 'bg-accent/10',
        },
        {
            icon: <BsArrowReturnLeft className="w-8 h-8" />,
            title: 'Easy Returns',
            description: '30-day return policy, no questions asked',
            color: 'text-success',
            bgColor: 'bg-success/10',
        },
        {
            icon: <BsShieldCheck className="w-8 h-8" />,
            title: 'Secure Payment',
            description: '100% secure payment with Razorpay',
            color: 'text-secondary',
            bgColor: 'bg-secondary/10',
        },
        {
            icon: <BsHeadset className="w-8 h-8" />,
            title: '24/7 Support',
            description: 'Get help anytime via chat or email',
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
        {
            icon: <BsCreditCard className="w-8 h-8" />,
            title: 'Multiple Payment',
            description: 'Credit cards, UPI, net banking & more',
            color: 'text-accent',
            bgColor: 'bg-accent/10',
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8" data-aos="fade-up">
                    <h3 className="text-xl font-medium text-primary">What Makes Us Special</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div
                                className={`inline-flex p-3 rounded-full ${service.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}
                            >
                                <div className={service.color}>{service.icon}</div>
                            </div>

                            <h3 className="text-xl font-semibold text-primary mb-2">{service.title}</h3>
                            <p className="text-neutral leading-relaxed">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceInfo;
