import React from "react";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../redux/cartAction";
import { FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const { id, image, title, price, quantity } = item;

  const updateQuantity = (newQty) => {
    if (newQty > 0) dispatch(updateCartItemQuantity({ productId: id, quantity: newQty }));
  };

  return (
    <div className="flex gap-3 py-3 border-b border-gray-200">
      <img src={image} alt={title} className="w-16 h-16 object-cover rounded" />
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 max-w-32 truncate">
            {title}
          </Link>
          <button onClick={() => dispatch(removeFromCart(id))} className="text-gray-400 hover:text-red-500">
            <FiTrash2 size={16} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded">
            <button onClick={() => updateQuantity(quantity - 1)} className="px-2 py-1 hover:bg-gray-100">-</button>
            <span className="px-3 py-1 min-w-[2rem] text-center">{quantity}</span>
            <button onClick={() => updateQuantity(quantity + 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
          </div>
          <span className="font-medium text-gray-900">${(price * quantity).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
