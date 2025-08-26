import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsBag } from 'react-icons/bs';
import { addToCart } from '../../redux/cartAction';
import { showWarningToast, showSuccessToast } from '../../redux/toastAction';
import { formatINRPrice } from '../../utils/currency';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoggedIn } = useSelector((state) => state.auth);

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            dispatch(showWarningToast('Please login to add items to cart'));
            return;
        }

        const productId = product._id || product.id;
        dispatch(addToCart({ productId, quantity: 1 }));
        dispatch(showSuccessToast('Product added to cart successfully!'));
    };

    const handleTitleClick = () => {
        const productId = product._id || product.id;
        navigate(`/product/${productId}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />

                {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {product.discount}% OFF
                    </span>
                )}
            </div>

            <div className="p-4">
                <h3
                    className="font-semibold text-gray-900 mb-2 truncate cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={handleTitleClick}
                    title="Click to view details"
                >
                    {product.name || 'Product Name'}
                </h3>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-blue-600">{formatINRPrice(product.price || 0)}</span>
                        {product.discount > 0 && (
                            <span className="text-sm text-gray-400 line-through">
                                {formatINRPrice(product.highPrice || product.price || 0)}
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        <span className="text-sm text-gray-500 capitalize block">{product.category || 'Category'}</span>
                        <span className="text-xs text-gray-400 capitalize">{product.gender || 'Gender'}</span>
                    </div>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <BsBag className="w-4 h-4" />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
