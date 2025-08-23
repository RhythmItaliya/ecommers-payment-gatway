import React from "react";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../redux/cartAction";
import { FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { formatINRPrice } from "../utils/currency";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  
  // Handle both data structures: item.productId (populated product) and item.product
  const product = item.productId || item.product;
  
  if (!product) {
    console.warn('CartItem: No product data found for item:', item);
    return null; // Skip if no product data
  }
  
  const { _id, id, image, title } = product;
  const { quantity, price } = item; // Get quantity and price from the item, not the product
  
  // Use the correct ID for cart operations
  const productId = id || _id;

  // Debug logging
  console.log('CartItem render:', {
    item,
    product,
    productId,
    itemPrice: item.price,
    productPrice: product.price,
    quantity,
    calculatedPrice: price * quantity
  });

  const updateQuantity = (newQty) => {
    if (newQty > 0) {
      dispatch(updateCartItemQuantity({ productId, quantity: newQty }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(productId));
  };

  return (
    <div className="flex gap-3 py-3 border-b border-gray-200">
      <img src={image} alt={title} className="w-16 h-16 object-cover rounded" />
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${productId}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 max-w-32 truncate">
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
          <span className="font-medium text-gray-900">
            {formatINRPrice(price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
