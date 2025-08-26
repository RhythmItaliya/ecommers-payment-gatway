import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, clearWishlist } from '../../redux/wishlistAction';
import ProductCard from '../product/ProductCard';
import { Button, ErrorState, LoadingSpinner } from '../ui';
import { showWarningToast } from '../../redux/toastAction';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { items: wishlist = [], loading, error } = useSelector((state) => state.wishlist);

    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    const handleClearWishlist = () => {
        if (window.confirm('Are you sure you want to clear your wishlist? This action cannot be undone.')) {
            dispatch(showWarningToast('Clearing wishlist...'));
            dispatch(clearWishlist());
        }
    };

    if (loading) return <LoadingSpinner size="lg" variant="primary" text="Loading wishlist..." />;
    if (error) return <ErrorState error={error} onRetry={() => dispatch(fetchWishlist())} />;

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8 mt-8">
                <h1 className="text-3xl font-bold text-primary">My Wishlist</h1>
                {wishlist && wishlist.length > 0 && (
                    <Button variant="danger" size="sm" onClick={handleClearWishlist}>
                        Clear Wishlist
                    </Button>
                )}
            </div>

            {!wishlist || wishlist.length === 0 ? (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold text-primary mb-2">Your Wishlist is Empty</h3>
                    <p className="text-neutral mb-6">Start adding products to your wishlist to see them here!</p>
                    <Button variant="primary" size="lg" onClick={() => window.history.back()}>
                        Continue Shopping
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                        <div
                            key={product._id || product.id}
                            className="transform hover:scale-105 transition-transform duration-300"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
