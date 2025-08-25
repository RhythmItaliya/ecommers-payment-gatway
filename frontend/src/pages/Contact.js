import React, { useState } from 'react';
import axios from 'axios';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { BsEnvelope, BsPerson, BsChatText } from 'react-icons/bs';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact/submit`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                setSuccess(true);
                setFormData({ name: '', email: '', message: '' });
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
                    <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BsEnvelope className="w-6 h-6 text-success" />
                    </div>
                    <h2 className="text-xl font-semibold text-neutral mb-2">Message Sent!</h2>
                    <p className="text-gray-600 mb-4">Thank you for contacting us.</p>
                    <Button onClick={() => setSuccess(false)} variant="primary" size="sm">
                        Send Another
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-neutral mb-2">Contact Us</h1>
                    <p className="text-gray-600">Send us a message and we'll get back to you.</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            icon={<BsPerson />}
                            required
                        />

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your email"
                            icon={<BsEnvelope />}
                            required
                        />

                        <div className="w-full">
                            <label className="block text-sm font-medium text-neutral mb-2">
                                Message <span className="text-danger ml-1">*</span>
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Your message..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/50 focus:border-accent focus:border-2 hover:border-gray-400 resize-none"
                                rows="4"
                                required
                            />
                        </div>

                        <Button type="submit" variant="primary" loading={loading} className="w-full">
                            {loading ? 'Sending...' : 'Send Message'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
