import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '../redux/toastAction';
import { 
  FaUsers, 
  FaShoppingCart, 
  FaCog, 
  FaSignOutAlt, 
  FaChartBar, 
  FaHome,
  FaBox,
  FaCreditCard,
  FaBell,
  FaSearch,
  FaBars,
  FaTimes
} from 'react-icons/fa';

// Import admin page components
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';

const AdminPanel = () => {
    const [adminData, setAdminData] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState([]);
    
    const navigate = useNavigate();

    // API base URL from environment
    const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL || 'http://localhost:5000/api/admin';

    const logout = useCallback(() => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/');
    }, [navigate]);

    const checkAdminAuth = useCallback(() => {
        const adminToken = localStorage.getItem('adminToken');
        const adminData = localStorage.getItem('adminData');
        
        if (!adminToken || !adminData) {
            navigate('/');
            return;
        }

        try {
            setAdminData(JSON.parse(adminData));
        } catch (error) {
            logout();
        }
    }, [navigate, logout]);

    const loadDashboard = useCallback(async () => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await axios.get(`${ADMIN_API_URL}/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            
            if (response.data.success) {
                setDashboardData(response.data.data);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                logout();
            } else {
                console.error('Failed to load dashboard data:', error);
            }
        } finally {
            setLoading(false);
        }
    }, [logout, ADMIN_API_URL]);

    useEffect(() => {
        checkAdminAuth();
        loadDashboard();
        
        // Mock notifications
        setNotifications([
            { id: 1, message: 'New user registered', time: '2 min ago', type: 'info' },
            { id: 2, message: 'Order #1234 completed', time: '5 min ago', type: 'success' },
            { id: 3, message: 'Payment failed for order #1235', time: '10 min ago', type: 'warning' }
        ]);
    }, [checkAdminAuth, loadDashboard]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Loading Admin Dashboard...</p>
                </div>
            </div>
        );
    }

    if (!adminData) {
        return null;
    }

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FaHome, color: 'text-blue-600' },
        { id: 'users', label: 'Users', icon: FaUsers, color: 'text-green-600' },
        { id: 'orders', label: 'Orders', icon: FaShoppingCart, color: 'text-purple-600' },
        { id: 'products', label: 'Products', icon: FaBox, color: 'text-orange-600' },
        { id: 'payments', label: 'Payments', icon: FaCreditCard, color: 'text-red-600' },
        { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-600' }
    ];

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard dashboardData={dashboardData} />;
            case 'products':
                return <Products />;
            case 'users':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Users Management</h2>
                        <p className="text-gray-600">Manage user accounts and permissions.</p>
                    </div>
                );
            case 'orders':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Orders Management</h2>
                        <p className="text-gray-600">View and manage customer orders.</p>
                    </div>
                );
            case 'payments':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Management</h2>
                        <p className="text-gray-600">Monitor payment transactions and refunds.</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Settings</h2>
                        <p className="text-gray-600">Configure system preferences and settings.</p>
                    </div>
                );
            default:
                return <Dashboard dashboardData={dashboardData} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left side */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                            >
                                {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                            </button>
                            <div className="ml-4 lg:ml-0">
                                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="hidden md:block">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
                                <FaBell size={20} />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>

                            {/* Admin Profile */}
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">
                                        {adminData.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-900">{adminData.username}</p>
                                    <p className="text-xs text-gray-500">{adminData.role}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
                                    title="Logout"
                                >
                                    <FaSignOutAlt size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                    <div className="h-full flex flex-col">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <FaChartBar className="text-white" size={20} />
                            </div>
                            <span className="ml-3 text-lg font-semibold text-gray-900">Admin Panel</span>
                        </div>

                        {/* Navigation Items */}
                        <nav className="flex-1 px-4 py-6 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            activeTab === item.id
                                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <Icon className={`mr-3 ${item.color}`} size={18} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Sidebar Footer */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="text-xs text-gray-500 text-center">
                                Version 1.0.0
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 lg:ml-0">
                    <main className="p-6">
                        {renderContent()}
                    </main>
                </div>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default AdminPanel;
