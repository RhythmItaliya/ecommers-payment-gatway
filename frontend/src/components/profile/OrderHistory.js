import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaTimes } from 'react-icons/fa';
import { formatINRPrice } from '../../utils/currency';
import axios from 'axios';
import { Button, LoadingSpinner, ErrorState } from '../ui';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const token = useSelector((state) => state.auth.token);

    const statusConfig = {
        placed: {
            label: 'Order Placed',
            icon: FaBox,
            color: 'text-accent',
            bgColor: 'bg-accent/10',
            borderColor: 'border-accent/20',
        },
        confirmed: {
            label: 'Order Confirmed',
            icon: FaCheckCircle,
            color: 'text-success',
            bgColor: 'bg-success/10',
            borderColor: 'border-success/20',
        },
        processing: {
            label: 'Processing',
            icon: FaClock,
            color: 'text-secondary',
            bgColor: 'bg-secondary/10',
            borderColor: 'border-secondary/20',
        },
        shipped: {
            label: 'Shipped',
            icon: FaTruck,
            color: 'text-accent',
            bgColor: 'bg-accent/10',
            borderColor: 'border-accent/20',
        },
        delivered: {
            label: 'Delivered',
            icon: FaCheckCircle,
            color: 'text-success',
            bgColor: 'bg-success/10',
            borderColor: 'border-success/20',
        },
        cancelled: {
            label: 'Cancelled',
            icon: FaTimesCircle,
            color: 'text-danger',
            bgColor: 'bg-danger/10',
            borderColor: 'border-danger/20',
        },
    };

    useEffect(() => {
        fetchOrders();
    }, [selectedStatus]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/orders/my-orders?status=${selectedStatus}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            setError('Failed to load orders. Please try again.');
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
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                fetchOrders();
            }
        } catch (error) {
            // Handle error silently
        }
    };

    const getStatusConfig = (status) => {
        return statusConfig[status] || statusConfig.placed;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <LoadingSpinner size="lg" variant="primary" text="Loading orders..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16">
                <ErrorState error={error} onRetry={fetchOrders} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-primary mb-8">My Orders</h1>

            <div className="mb-6">
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-light rounded-lg text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                >
                    <option value="all">All Orders</option>
                    <option value="placed">Order Placed</option>
                    <option value="confirmed">Order Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <FaBox className="mx-auto h-12 w-12 text-neutral" />
                    <h3 className="mt-2 text-sm font-medium text-primary">No orders found</h3>
                    <p className="mt-1 text-sm text-neutral">
                        {selectedStatus === 'all'
                            ? "You haven't placed any orders yet."
                            : `No orders with status "${getStatusConfig(selectedStatus).label}" found.`}
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
                                <div className="p-4 border-b border-light">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
                                                <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-primary">Order #{order.orderNumber}</h4>
                                                <p className="text-sm text-neutral">
                                                    Placed on {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                                            >
                                                {statusConfig.label}
                                            </span>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowOrderDetails(true);
                                                }}
                                                className="p-2 text-neutral hover:text-primary"
                                                title="View Details"
                                            >
                                                <FaEye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="space-y-3">
                                        {order.items.slice(0, 2).map((item, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <img
                                                    src={
                                                        item.productId?.image ||
                                                        item.productId?.pictures?.[0] ||
                                                        '/placeholder-product.jpg'
                                                    }
                                                    alt={item.productId?.title || 'Product'}
                                                    className="w-12 h-12 object-cover rounded-md"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-primary truncate">
                                                        {item.productId?.title || 'Unknown Product'}
                                                    </p>
                                                    <p className="text-sm text-neutral">
                                                        Qty: {item.quantity} × {formatINRPrice(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {order.items.length > 2 && (
                                            <p className="text-sm text-neutral text-center">
                                                +{order.items.length - 2} more items
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-light">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-neutral">
                                                <p>
                                                    Total:{' '}
                                                    <span className="font-semibold">
                                                        {formatINRPrice(order.totalAmount)}
                                                    </span>
                                                </p>
                                                <p>
                                                    Payment: <span className="capitalize">{order.paymentMethod}</span>
                                                </p>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                {order.status === 'placed' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        className="border-danger text-danger hover:bg-danger hover:text-white"
                                                    >
                                                        Cancel Order
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowOrderDetails(true);
                                                    }}
                                                    className="p-2 text-neutral hover:text-primary"
                                                    title="View Details"
                                                >
                                                    <FaEye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 bg-neutral/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-primary">
                                    Order Details - #{selectedOrder.orderNumber}
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowOrderDetails(false)}
                                    className="p-2 text-neutral hover:text-primary"
                                >
                                    <FaTimes className="h-5 w-5" />
                                </Button>
                            </div>

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
                                                <span className={`font-medium ${config.color}`}>{config.label}</span>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-medium text-primary mb-3">Items</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-3 p-3 bg-light rounded-lg"
                                        >
                                            <img
                                                src={
                                                    item.productId?.image ||
                                                    item.productId?.pictures?.[0] ||
                                                    '/placeholder-product.jpg'
                                                }
                                                alt={item.productId?.title || 'Product'}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-primary">
                                                    {item.productId?.title || 'Unknown Product'}
                                                </p>
                                                <p className="text-sm text-neutral">
                                                    Qty: {item.quantity} × {formatINRPrice(item.price)}
                                                </p>
                                                <p className="text-sm font-medium text-primary">
                                                    Total: {formatINRPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-light pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-primary">Total Amount:</span>
                                    <span className="text-lg font-bold text-primary">
                                        {formatINRPrice(selectedOrder.totalAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-neutral mt-1">
                                    <span>Payment Method:</span>
                                    <span className="capitalize">{selectedOrder.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-neutral mt-1">
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
