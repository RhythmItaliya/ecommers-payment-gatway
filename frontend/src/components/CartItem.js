import React from "react";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../redux/cartAction";
import { FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const { id, image, title, price, quantity } = item;

  const handleRemove = () => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartItemQuantity({ productId: id, quantity: newQuantity }));
    }
  };

  return (
    <div className="flex gap-x-4 py-2 lg:px-6 border-b border-gray-200 w-full font-light text-gray-500">
      <div className="w-full min-h-[150px] flex items-center gap-x-4">
        {/* image */}
        <img className="max-w-[80px]" src={image} alt="" />
        <div className="w-full flex flex-col">
          {/* title */}
          <div className="flex justify-between mb-2">
            <Link to={`/product/${id}`} className="text-sm uppercase font-medium max-w-[240px] text-primary hover:underline">
              {title}
            </Link>
            {/* remove icon */}
            <div
              onClick={handleRemove}
              className="text-xl cursor-pointer text-gray-500 hover:text-red-500 transition-colors"
            >
              <FiTrash2 />
            </div>
          </div>
          <div className="flex gap-x-2 h-[36px] text-sm">
            {/* quantity */}
            <div className="flex flex-1 max-w-[100px] items-center h-full border text-primary font-medium">
              <div
                onClick={() => handleQuantityChange(quantity - 1)}
                className="flex-1 h-full flex justify-center items-center cursor-pointer select-none transition-all hover:bg-gray-100"
              >
                -
              </div>
              <div className="h-full flex justify-center items-center px-3 min-w-[40px]">
                {quantity}
              </div>
              <div
                onClick={() => handleQuantityChange(quantity + 1)}
                className="flex-1 h-full flex justify-center items-center cursor-pointer select-none transition-all hover:bg-gray-100"
              >
                +
              </div>
            </div>
            {/* price */}
            <div className="flex-1 max-w-[100px] flex items-center justify-around text-primary font-medium">
              $ {parseFloat(price).toFixed(2)}
            </div>
            {/* final price */}
            <div className="flex-1 max-w-[100px] flex justify-end items-center text-primary font-medium">
              $ {(parseFloat(price) * quantity).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
