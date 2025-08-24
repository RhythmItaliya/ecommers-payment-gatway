import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSignOutAlt, FaGlobe, FaBuilding, FaHome, FaShoppingBag } from 'react-icons/fa';
import { logoutUser } from '../redux/authAction';
import { updateUserProfile } from '../redux/authAction';
import { showSuccessToast, showErrorToast } from '../redux/toastAction';
import OrderHistory from '../components/OrderHistory';

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoggedIn, loading } = useSelector(state => state.auth);
    
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        address: {
            streetAddress: '',
            apartment: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
        },
        avatar: ''
    });

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
            return;
        }

        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                address: {
                    streetAddress: user.address?.streetAddress || '',
                    apartment: user.address?.apartment || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    country: user.address?.country || '',
                    zipCode: user.address?.zipCode || ''
                },
                avatar: user.avatar || ''
            });
        }
    }, [user, isLoggedIn, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic frontend validation
        if (!formData.username.trim()) {
            dispatch(showErrorToast('Username is required'));
            return;
        }
        
        if (!formData.email.trim()) {
            dispatch(showErrorToast('Email is required'));
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            dispatch(showErrorToast('Please enter a valid email address'));
            return;
        }
        
        try {
            // Prepare the data to update
            const updateData = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                address: formData.address
            };
            
            // Dispatch the update action
            const result = await dispatch(updateUserProfile(updateData));
            
            if (updateUserProfile.fulfilled.match(result)) {
                // Update successful
                setIsEditing(false);
                dispatch(showSuccessToast('Profile updated successfully!'));
            } else if (updateUserProfile.rejected.match(result)) {
                // Update failed - show error toast
                let errorMessage = 'Failed to update profile';
                
                if (result.payload) {
                    // Handle different types of errors
                    if (result.payload.errors && Array.isArray(result.payload.errors)) {
                        // Multiple validation errors
                        errorMessage = result.payload.errors.join(', ');
                    } else if (result.payload.message) {
                        // Single error message
                        errorMessage = result.payload.message;
                    }
                }
                
                dispatch(showErrorToast(errorMessage));
            }
        } catch (error) {
            console.error('Profile update error:', error);
            dispatch(showErrorToast('An error occurred while updating your profile'));
        }
    };

    const handleLogout = async () => {
        try {
            const result = await dispatch(logoutUser());
            
            if (logoutUser.fulfilled.match(result)) {
                dispatch(showSuccessToast('Logged out successfully!'));
            }
            
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleCancelEdit = () => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                address: {
                    streetAddress: user.address?.streetAddress || '',
                    apartment: user.address?.apartment || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    country: user.address?.country || '',
                    zipCode: user.address?.zipCode || ''
                },
                avatar: user.avatar || ''
            });
        }
        setIsEditing(false);
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-primary">
                                    My Profile
                                </h1>
                                <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-3 px-6 py-3 bg-primary text-white rounded-xl hover:bg-custom-gray transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <FaSignOutAlt />
                                <span className="font-semibold">Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                        <div className="flex space-x-1">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                    activeTab === 'profile'
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <FaUser className="h-4 w-4" />
                                <span>Profile</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                    activeTab === 'orders'
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <FaShoppingBag className="h-4 w-4" />
                                <span>My Orders</span>
                            </button>
                        </div>
                    </div>

                    {activeTab === 'profile' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Profile Card */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-24">
                                    <div className="text-center">
                                        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <h2 className="text-2xl font-bold text-primary mb-2">
                                            {user?.username || 'User'}
                                        </h2>
                                        <p className="text-gray-600 mb-6">{user?.email || 'user@example.com'}</p>
                                        
                                        {!isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="w-full bg-primary text-white py-3 px-6 rounded-xl font-semibold hover:bg-custom-gray transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            >
                                                <FaEdit className="inline mr-2" />
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="lg:col-span-3">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                                        {isEditing && (
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    form="profile-form"
                                                    disabled={loading}
                                                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loading ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
                                        {/* Personal Information */}
                                        <div className="space-y-6">
                                            <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                                Personal Information
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <FaUser className="inline mr-2 text-primary" />
                                                        Username
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                                                            isEditing 
                                                                ? 'border-gray-300 focus:border-primary bg-white' 
                                                                : 'border-gray-200 bg-gray-50 text-gray-600'
                                                        }`}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <FaEnvelope className="inline mr-2 text-primary" />
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                                                            isEditing 
                                                                ? 'border-gray-300 focus:border-primary bg-white' 
                                                                : 'border-gray-200 bg-gray-50 text-gray-600'
                                                        }`}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <FaPhone className="inline mr-2 text-primary" />
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        placeholder="+1 (555) 123-4567"
                                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                                                            isEditing 
                                                                ? 'border-gray-300 focus:border-primary bg-white' 
                                                                : 'border-gray-200 bg-gray-50 text-gray-600'
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address Information */}
                                        <div className="space-y-6">
                                            <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                                <FaMapMarkerAlt className="inline mr-2 text-primary" />
                                                Address Information
                                            </h4>
                                            
                                            <div className="space-y-4">
                                                {/* Street Address */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <FaHome className="inline mr-2 text-primary" />
                                                        Street Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address.streetAddress"
                                                        value={formData.address.streetAddress}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        placeholder="123 Main Street"
                                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                                                            isEditing 
                                                                ? 'border-gray-300 focus:border-primary bg-white' 
                                                                : 'border-gray-200 bg-gray-50 text-gray-600'
                                                        }`}
                                                    />
                                                </div>

                                                {/* Apartment/Suite */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <FaBuilding className="inline mr-2 text-primary" />
                                                        Apartment, suite, etc. (optional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address.apartment"
                                                        value={formData.address.apartment}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        placeholder="Apt 4B"
                                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                                                            isEditing 
                                                                ? 'border-gray-300 focus:border-primary bg-white' 
                                                                : 'border-gray-200 bg-gray-50 text-gray-600'
                                                        }`}
                                                    />
                                                </div>

                                                {/* City, State, Country Row */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            City
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="address.city"
                                                            value={formData.address.city}
                                                            onChange={handleChange}
                                                            disabled={!isEditing}
                                                            placeholder="New York"
                                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                                                                isEditing 
                                                                    ? 'border-gray-300 focus:border-primary bg-white' 
                                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                                            }`}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            State/Province
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="address.state"
                                                            value={formData.address.state}
                                                            onChange={handleChange}
                                                            disabled={!isEditing}
                                                            placeholder="NY"
                                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                                                                isEditing 
                                                                    ? 'border-gray-300 focus:border-primary bg-white' 
                                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                                            }`}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            <FaGlobe className="inline mr-2 text-primary" />
                                                            Country
                                                        </label>
                                                        <select
                                                            name="address.country"
                                                            value={formData.address.country}
                                                            onChange={handleChange}
                                                            disabled={!isEditing}
                                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                                                                isEditing 
                                                                    ? 'border-gray-300 focus:border-primary bg-white' 
                                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                                            }`}
                                                        >
                                                            <option value="">Select Country</option>
                                                            <option value="US">United States</option>
                                                            <option value="CA">Canada</option>
                                                            <option value="UK">United Kingdom</option>
                                                            <option value="AU">Australia</option>
                                                            <option value="DE">Germany</option>
                                                            <option value="FR">France</option>
                                                            <option value="IN">India</option>
                                                            <option value="JP">Japan</option>
                                                            <option value="BR">Brazil</option>
                                                            <option value="MX">Mexico</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* ZIP/Postal Code */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        ZIP/Postal Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address.zipCode"
                                                        value={formData.address.zipCode}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        placeholder="10001"
                                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                                                            isEditing 
                                                                ? 'border-gray-300 focus:border-primary bg-white' 
                                                                : 'border-gray-200 bg-gray-50 text-gray-600'
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Orders Tab */
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <OrderHistory />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;