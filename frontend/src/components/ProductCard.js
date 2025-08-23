import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsHeart, BsBag } from "react-icons/bs";
import { addToCart } from "../redux/cartAction";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistAction";
import { formatINRPrice } from "../utils/currency";
import Login from "../auth/Login";
import Register from "../auth/Register";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  const { isLoggedIn } = useSelector(state => state.auth);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  
  // Check if product is in wishlist by comparing product IDs
  const isInWishlist = wishlistItems.some(item => {
    // Handle both data structures: item.productId.id and item.productId
    const itemProductId = item.productId?.id || item.productId;
    return itemProductId === product.id || itemProductId === product._id;
  });

  const handleAddToCart = () => {
    if (!isLoggedIn) return setShowLogin(true);
    
    // Use the correct product ID for cart operations
    const productId = product.id || product._id;
    if (productId) {
      dispatch(addToCart({ productId, quantity: 1 }));
    }
  };

  const handleWishlistToggle = () => {
    if (!isLoggedIn) return setShowLogin(true);
    
    if (isInWishlist) {
      // Find the wishlist item to get the correct ID for removal
      const wishlistItem = wishlistItems.find(item => {
        const itemProductId = item.productId?.id || item.productId;
        return itemProductId === product.id || itemProductId === product._id;
      });
      
      if (wishlistItem) {
        // Use the product ID from the wishlist item for removal
        const removeId = wishlistItem.productId?.id || wishlistItem.productId;
        dispatch(removeFromWishlist(removeId));
      }
    } else {
      const productId = product.id || product._id;
      dispatch(addToWishlist(productId));
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative">
          <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded-t-lg" />
          
          {/* Wishlist Button */}
          <button 
            onClick={handleWishlistToggle} 
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <BsHeart className={`w-4 h-4 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          </button>

          {/* Badge */}
          {product.price < 50 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              SALE
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.title}</h3>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-blue-600">{formatINRPrice(product.price)}</span>
            <span className="text-sm text-gray-500 capitalize">{product.category}</span>
          </div>

          {/* Rating */}
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

          {/* Add to Cart */}
          <button onClick={handleAddToCart} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <BsBag className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && <Login isOpen={showLogin} onClose={() => setShowLogin(false)} onRegisterClick={() => { setShowLogin(false); setShowRegister(true); }} />}
      {showRegister && <Register isOpen={showRegister} onClose={() => setShowRegister(false)} onLoginClick={() => { setShowRegister(false); setShowLogin(true); }} />}
    </>
  );
};

export default ProductCard;
