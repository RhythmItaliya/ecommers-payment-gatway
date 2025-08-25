require('dotenv').config();
const User = require("../models/user.model")
const bcrypt = require('bcrypt')
const jwtService = require('../services/jwt.service');

const registerUser = async (req, res) => {
    const { username, password, email, phone, address, avatar, firstName, lastName } = req.body

    try {
        // Generate a unique customer ID for Razorpay
        const customer_id = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const userData = { username, password, email, customer_id };
        
        // Add optional fields if provided
        if (firstName !== undefined) userData.firstName = firstName;
        if (lastName !== undefined) userData.lastName = lastName;
        if (phone !== undefined) userData.phone = phone;
        if (address !== undefined) userData.address = address;
        if (avatar !== undefined) userData.avatar = avatar;
        
        const user = await User.create(userData)
        return res.status(201).json({
            status: 201,
            message: "User created successfully!",
            data: user
        })
    } catch (error) {
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                status: 400,
                message: "Validation failed",
                errors: validationErrors
            });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return res.status(409).json({
                status: 409,
                message: `${field} '${value}' already exists!`,
                field: field,
                value: value
            });
        }
        
        return res.status(500).json({
            status: 500,
            message: "Error creating user!",
            error: error.message
        });
    }
}

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                status: 401,
                message: "Invalid username or password",
                error: "Authentication failed"
            });
        }
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                status: 401,
                message: "Invalid username or password",
                error: "Authentication failed"
            });
        }

        // Generate JWT token
        const token = jwtService.generateAccessToken({ 
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            customer_id: user.customer_id
        });
        const maxAgeInDays = 4;
        const maxAgeInMilliseconds = maxAgeInDays * 24 * 60 * 60 * 1000;
        let options = {
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "None",
        };

        res.cookie('jwt', token, options);

        // Login successful
        return res.status(200).json({
            status: 200,
            message: "Login successful",
            data: user,
            token: token, // Also return token in response body for frontend localStorage
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error logging in",
            error: error.message
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        // User is already verified by middleware
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            status: 200,
            message: "Profile retrieved successfully",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error retrieving profile",
            error: error.message
        });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie('jwt');
    return res.status(200).json({ message: "Logout successful" });
};

const updateUserProfile = async (req, res) => {
    try {
        const { username, firstName, lastName, email, phone, address, avatar } = req.body;
        const userId = req.user.id;

        console.log('Update profile request:', { userId, username, firstName, lastName, email, phone, address, avatar });

        // Prepare update object
        const updateData = {};
        
        if (username !== undefined) updateData.username = username;
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (avatar !== undefined) updateData.avatar = avatar;
        
        // Handle nested address object - use $set for nested updates
        if (address && typeof address === 'object') {
            if (address.streetAddress !== undefined) updateData['address.streetAddress'] = address.streetAddress;
            if (address.apartment !== undefined) updateData['address.apartment'] = address.apartment;
            if (address.city !== undefined) updateData['address.city'] = address.city;
            if (address.state !== undefined) updateData['address.state'] = address.state;
            if (address.country !== undefined) updateData['address.country'] = address.country;
            if (address.zipCode !== undefined) updateData['address.zipCode'] = address.zipCode;
        }

        console.log('Update data prepared:', updateData);
        console.log('Request body received:', req.body);

        // Find user and update - use $set for proper MongoDB updates
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }

        console.log('User updated successfully:', updatedUser);

        return res.status(200).json({
            status: 200,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                status: 400,
                message: "Validation failed",
                errors: validationErrors
            });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return res.status(409).json({
                status: 409,
                message: `${field} '${value}' already exists!`,
                field: field,
                value: value
            });
        }
        
        return res.status(500).json({
            status: 500,
            message: "Error updating profile",
            error: error.message
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                status: 400,
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                status: 400,
                message: "New password must be at least 6 characters long"
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                status: 401,
                message: "Current password is incorrect"
            });
        }

        // Check if new password is different from current
        const isNewPasswordSame = await bcrypt.compare(newPassword, user.password);
        if (isNewPasswordSame) {
            return res.status(400).json({
                status: 400,
                message: "New password must be different from current password"
            });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedNewPassword },
            { new: true, runValidators: true }
        ).select('-password');

        console.log('Password updated successfully for user:', updatedUser.username);

        return res.status(200).json({
            status: 200,
            message: "Password updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating password:', error);
        
        return res.status(500).json({
            status: 500,
            message: "Error updating password",
            error: error.message
        });
    }
};

const testUser = async (req, res) => {
    return res.send("hello world")
}

const testUserProfile = async (req, res) => {
    try {
        // Test creating a user with all fields
        const testUserData = {
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: 'testpass123',
            phone: '+1234567890',
            address: {
                streetAddress: '123 Test Street',
                apartment: 'Apt 1',
                city: 'Test City',
                state: 'TS',
                country: 'US',
                zipCode: '12345'
            },
            avatar: 'https://example.com/avatar.jpg'
        };

        // Generate a unique customer ID for Razorpay
        testUserData.customer_id = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Try to create user
        const user = await User.create(testUserData);
        
        // Clean up test data
        await User.findByIdAndDelete(user._id);

        return res.status(200).json({
            status: 200,
            message: "User profile test successful - all fields working correctly",
            testData: testUserData
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "User profile test failed",
            error: error.message
        });
    }
}

module.exports = { registerUser, loginUser, getUserProfile, logoutUser, updateUserProfile, updatePassword, testUser, testUserProfile }