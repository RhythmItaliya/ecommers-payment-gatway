import React from "react";
import { Link } from "react-router-dom";
import { BsFacebook, BsTwitter, BsInstagram, BsLinkedin, BsEnvelope, BsTelephone, BsGeoAlt } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info & Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-white">SnapShop</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover the latest trends in fashion. Quality clothing for men and women with exceptional style and comfort.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors duration-200">
                <BsFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors duration-200">
                <BsTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors duration-200">
                <BsInstagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors duration-200">
                <BsLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 transition-colors duration-200 text-sm relative group"
                >
                  <span className="relative">
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 transition-colors duration-200 text-sm relative group"
                >
                  <span className="relative">
                    Men
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 transition-colors duration-200 text-sm relative group"
                >
                  <span className="relative">
                    Women
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 transition-colors duration-200 text-sm relative group"
                >
                  <span className="relative">
                    New Arrivals
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 transition-colors duration-200 text-sm relative group"
                >
                  <span className="relative">
                    Sale
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 transition-colors duration-200 text-sm relative group"
                >
                  <span className="relative">
                    Help Center
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 transition-colors duration-200 text-sm relative group"
                >
                  <span className="relative">
                    Size Guide
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 transition-colors duration-200 text-sm relative group"
                >
                  <span className="relative">
                    Shipping Info
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 transition-colors duration-200 text-sm relative group"
                >
                  <span className="relative">
                    Returns & Exchanges
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 transition-colors duration-200 text-sm relative group"
                >
                  <span className="relative">
                    Contact Support
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <BsEnvelope className="text-white" size={16} />
                <span className="text-gray-300 text-sm">info@snapshop.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <BsTelephone className="text-white" size={16} />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <BsGeoAlt className="text-white" size={16} />
                <span className="text-gray-300 text-sm">123 Fashion St, Style City, SC 12345</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>&copy; 2024 SnapShop. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link 
                to="/" 
                className="text-gray-400 transition-colors duration-200 relative group"
              >
                <span className="relative">
                  About Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                </span>
              </Link>
              <Link 
                to="/" 
                className="text-gray-400 transition-colors duration-200 relative group"
              >
                <span className="relative">
                  Contact Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                </span>
              </Link>
              <Link 
                to="/" 
                className="text-gray-400 transition-colors duration-200 relative group"
              >
                <span className="relative">
                  Privacy Policy
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                </span>
              </Link>
              <Link 
                to="/" 
                className="text-gray-400 transition-colors duration-200 relative group"
              >
                <span className="relative">
                  Terms of Service
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                </span>
              </Link>
              <Link 
                to="/" 
                className="text-gray-400 transition-colors duration-200 relative group"
              >
                <span className="relative">
                  Cookie Policy
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
