import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SidebarContext } from "../contexts/SidebarContext";
import { Link } from "react-router-dom";
import Logo from "../img/logo.svg";
import { BsBag, BsHeart, BsList, BsX, BsChevronDown } from "react-icons/bs";
import Login from "../auth/Login";
import Register from "../auth/Register";
import { checkAuthStatus } from "../redux/authAction";
import { fetchCart } from "../redux/cartAction";
import { fetchWishlist } from "../redux/wishlistAction";
import { logoutUser } from "../redux/authAction";
import { showSuccessToast } from "../redux/toastAction";

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  // Get auth state directly from Redux instead of context
  const { isLoggedIn, loading, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  // Debug: Log current auth state
  console.log('Header - Current Redux auth state:', { isLoggedIn, loading, user });
  console.log('Header - Component re-rendering with state:', { isLoggedIn, loading, user });
  
  // Get cart and wishlist counts from Redux
  const { totalQuantity: cartCount } = useSelector(state => state.cart);
  const { totalItems: wishlistCount } = useSelector(state => state.wishlist);

  // Check auth status when component mounts
  useEffect(() => {
    console.log('Header mounted, checking auth status...');
    
    // Check if there's already a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found in localStorage, checking auth status...');
      dispatch(checkAuthStatus());
    } else {
      console.log('No token found in localStorage');
    }
  }, [dispatch]);

  // Debug: Log whenever auth state changes
  useEffect(() => {
    console.log('Header - Auth state changed:', { isLoggedIn, loading, user });
  }, [isLoggedIn, loading, user]);

  // Fetch cart and wishlist data when user is authenticated
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [isLoggedIn, dispatch]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      // Dispatch logout action
      const result = await dispatch(logoutUser());
      
      if (logoutUser.fulfilled.match(result)) {
        // Show success toast
        dispatch(showSuccessToast('Logged out successfully!'));
      }
      
      // Close dropdowns
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsActive(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      {/* Main header - Clean and simple */}
      <header
        className={`${
          isActive 
            ? "bg-white py-3 shadow-md" 
            : "bg-white py-5"
        } fixed w-full z-50 transition-all duration-300`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12">
                <img src={Logo} alt="Logo" className="w-full h-full" />
              </div>
              <span className="text-2xl font-bold text-primary hidden md:block">
                SnapShop
              </span>
            </Link>

            {/* Desktop Navigation Menu - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 relative group"
              >
                Men
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 relative group"
              >
                Women
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 relative group"
              >
                New Arrivals
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 relative group"
              >
                Sale
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
              </Link>
              <div className="border-l border-gray-300 h-6 mx-2"></div>
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                About Us
              </Link>
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                Contact Us
              </Link>
            </nav>

            {/* Right side icons - Clean and minimal */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Mobile Menu Button - Visible only on mobile */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors duration-200"
              >
                {mobileMenuOpen ? <BsX size={24} /> : <BsList size={24} />}
              </button>

              {/* User profile / Auth - FIRST */}
              {!isLoggedIn ? (
                <div className="hidden sm:flex items-center space-x-4">
                  <button 
                    onClick={handleLoginClick} 
                    className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 relative group"
                  >
                    Sign In
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
                  </button>
                <button
                    onClick={handleRegisterClick} 
                    className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 relative group"
                >
                    Sign Up
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
                </button>
                </div>
              ) : (
                <div className="hidden sm:block relative">
                  <div className="flex items-center space-x-3">
                    <div className="relative user-dropdown">
                      <button
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{user?.username || 'User'}</span>
                        <BsChevronDown className={`text-gray-500 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* User Dropdown Menu */}
                      {userDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            My Profile
                          </Link>
                          <Link
                            to="/wishlist"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            My Wishlist
                          </Link>
                          <div className="border-t border-gray-200 my-1"></div>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Wishlist - LAST */}
              <Link to="/wishlist" className="relative group">
                <BsHeart className="text-2xl text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              
              {/* Cart - LAST */}
              <button 
                onClick={handleCartClick} 
                className="relative group"
              >
                <BsBag className="text-2xl text-gray-600 group-hover:text-primary transition-colors duration-200" />
                {cartCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="pt-4 space-y-3">
                {/* Main Navigation Links */}
                <Link 
                  to="/" 
                  className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/" 
                  className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Men
                </Link>
                <Link 
                  to="/" 
                  className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Women
                </Link>
                <Link 
                  to="/" 
                  className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  New Arrivals
                </Link>
                <Link 
                  to="/" 
                  className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sale
                </Link>
                
                {/* Divider */}
                <div className="border-t border-gray-200 pt-3">
                  <Link 
                    to="/" 
                    className="block text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link 
                    to="/" 
                    className="block text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 mt-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
            </div>
            
                {/* Mobile Auth Buttons */}
                {!isLoggedIn ? (
                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <button 
                      onClick={() => {
                        handleLoginClick();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 py-2"
                    >
                      Sign In
                    </button>
              <button 
                      onClick={() => {
                        handleRegisterClick();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 py-2"
                    >
                      Sign Up
              </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <div className="flex items-center space-x-3 py-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.username || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-200 py-2"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
                </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      {isLoginModalOpen && (
        <Login 
          isOpen={isLoginModalOpen} 
          onClose={handleCloseLoginModal} 
          onRegisterClick={handleRegisterClick} 
        />
      )}
      {isRegisterModalOpen && (
        <Register 
          isOpen={isRegisterModalOpen} 
          onClose={handleCloseRegisterModal} 
          onLoginClick={handleLoginClick} 
        />
      )}
    </>
  );
};

export default Header;
