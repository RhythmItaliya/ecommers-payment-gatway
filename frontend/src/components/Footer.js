import React from 'react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsTwitter, BsInstagram, BsLinkedin, BsEnvelope, BsTelephone, BsGeoAlt } from 'react-icons/bs';

const Footer = () => {
    const quickLinks = ['Home', 'Men', 'Women', 'New', 'Sale'];
    const customerService = ['Help', 'Size Guide', 'Shipping', 'Returns', 'Contact'];
    const legal = ['About', 'Privacy', 'Terms', 'Cookies'];

    return (
        <footer className="bg-primary text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-accent/20"></div>
            </div>

            <div className="relative z-10">
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-12">
                        <div className="lg:col-span-2 xl:col-span-1 space-y-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-accent font-bold text-xl">S</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">SnapShop</h2>
                                    <p className="text-secondary text-sm font-medium">Premium Fashion</p>
                                </div>
                            </div>

                            <p className="text-gray-300 text-base leading-relaxed max-w-md">
                                Discover exceptional style and quality clothing for men and women. Elevate your wardrobe
                                with our curated collections.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white border-b-2 border-secondary pb-2 inline-block">
                                Quick Links
                            </h3>
                            <ul className="space-y-3">
                                {quickLinks.map((link) => (
                                    <li key={link}>
                                        <Link
                                            to="/"
                                            className="text-gray-300 hover:text-secondary transition-all duration-300 text-base flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-secondary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white border-b-2 border-secondary pb-2 inline-block">
                                Customer Service
                            </h3>
                            <ul className="space-y-3">
                                {customerService.map((service) => (
                                    <li key={service}>
                                        <Link
                                            to={service === 'Contact' ? '/contact' : '/'}
                                            className="text-gray-300 hover:text-secondary transition-all duration-300 text-base flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-secondary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                                            {service}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white border-b-2 border-secondary pb-2 inline-block">
                                Contact Us
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 text-gray-300 hover:text-secondary transition-colors">
                                    <BsEnvelope className="text-secondary text-lg" />
                                    <span className="text-base">info@snapshop.com</span>
                                </div>

                                <div className="flex items-center space-x-3 text-gray-300 hover:text-secondary transition-colors">
                                    <BsTelephone className="text-secondary text-lg" />
                                    <span className="text-base">+1 (555) 123-4567</span>
                                </div>

                                <div className="flex items-center space-x-3 text-gray-300 hover:text-secondary transition-colors">
                                    <BsGeoAlt className="text-secondary text-lg" />
                                    <span className="text-base">123 Fashion St, Style City</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <h4 className="font-semibold text-white mb-3">Follow Us</h4>
                                <div className="flex space-x-4">
                                    {[
                                        {
                                            Icon: BsFacebook,
                                            href: 'https://facebook.com',
                                            color: 'hover:text-blue-400',
                                        },
                                        { Icon: BsTwitter, href: 'https://twitter.com', color: 'hover:text-blue-300' },
                                        {
                                            Icon: BsInstagram,
                                            href: 'https://instagram.com',
                                            color: 'hover:text-pink-400',
                                        },
                                        {
                                            Icon: BsLinkedin,
                                            href: 'https://linkedin.com',
                                            color: 'hover:text-blue-500',
                                        },
                                    ].map(({ Icon, href, color }, i) => (
                                        <a
                                            key={i}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`text-gray-400 ${color} transition-all duration-300 p-2 rounded-lg hover:bg-white/10`}
                                        >
                                            <Icon size={20} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 bg-primary/80 backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-secondary rounded-full"></div>
                                <p className="text-gray-400 text-sm">&copy; 2024 SnapShop. All rights reserved.</p>
                            </div>

                            <div className="flex items-center space-x-6 text-sm">
                                {legal.map((item) => (
                                    <Link
                                        key={item}
                                        to="/"
                                        className="text-gray-400 hover:text-secondary transition-colors duration-300"
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
