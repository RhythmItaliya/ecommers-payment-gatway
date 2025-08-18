import React, { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Logo from "../img/logo.svg";
import { BsBag, BsSearch, BsHeart, BsPerson, BsTelephone } from "react-icons/bs";
import { IoMdArrowDown } from "react-icons/io";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Logout from "../auth/Logout";

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const { itemAmount } = useContext(CartContext);
  const { isLoggedIn, loading } = useContext(AuthContext);

  const handleLoginClick = () => setIsLoginModalOpen(true);
  const handleRegisterClick = () => setIsRegisterModalOpen(true);
  const handleCloseLoginModal = () => setIsLoginModalOpen(false);
  const handleCloseRegisterModal = () => setIsRegisterModalOpen(false);

  const handleCartClick = () => {
    if (isLoggedIn) {
      setIsOpen(!isOpen);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Searching for:", searchQuery);
  };

  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsActive(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      closeDropdowns();
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) {
    return;
  }

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary text-white py-2 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BsTelephone className="text-xs" />
              <span>+1 (555) 123-4567</span>
            </div>
            <span>Free shipping on orders over $50</span>
          </div>
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <button onClick={handleLoginClick} className="hover:text-gray-300 transition">
                  Sign In
                </button>
                <button onClick={handleRegisterClick} className="hover:text-gray-300 transition">
                  Sign Up
                </button>
              </>
            ) : (
              <Logout />
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`${isActive ? "bg-white py-3 shadow-lg" : "bg-white py-4"} fixed w-full z-10 transition-all duration-300`}
      >
        <div className="container mx-auto">
          {/* Logo and search row */}
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-[45px]">
                <img src={Logo} alt="Logo" />
              </div>
              <span className="text-2xl font-bold text-primary hidden md:block">FashionStore</span>
            </Link>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  <BsSearch className="text-xl" />
                </button>
              </form>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-6">
              <button className="relative group">
                <BsHeart className="text-2xl text-gray-600 group-hover:text-red-500 transition-colors" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
              
              <button className="relative group">
                <BsPerson className="text-2xl text-gray-600 group-hover:text-primary transition-colors" />
              </button>

              <button onClick={handleCartClick} className="relative group">
                <BsBag className="text-2xl text-gray-600 group-hover:text-primary transition-colors" />
                {itemAmount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {itemAmount}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Navigation menu */}
          <nav className="flex items-center justify-center space-x-8 text-sm font-medium">
            <div className="group relative">
              <button 
                className="flex items-center space-x-1 py-2 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('women');
                }}
              >
                <span>Women</span>
                <IoMdArrowDown className={`text-xs transition-transform ${activeDropdown === 'women' ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Women Dropdown */}
              {activeDropdown === 'women' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="py-4">
                    <div className="px-4">
                      <h4 className="font-semibold text-primary mb-3">Women's Clothing</h4>
                      <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-primary transition-colors">Dresses</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Tops & Blouses</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">T-Shirts</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Sweaters</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Pants & Jeans</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Skirts</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Jackets & Coats</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Activewear</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="group relative">
              <button 
                className="flex items-center space-x-1 py-2 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('men');
                }}
              >
                <span>Men</span>
                <IoMdArrowDown className={`text-xs transition-transform ${activeDropdown === 'men' ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Men Dropdown */}
              {activeDropdown === 'men' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="py-4">
                    <div className="px-4">
                      <h4 className="font-semibold text-primary mb-3">Men's Clothing</h4>
                      <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-primary transition-colors">Shirts</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">T-Shirts</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Sweaters</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Pants & Jeans</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Jackets & Coats</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Suits</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Activewear</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Underwear</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="group relative">
              <button 
                className="flex items-center space-x-1 py-2 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('jewelry');
                }}
              >
                <span>Jewelry</span>
                <IoMdArrowDown className={`text-xs transition-transform ${activeDropdown === 'jewelry' ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Jewelry Dropdown */}
              {activeDropdown === 'jewelry' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="py-4">
                    <div className="px-4">
                      <h4 className="font-semibold text-primary mb-3">Jewelry</h4>
                      <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-primary transition-colors">Necklaces</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Earrings</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Rings</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Bracelets</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Watches</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Anklets</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/" className="py-2 hover:text-primary transition-colors">
              New Arrivals
            </Link>
            
            <Link to="/" className="py-2 hover:text-primary transition-colors">
              Sale
            </Link>
          </nav>
        </div>
      </header>

      {/* Modals */}
      {isLoginModalOpen && <Login isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} onRegisterClick={handleRegisterClick} />}
      {isRegisterModalOpen && <Register isOpen={isRegisterModalOpen} onClose={handleCloseRegisterModal} onLoginClick={handleLoginClick} />}
    </>
  );
};

export default Header;
