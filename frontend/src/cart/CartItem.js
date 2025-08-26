import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../redux/cartAction';
import { showSuccessToast, showErrorToast } from '../redux/toastAction';
import { FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formatINRPrice } from '../utils/currency';

const CartItem = ({ item }) => {
    const dispatch = useDispatch();

    const product = item.productId || item.product;

    if (!product) {
        return null;
    }

    const { _id, id, image, name: title } = product;
    const { quantity, price } = item;

    const productId = _id || id;

    const updateQuantity = async (newQty) => {
        if (newQty > 0) {
            try {
                const result = await dispatch(updateCartItemQuantity({ productId, quantity: newQty }));
                if (updateCartItemQuantity.fulfilled.match(result)) {
                    dispatch(showSuccessToast(`Quantity updated to ${newQty}`));
                } else if (updateCartItemQuantity.rejected.match(result)) {
                    dispatch(showErrorToast('Failed to update quantity'));
                }
            } catch (error) {
                dispatch(showErrorToast('An error occurred while updating quantity'));
            }
        }
    };

    const handleRemove = async () => {
        if (!window.confirm('Are you sure you want to remove this item from cart?')) {
            return;
        }

        try {
            const result = await dispatch(removeFromCart(productId));
            if (removeFromCart.fulfilled.match(result)) {
                dispatch(showSuccessToast('Item removed from cart'));
            } else if (removeFromCart.rejected.match(result)) {
                dispatch(showErrorToast('Failed to remove item from cart'));
            }
        } catch (error) {
            dispatch(showErrorToast('An error occurred while removing item'));
        }
    };

    return (
        <div className="flex gap-3 py-3 border-b border-gray-200">
            <img src={image} alt={title} className="w-16 h-16 object-cover rounded" />

            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <Link
                        to={`/product/${productId}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 max-w-32 truncate"
                    >
                        {title}
                    </Link>
                    <button
                        onClick={handleRemove}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove from cart"
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center border rounded">
                        <button
                            onClick={() => updateQuantity(quantity - 1)}
                            className="px-2 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <span className="px-3 py-1 min-w-[2rem] text-center">{quantity}</span>
                        <button
                            onClick={() => updateQuantity(quantity + 1)}
                            className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        >
                            +
                        </button>
                    </div>
                    <span className="font-medium text-gray-900">{formatINRPrice(price * quantity)}</span>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
