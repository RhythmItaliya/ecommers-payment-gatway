import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaEdit,
    FaSignOutAlt,
    FaGlobe,
    FaBuilding,
    FaHome,
    FaShoppingBag,
    FaLock,
} from 'react-icons/fa';
import { logoutUser, updateUserProfile, updatePassword } from '../../redux/authAction';
import { showSuccessToast, showErrorToast } from '../../redux/toastAction';
import OrderHistory from './OrderHistory';
import { clearAllData } from '../../utils/storeUtils';
import { Input, Button } from '../ui';

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoggedIn, loading } = useSelector((state) => state.auth);

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
            zipCode: '',
        },
        avatar: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
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
                    zipCode: user.address?.zipCode || '',
                },
                avatar: user.avatar || '',
            });
        }
    }, [user, isLoggedIn, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username.trim()) {
            dispatch(showErrorToast('Username is required'));
            return;
        }

        if (!formData.email.trim()) {
            dispatch(showErrorToast('Email is required'));
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            dispatch(showErrorToast('Please enter a valid email address'));
            return;
        }

        try {
            const updateData = {
                username: formData.username.trim(),
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                address: formData.address,
            };

            console.log('Sending update data:', updateData);
            const result = await dispatch(updateUserProfile(updateData));

            if (updateUserProfile.fulfilled.match(result)) {
                setIsEditing(false);
                dispatch(showSuccessToast('Profile updated successfully!'));
            } else if (updateUserProfile.rejected.match(result)) {
                let errorMessage = 'Failed to update profile';

                if (result.payload) {
                    if (result.payload.errors && Array.isArray(result.payload.errors)) {
                        errorMessage = result.payload.errors.join(', ');
                    } else if (result.payload.message) {
                        errorMessage = result.payload.message;
                    }
                }

                dispatch(showErrorToast(errorMessage));
            }
        } catch (error) {
            dispatch(showErrorToast('An error occurred while updating your profile'));
        }
    };

    const handleLogout = async () => {
        if (!window.confirm('Are you sure you want to logout?')) {
            return;
        }

        try {
            const result = await dispatch(logoutUser());

            if (logoutUser.fulfilled.match(result)) {
                clearAllData(dispatch);
                dispatch(showSuccessToast('Logged out successfully!'));
            }

            navigate('/');
        } catch (error) {
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
                    country: user.address?.country || '',
                    zipCode: user.address?.zipCode || '',
                },
                avatar: user.avatar || '',
            });
        }
        setIsEditing(false);
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Password validation
        if (!passwordData.currentPassword.trim()) {
            dispatch(showErrorToast('Current password is required'));
            return;
        }

        if (!passwordData.newPassword.trim()) {
            dispatch(showErrorToast('New password is required'));
            return;
        }

        if (passwordData.newPassword.length < 6) {
            dispatch(showErrorToast('New password must be at least 6 characters long'));
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            dispatch(showErrorToast('New passwords do not match'));
            return;
        }

        if (passwordData.currentPassword === passwordData.newPassword) {
            dispatch(showErrorToast('New password must be different from current password'));
            return;
        }

        try {
            const result = await dispatch(
                updatePassword({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                })
            );

            if (updatePassword.fulfilled.match(result)) {
                dispatch(showSuccessToast('Password updated successfully!'));
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else if (updatePassword.rejected.match(result)) {
                let errorMessage = 'Failed to update password. Please try again.';

                if (result.payload) {
                    if (result.payload.errors && Array.isArray(result.payload.errors)) {
                        errorMessage = result.payload.errors.join(', ');
                    } else if (result.payload.message) {
                        errorMessage = result.payload.message;
                    }
                }

                dispatch(showErrorToast(errorMessage));
            }
        } catch (error) {
            dispatch(showErrorToast('An error occurred while updating password'));
        }
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-primary">My Profile</h1>
                                <p className="text-neutral text-sm mt-1">
                                    Manage your account settings and preferences
                                </p>
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
                            <Button
                                variant={activeTab === 'password' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('password')}
                                className="flex items-center space-x-2"
                            >
                                <FaLock className="h-4 w-4" />
                                <span>Change Password</span>
                            </Button>
                        </div>
                    </div>

                    {activeTab === 'profile' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                                            {user?.firstName?.charAt(0)?.toUpperCase() ||
                                                user?.username?.charAt(0)?.toUpperCase() ||
                                                'U'}
                                        </div>
                                        <h2 className="text-xl font-bold text-primary mb-2">
                                            {user?.firstName && user?.lastName
                                                ? `${user.firstName} ${user.lastName}`
                                                : user?.username || 'User'}
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

                            <div className="lg:col-span-3">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-primary">Profile Information</h3>
                                        {isEditing && (
                                            <div className="flex space-x-3">
                                                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
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

                                        <div className="space-y-4">
                                            <h4 className="text-lg font-semibold text-primary border-b border-gray-200 pb-2">
                                                <FaMapMarkerAlt className="inline mr-2 text-secondary" />
                                                Address Information
                                            </h4>

                                            <div className="space-y-4">
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
                    ) : activeTab === 'password' ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-primary">Change Password</h3>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                                <div>
                                    <Input
                                        label="Current Password"
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        placeholder="Enter your current password"
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="New Password"
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        placeholder="Enter your new password"
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        placeholder="Confirm your new password"
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        size="lg"
                                        disabled={loading}
                                        loading={loading}
                                        className="flex-1"
                                    >
                                        {loading ? 'Updating Password...' : 'Update Password'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
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
