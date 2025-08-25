import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSignOutAlt, FaGlobe, FaBuilding, FaHome, FaShoppingBag } from 'react-icons/fa';
import { logoutUser } from '../../redux/authAction';
import { updateUserProfile } from '../../redux/authAction';
import { showSuccessToast, showErrorToast } from '../../redux/toastAction';
import OrderHistory from './OrderHistory';
import { clearAllData } from '../../utils/storeUtils';
import { Input, Button, LoadingSpinner } from '../ui';

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoggedIn, loading } = useSelector(state => state.auth);
    
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
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
                firstName: user.firstName || '',
                lastName: user.lastName || '',
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
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
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
                // Clear all Redux stores and localStorage
                clearAllData(dispatch);
                dispatch(showSuccessToast('Logged out successfully!'));
            }
            
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails, clear all stores
            clearAllData(dispatch);
        }
    };

    const handleCancelEdit = () => {
        if (user) {
            setFormData({
                username: user.username || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
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
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-primary">
                                    My Profile
                                </h1>
                                <p className="text-neutral text-sm mt-1">Manage your account settings and preferences</p>
                            </div>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleLogout}
                                className="flex items-center space-x-2"
                            >
                                <FaSignOutAlt />
                                <span>Sign Out</span>
                            </Button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="flex space-x-1">
                            <Button
                                variant={activeTab === 'profile' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('profile')}
                                className="flex items-center space-x-2"
                            >
                                <FaUser className="h-4 w-4" />
                                <span>Profile</span>
                            </Button>
                            <Button
                                variant={activeTab === 'orders' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('orders')}
                                className="flex items-center space-x-2"
                            >
                                <FaShoppingBag className="h-4 w-4" />
                                <span>My Orders</span>
                            </Button>
                        </div>
                    </div>

                    {activeTab === 'profile' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Profile Card */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                                            {user?.firstName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <h2 className="text-xl font-bold text-primary mb-2">
                                            {user?.firstName && user?.lastName 
                                                ? `${user.firstName} ${user.lastName}` 
                                                : user?.username || 'User'
                                            }
                                        </h2>
                                        <p className="text-neutral text-sm mb-4">{user?.email || 'user@example.com'}</p>
                                        
                                        {!isEditing && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => setIsEditing(true)}
                                                className="w-full"
                                            >
                                                <FaEdit className="inline mr-2" />
                                                Edit Profile
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="lg:col-span-3">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-primary">Profile Information</h3>
                                        {isEditing && (
                                            <div className="flex space-x-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="secondary"
                                                    size="sm"
                                                    form="profile-form"
                                                    disabled={loading}
                                                    loading={loading}
                                                >
                                                    {loading ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
                                        {/* Personal Information */}
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-semibold text-primary border-b border-gray-200 pb-2">
                                                Personal Information
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Input
                                                        label={
                                                            <span>
                                                                <FaUser className="inline mr-2 text-secondary" />
                                                                First Name
                                                            </span>
                                                        }
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        placeholder="Enter your first name"
                                                    />
                                                </div>

                                                <div>
                                                    <Input
                                                        label={
                                                            <span>
                                                                <FaUser className="inline mr-2 text-secondary" />
                                                                Last Name
                                                            </span>
                                                        }
                                                        type="text"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        placeholder="Enter your last name"
                                                    />
                                                </div>

                                                <div>
                                                    <Input
                                                        label={
                                                            <span>
                                                                <FaUser className="inline mr-2 text-secondary" />
                                                                Username
                                                            </span>
                                                        }
                                                        type="text"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                    />
                                                </div>

                                                <div>
                                                    <Input
                                                        label={
                                                            <span>
                                                                <FaEnvelope className="inline mr-2 text-secondary" />
                                                                Email Address
                                                            </span>
                                                        }
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                    />
                                                </div>

                                                <div>
                                                    <Input
                                                        label={
                                                            <span>
                                                                <FaPhone className="inline mr-2 text-secondary" />
                                                                Phone Number
                                                            </span>
                                                        }
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        placeholder="+1 (555) 123-4567"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address Information */}
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-semibold text-primary border-b border-gray-200 pb-2">
                                                <FaMapMarkerAlt className="inline mr-2 text-secondary" />
                                                Address Information
                                            </h4>
                                            
                                            <div className="space-y-4">
                                                {/* Street Address */}
                                                <div>
                                                    <Input
                                                        label={
                                                            <span>
                                                                <FaHome className="inline mr-2 text-secondary" />
                                                                Street Address
                                                            </span>
                                                        }
                                                        type="text"
                                                        name="address.streetAddress"
                                                        value={formData.address.streetAddress}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        placeholder="123 Main Street"
                                                    />
                                                </div>

                                                {/* Apartment/Suite */}
                                                <div>
                                                    <Input
                                                        label={
                                                            <span>
                                                                <FaBuilding className="inline mr-2 text-secondary" />
                                                                Apartment, suite, etc. (optional)
                                                            </span>
                                                        }
                                                        type="text"
                                                        name="address.apartment"
                                                        value={formData.address.apartment}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        placeholder="Apt 4B"
                                                    />
                                                </div>

                                                {/* City, State, Country Row */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <Input
                                                            label="City"
                                                            type="text"
                                                            name="address.city"
                                                            value={formData.address.city}
                                                            onChange={handleChange}
                                                            disabled={!isEditing}
                                                            placeholder="New York"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Input
                                                            label="State/Province"
                                                            type="text"
                                                            name="address.state"
                                                            value={formData.address.state}
                                                            onChange={handleChange}
                                                            disabled={!isEditing}
                                                            placeholder="NY"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Input
                                                            label={
                                                                <span>
                                                                    <FaGlobe className="inline mr-2 text-secondary" />
                                                                    Country
                                                                </span>
                                                            }
                                                            type="text"
                                                            name="address.country"
                                                            value={formData.address.country}
                                                            onChange={handleChange}
                                                            disabled={!isEditing}
                                                            placeholder="United States"
                                                        />
                                                    </div>
                                                </div>

                                                {/* ZIP/Postal Code */}
                                                <div>
                                                    <Input
                                                        label="ZIP/Postal Code"
                                                        type="text"
                                                        name="address.zipCode"
                                                        value={formData.address.zipCode}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        placeholder="10001"
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
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <OrderHistory />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;