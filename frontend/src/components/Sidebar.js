import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowForward } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartAction";
import CartItem from "../components/CartItem";
import { SidebarContext } from "../contexts/SidebarContext";

const Sidebar = () => {
  const { isOpen, handleClose } = useContext(SidebarContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector(state => state.cart);

  const handleCheckout = () => {
    handleClose();
    navigate("/checkout");
  };

  return (
    <div className={`${isOpen ? "right-0" : "-right-full"} fixed top-0 right-0 w-full sm:w-96 bg-white h-full shadow-xl transition-all duration-300 z-50 p-4`}>
      
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b">
        <h2 className="font-semibold">Shopping Bag ({totalQuantity})</h2>
        <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded">
          <IoMdArrowForward className="text-xl" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto py-4 border-b max-h-96">
        {items.map((item, index) => (
          <CartItem item={item} key={item.id || index} />
        ))}
      </div>

      {/* Footer */}
      <div className="py-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Subtotal: ${parseFloat(totalAmount).toFixed(2)}</span>
          <button onClick={() => dispatch(clearCart())} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
            <FiTrash2 />
          </button>
        </div>
        
        <button onClick={handleCheckout} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
