import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  
  // Redux cart state
  const { items, totalQuantity, totalAmount } = useSelector(state => state.cart);

  const handleCheckout = async () => {
    handleClose();
    await navigate("/checkout");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div
      className={`${isOpen ? "right-0" : "-right-full"
        } "w-full bg-white fixed top-0 h-full shadow-2xl sm:w-[85vw] md:w-[50vw] lg:w-[40vw] xl:w-[35vw] 2xl:w-[30vw] transition-all duration-300 z-[9999] px-3 sm:px-4 md:px-6 lg:px-[35px]"`}
    >
              <div className="flex items-center justify-between py-4 sm:py-5 md:py-6 border-b">
        <div className="uppercase text-xs sm:text-sm font-semibold">Shopping Bag ({totalQuantity})</div>
        <div
          onClick={handleClose}
          className="cursor-poniter w-8 h-8 flex justify-center items-center"
        >
          <IoMdArrowForward className="text-2xl cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2 h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] xl:h-[520px] 2xl:h-[560px] overflow-y-auto overflow-x-hidden border-b">
        {items.map((item, index) => (
          <CartItem item={item} key={item.id || index} />
        ))}
      </div>
      <div className="flex flex-col gap-y-3  mt-4">
        <div className="flex w-full justify-between items-center">
          {/* total */}
          <div className="font-semibold">
            <span className="mr-2">Subtotal:</span> ${" "}
            {parseFloat(totalAmount).toFixed(2)}
          </div>
          {/* clear cart icon */}
          <div
            onClick={handleClearCart}
            className="cursor-pointer py-4 bg-red-500 text-white w-12 h-12 flex justify-center items-center text-xl"
          >
            <FiTrash2 />
          </div>
        </div>
        <Link
          to={"/"}
          className="bg-gray-200 flex p-3 justify-center items-center text-primary w-full font-medium"
        >
          View Cart
        </Link>
        <div
          onClick={handleCheckout}
          className="bg-primary flex p-3 justify-center items-center text-white w-full font-medium cursor-pointer"
        >
          Checkout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
