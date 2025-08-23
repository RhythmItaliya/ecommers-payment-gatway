import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, clearWishlist } from '../redux/wishlistAction';
import { BsHeart, BsTrash } from 'react-icons/bs';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { formatINRPrice } from '../utils/currency';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector(state => state.auth);
  const { items: wishlistItems, loading, error, totalItems } = useSelector(state => state.wishlist);

  useEffect(() => {
    if (isLoggedIn && user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isLoggedIn, user]);

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      await dispatch(clearWishlist());
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BsHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Please Login</h2>
          <p className="text-gray-500">You need to be logged in to view your wishlist.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Error</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <BsHeart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {totalItems} items
            </span>
          </div>
          
          {totalItems > 0 && (
            <button
              onClick={handleClearWishlist}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              <BsTrash className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Wishlist Items */}
        {totalItems === 0 ? (
          <div className="text-center py-16">
            <BsHeart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Start adding products you love to your wishlist!</p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              // Handle both data structures: item.productId and item.product
              const product = item.productId || item.product;
              if (!product) return null; // Skip if no product data
              
              return (
                <div key={item._id || item.id} className="relative">
                  {/* Wishlist Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      WISHLIST
                    </div>
                  </div>
                  
                  {/* Added Date Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full opacity-90">
                      {new Date(item.addedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Product Card */}
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
