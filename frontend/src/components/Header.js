import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Logo from "../img/logo.svg";
import { BsBag, BsHeart, BsList, BsX, BsPerson } from "react-icons/bs";
import Login from "../auth/Login";
import Register from "../auth/Register";
import { checkAuthStatus } from "../redux/authAction";
import { fetchCart } from "../redux/cartAction";
import { fetchWishlist } from "../redux/wishlistAction";
import { SidebarContext } from "../contexts/SidebarContext";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();
  
  const dispatch = useDispatch();
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const { isLoggedIn } = useSelector(state => state.auth);
  const { totalQuantity: cartCount } = useSelector(state => state.cart);
  const { totalItems: wishlistCount } = useSelector(state => state.wishlist);

  const navItems = ["Home", "Men", "Women", "New", "Sale"];

  // Function to check if a nav item is active
  const isActive = (item) => {
    if (item === "Home" && location.pathname === "/") return true;
    if (item === "Men" && location.pathname.includes("/men")) return true;
    if (item === "Women" && location.pathname.includes("/women")) return true;
    if (item === "New" && location.pathname.includes("/new")) return true;
    if (item === "Sale" && location.pathname.includes("/sale")) return true;
    return false;
  };

  // Check auth status and fetch user data when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isLoggedIn) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isLoggedIn]);

  // Fetch cart and wishlist when user is authenticated
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [isLoggedIn, dispatch]);

  const handleCartClick = () => {
    if (isLoggedIn) {
      setIsOpen(!isOpen);
    } else {
      setShowLogin(true);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm fixed w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={Logo} alt="Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-800">SnapShop</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-6">
              {navItems.map(item => (
                <Link key={item} to="/" className={`transition-colors relative group ${
                  isActive(item) 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}>
                  {item}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                    isActive(item) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                {mobileMenuOpen ? <BsX size={20} /> : <BsList size={20} />}
              </button>

              {/* Auth */}
              {!isLoggedIn ? (
                <div className="hidden sm:flex space-x-3">
                  <button onClick={() => setShowLogin(true)} className="text-gray-600 hover:text-blue-600 relative group">
                    Sign In
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </button>
                  <button onClick={() => setShowRegister(true)} className="text-gray-600 hover:text-blue-600 relative group">
                    Sign Up
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </button>
                </div>
              ) : (
                <div className="hidden sm:block">
                  <Link to="/profile" className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <BsPerson size={20} />
                  </Link>
                </div>
              )}

              {/* Icons - All same size and consistent styling */}
              <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-red-500 transition-colors">
                <BsHeart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              
              <button onClick={handleCartClick} className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <BsBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="space-y-3">
                {navItems.map(item => (
                  <Link key={item} to="/" className={`block relative group ${
                    isActive(item) 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`} onClick={() => setMobileMenuOpen(false)}>
                    {item}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                      isActive(item) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </Link>
                ))}
                {!isLoggedIn ? (
                  <div className="pt-3 space-y-2">
                    <button onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-600 hover:text-blue-600 relative group">
                      Sign In
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                    </button>
                    <button onClick={() => { setShowRegister(true); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-600 hover:text-blue-600 relative group">
                      Sign Up
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-3 space-y-2">
                    <Link to="/profile" className="block text-gray-600 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                      Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      {showLogin && <Login isOpen={showLogin} onClose={() => setShowLogin(false)} onRegisterClick={() => { setShowLogin(false); setShowRegister(true); }} />}
      {showRegister && <Register isOpen={showRegister} onClose={() => setShowRegister(false)} onLoginClick={() => { setShowRegister(false); setShowLogin(true); }} />}
    </>
  );
};

export default Header;
