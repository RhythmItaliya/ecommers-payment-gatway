import React from 'react';
import { formatINRPrice } from '../utils/currency';

const CheckOutItem = ({ item }) => {
    // Handle both data structures: item.productId (populated product) and item.product
    const product = item.productId || item.product;
    
    if (!product) {
        return null; // Skip if no product data
    }
    
    const { title, image, price } = product;
    const quantity = item.quantity; // Get quantity from the cart item, not from product

    return (
        <div className="flex gap-x-4 py-2 border-b border-gray-200 w-full font-light text-gray-500">
            <div className="w-full flex items-center gap-x-4">
                {/* Image */}
                <img className="max-w-[80px]" src={image} alt={title} />
                <div className="w-full flex flex-col">
                    {/* Title */}
                    <div className="flex justify-between mb-2">
                        <span className="text-sm uppercase font-medium text-primary">{title}</span>
                    </div>
                    <div className="flex justify-between items-center h-[36px] text-sm">
                        {/* Quantity */}
                        <div className="flex items-center text-primary font-medium">
                            Quantity: {quantity}
                        </div>
                        {/* Unit Price */}
                        <div className="flex items-center text-gray-600">
                            Unit: {formatINRPrice(price)}
                        </div>
                        {/* Total Price */}
                        <div className="flex items-center text-primary font-medium">
                            Total: {formatINRPrice(price * quantity)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckOutItem;
