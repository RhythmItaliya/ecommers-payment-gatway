import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowForward } from 'react-icons/io';
import { FiTrash2 } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, fetchCart } from '../redux/cartAction';
import { showSuccessToast, showErrorToast, showWarningToast } from '../redux/toastAction';
import CartItem from './CartItem';
import { SidebarContext } from '../contexts/SidebarContext';
import { formatINRPrice, roundAmount } from '../utils/currency';

const Sidebar = () => {
    const { isOpen, handleClose } = useContext(SidebarContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, totalQuantity, totalAmount, loading } = useSelector((state) => state.cart);
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const roundedTotalAmount = roundAmount(totalAmount || 0);

    useEffect(() => {
        if (isOpen && isLoggedIn) {
            dispatch(fetchCart());
        }
    }, [isOpen, isLoggedIn, dispatch]);

    const handleCheckout = () => {
        if (user && user.address && user.address.streetAddress && user.address.city) {
            handleClose();
            navigate('/checkout');
        } else {
            handleClose();
            navigate('/profile');
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your entire cart? This action cannot be undone.')) {
            return;
        }

        try {
            dispatch(showWarningToast('Clearing your cart...'));
            const result = await dispatch(clearCart());

            if (clearCart.fulfilled.match(result)) {
                dispatch(showSuccessToast('Cart cleared successfully!'));
            } else if (clearCart.rejected.match(result)) {
                dispatch(showErrorToast('Failed to clear cart. Please try again.'));
            }
        } catch (error) {
            dispatch(showErrorToast('An error occurred while clearing cart'));
        }
    };

    return (
        <div
            className={`${isOpen ? 'right-0' : '-right-full'} fixed top-0 right-0 w-full sm:w-96 bg-white h-full shadow-xl transition-all duration-300 z-50 p-4`}
        >
            <div className="flex items-center justify-between py-4 border-b">
                <h2 className="font-semibold">Shopping Bag ({totalQuantity || 0})</h2>
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded">
                    <IoMdArrowForward className="text-xl" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 border-b max-h-96">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p>Loading cart...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Your cart is empty</p>
                        <p className="text-sm">Add some products to get started!</p>
                    </div>
                ) : (
                    items.map((item, index) => <CartItem item={item} key={item._id || item.id || index} />)
                )}
            </div>

            <div className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="font-semibold">Subtotal: {formatINRPrice(roundedTotalAmount)}</span>
                </div>

                {items.length > 0 && (
                    <button
                        onClick={handleClearCart}
                        className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 font-medium"
                        title="Clear all items from cart"
                    >
                        <FiTrash2 size={16} />
                        Clear All Cart
                    </button>
                )}

                <button
                    onClick={handleCheckout}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        items.length > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={items.length === 0}
                    title={
                        items.length > 0 && (!user?.address?.streetAddress || !user?.address?.city)
                            ? 'Please add your address before checkout'
                            : ''
                    }
                >
                    {items.length > 0 ? 'Checkout' : 'Cart is Empty'}
                </button>

                {items.length > 0 && (!user?.address?.streetAddress || !user?.address?.city) && (
                    <div className="text-center text-sm text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        Please add your address in profile before checkout
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
