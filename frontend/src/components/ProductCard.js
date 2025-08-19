import React, { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../contexts/AuthContext";
import { BsHeart, BsBag } from "react-icons/bs";
import { addToCart } from "../redux/cartAction";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistAction";
import Login from "../auth/Login";
import Register from "../auth/Register";

const ProductCard = ({ product, showQuickActions = true, showRating = true, showCategory = true, showAddToCart = true }) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  // Get wishlist state from Redux
  const { items: wishlistItems } = useSelector(state => state.wishlist);

  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some(item => 
    item.productId?.id === product.id || item.productId === product.id
  );

  // Handle add to cart
  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  // Handle add/remove from wishlist
  const handleWishlistToggle = (product) => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product.id));
    }
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const handleRegisterClick = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Quick Action Buttons */}
          {showQuickActions && (
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={() => handleWishlistToggle(product)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 ${
                  isInWishlist 
                    ? 'bg-pink-500 text-white hover:bg-pink-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BsHeart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          )}

          {/* Sale Badge */}
          {product.price < 50 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              SALE
            </div>
          )}

          {/* New Badge */}
          {product.id <= 10 && (
            <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 
            className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200 truncate cursor-pointer"
            title={product.title}
          >
            {product.title}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-primary">
              ${product.price}
            </span>
            {showCategory && (
              <span className="text-sm text-gray-500 capitalize">
                {product.category}
              </span>
            )}
          </div>

          {/* Rating */}
          {showRating && (
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.898 3.035 1.127-6.565L.49 6.56l6.614-.963L10 0l2.896 5.597 6.614.963-4.739 4.915 1.127 6.565z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">(4.5)</span>
            </div>
          )}

          {/* Add to Cart Button */}
          {showAddToCart && (
            <button 
              onClick={() => handleAddToCart(product)}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <BsBag className="w-4 h-4" />
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <Login 
          isOpen={isLoginModalOpen} 
          onClose={handleCloseLoginModal}
          onRegisterClick={handleRegisterClick}
        />
      )}

      {/* Register Modal */}
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

export default ProductCard;
