import React from "react";
import { Link } from "react-router-dom";
import { BsFacebook, BsTwitter, BsInstagram, BsLinkedin } from "react-icons/bs";

const Footer = () => {
  const quickLinks = ["Home", "Men", "Women", "New", "Sale"];
  const customerService = ["Help", "Size Guide", "Shipping", "Returns", "Contact"];
  const legal = ["About", "Privacy", "Terms", "Cookies"];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-blue-600 font-bold">S</span>
              </div>
              <span className="text-lg font-bold">SnapShop</span>
            </div>
            <p className="text-gray-300 text-sm">
              Quality clothing for men and women with exceptional style.
            </p>
            <div className="flex space-x-3">
              {[
                { Icon: BsFacebook, href: "https://facebook.com" },
                { Icon: BsTwitter, href: "https://twitter.com" },
                { Icon: BsInstagram, href: "https://instagram.com" },
                { Icon: BsLinkedin, href: "https://linkedin.com" }
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link}>
                  <Link to="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h3 className="font-semibold border-b border-gray-700 pb-2">Customer Service</h3>
            <ul className="space-y-2">
              {customerService.map(service => (
                <li key={service}>
                  <Link to="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold border-b border-gray-700 pb-2">Contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>info@snapshop.com</p>
              <p>+1 (555) 123-4567</p>
              <p>123 Fashion St, Style City</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-2">
          <p className="text-gray-400 text-sm">&copy; 2024 SnapShop. All rights reserved.</p>
          <div className="flex space-x-4 text-sm">
            {legal.map(item => (
              <Link key={item} to="/" className="text-gray-400 hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
