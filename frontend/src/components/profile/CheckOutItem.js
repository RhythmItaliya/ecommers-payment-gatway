import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../../redux/cartAction';
import { Button } from '../ui';

const CheckOutItem = ({ item }) => {
    const dispatch = useDispatch();

    const product = item.productId || item.product;
    if (!product) return null;

    const productId = product.id || product._id;
    const productName = product.title || product.name || 'Unknown Product';
    const productImage = product.image || product.pictures?.[0] || '/placeholder-product.jpg';
    const productPrice = item.price || product.price || 0;
    const quantity = item.quantity || 1;

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
        }
    };

    const handleRemove = () => {
        dispatch(removeFromCart(productId));
    };

    return (
        <div className="flex items-center space-x-4 p-4 border border-light rounded-xl hover:shadow-md transition-shadow">
            <div className="flex-shrink-0">
                <img src={productImage} alt={productName} className="w-16 h-16 object-cover rounded-lg" />
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-primary truncate">{productName}</h3>
                <p className="text-sm text-neutral">₹{productPrice.toFixed(2)}</p>
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 p-0 border-neutral text-neutral hover:bg-light"
                >
                    -
                </Button>

                <span className="text-sm font-medium text-primary min-w-[2rem] text-center">{quantity}</span>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-8 h-8 p-0 border-neutral text-neutral hover:bg-light"
                >
                    +
                </Button>
            </div>

            <div className="text-right">
                <p className="text-sm font-semibold text-primary">₹{(productPrice * quantity).toFixed(2)}</p>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-danger hover:text-danger/80 hover:bg-danger/10"
                title="Remove item"
            >
                ×
            </Button>
        </div>
    );
};

export default CheckOutItem;
