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
