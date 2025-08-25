const Contact = require('../models/contact.model');

// Submit contact form
exports.submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Get client IP and user agent
        const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || '';
        const userAgent = req.headers['user-agent'] || '';

        // Create new contact entry
        const contact = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            ipAddress,
            userAgent
        });

        await contact.save();

        res.status(201).json({
            success: true,
            message: 'Message sent successfully! We will get back to you soon.',
            data: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                submittedAt: contact.createdAt
            }
        });

    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get all contact submissions (admin only)
exports.getAllContacts = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        
        const query = {};
        if (status && ['pending', 'read', 'replied'].includes(status)) {
            query.status = status;
        }

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');

        const total = await Contact.countDocuments(query);

        res.status(200).json({
            success: true,
            data: contacts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalContacts: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get single contact by ID (admin only)
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id).select('-__v');
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update contact status (admin only)
exports.updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['pending', 'read', 'replied'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be pending, read, or replied'
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact status updated successfully',
            data: contact
        });

    } catch (error) {
        console.error('Update contact status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contact status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Delete contact (admin only)
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully'
        });

    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};
