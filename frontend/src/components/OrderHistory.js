import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaTimes } from 'react-icons/fa';
import { formatINRPrice } from '../utils/currency';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const token = useSelector(state => state.auth.token);

  const statusConfig = {
    placed: {
      label: 'Order Placed',
      icon: FaBox,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    confirmed: {
      label: 'Order Confirmed',
      icon: FaCheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    processing: {
      label: 'Processing',
      icon: FaClock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    shipped: {
      label: 'Shipped',
      icon: FaTruck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    delivered: {
      label: 'Delivered',
      icon: FaCheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    cancelled: {
      label: 'Cancelled',
      icon: FaTimesCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/my-orders?status=${selectedStatus}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Refresh orders
        fetchOrders();
        alert('Order cancelled successfully');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    return statusConfig[status] || statusConfig.placed;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Order History</h3>
        
        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Orders</option>
          <option value="placed">Order Placed</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <FaBox className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedStatus === 'all' 
              ? "You haven't placed any orders yet." 
              : `No orders with status "${getStatusConfig(selectedStatus).label}" found.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={order._id}
                className={`bg-white rounded-lg border ${statusConfig.borderColor} shadow-sm hover:shadow-md transition-shadow`}
              >
                {/* Order Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
                        <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Order #{order.orderNumber}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Details"
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4">
                  <div className="space-y-3">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={item.productId?.image || item.productId?.pictures?.[0] || '/placeholder-product.jpg'}
                          alt={item.productId?.title || 'Product'}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.productId?.title || 'Unknown Product'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × {formatINRPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>Total: <span className="font-semibold">{formatINRPrice(order.totalAmount)}</span></p>
                        <p>Payment: <span className="capitalize">{order.paymentMethod}</span></p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {['placed', 'confirmed', 'processing'].includes(order.status) && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Details - #{selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              {/* Order Status */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  {(() => {
                    const config = getStatusConfig(selectedOrder.status);
                    const Icon = config.icon;
                    return (
                      <>
                        <div className={`p-2 rounded-full ${config.bgColor}`}>
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <span className={`font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.productId?.image || item.productId?.pictures?.[0] || '/placeholder-product.jpg'}
                        alt={item.productId?.title || 'Product'}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.productId?.title || 'Unknown Product'}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × {formatINRPrice(item.price)}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          Total: {formatINRPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Amount:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatINRPrice(selectedOrder.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                  <span>Payment Method:</span>
                  <span className="capitalize">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                  <span>Order Date:</span>
                  <span>{formatDate(selectedOrder.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
