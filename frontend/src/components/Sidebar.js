import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowForward } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, fetchCart } from "../redux/cartAction";
import CartItem from "../components/CartItem";
import { SidebarContext } from "../contexts/SidebarContext";
import { formatINRPrice } from "../utils/currency";

const Sidebar = () => {
  const { isOpen, handleClose } = useContext(SidebarContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount, loading } = useSelector(state => state.cart);
  const { isLoggedIn } = useSelector(state => state.auth);

  // Fetch cart data when sidebar opens
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      console.log('Sidebar: Fetching cart data...');
      dispatch(fetchCart());
    }
  }, [isOpen, isLoggedIn, dispatch]);

  // Debug logging
  useEffect(() => {
    console.log('Sidebar: Cart data received:', {
      items,
      totalQuantity,
      totalAmount,
      loading
    });
    
    if (items && items.length > 0) {
      console.log('Sidebar: First item details:', {
        item: items[0],
        product: items[0].productId,
        price: items[0].price,
        quantity: items[0].quantity
      });
    }
  }, [items, totalQuantity, totalAmount, loading]);

  const handleCheckout = () => {
    handleClose();
    navigate("/checkout");
  };

  return (
    <div className={`${isOpen ? "right-0" : "-right-full"} fixed top-0 right-0 w-full sm:w-96 bg-white h-full shadow-xl transition-all duration-300 z-50 p-4`}>
      
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b">
        <h2 className="font-semibold">Shopping Bag ({totalQuantity || 0})</h2>
        <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded">
          <IoMdArrowForward className="text-xl" />
        </button>
      </div>

      {/* Cart Items */}
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
          items.map((item, index) => (
            <CartItem item={item} key={item._id || item.id || index} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="py-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Subtotal: {formatINRPrice(totalAmount || 0)}</span>
          {items.length > 0 && (
            <button 
              onClick={() => dispatch(clearCart())} 
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              title="Clear cart"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
        
        <button 
          onClick={handleCheckout} 
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            items.length > 0 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={items.length === 0}
        >
          {items.length > 0 ? 'Checkout' : 'Cart is Empty'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
