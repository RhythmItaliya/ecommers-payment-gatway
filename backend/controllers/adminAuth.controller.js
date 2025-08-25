const Admin = require('../models/admin.model');
const config = require('../config/config');

const createDefaultAdmin = async () => {
    try {
        const adminCount = await Admin.countDocuments();
        
        if (adminCount === 0) {
            const defaultAdmin = new Admin({
                username: config.admin.username,
                email: config.admin.email,
                password: config.admin.password,
                role: config.admin.role,
                permissions: config.admin.permissions
            });

            await defaultAdmin.save();
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
        return false;
    }
};

module.exports = {
    createDefaultAdmin
};
