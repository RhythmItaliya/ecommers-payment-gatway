import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, clearWishlist } from '../redux/wishlistAction';
import { addToCart } from '../redux/cartAction';
import { BsHeart, BsBag, BsTrash } from 'react-icons/bs';
import LoadingSpinner from '../components/LoadingSpinner';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector(state => state.auth);
  const { items: wishlistItems, loading, error, totalItems } = useSelector(state => state.wishlist);

  useEffect(() => {
    if (isLoggedIn && user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isLoggedIn, user]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

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
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.product.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <div className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      WISHLIST
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate" title={item.product.title}>
                    {item.product.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary">
                      ${item.product.price}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {item.product.category}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item.product)}
                      className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <BsBag className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
