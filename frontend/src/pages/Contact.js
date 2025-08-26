import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { BsEnvelope, BsPerson } from 'react-icons/bs';
import { showSuccessToast, showErrorToast } from '../redux/toastAction';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form validation
        if (!formData.name.trim()) {
            dispatch(showErrorToast('Name is required'));
            return;
        }

        if (!formData.email.trim()) {
            dispatch(showErrorToast('Email is required'));
            return;
        }

        if (!formData.message.trim()) {
            dispatch(showErrorToast('Message is required'));
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact/submit`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                dispatch(showSuccessToast(response.data.message || 'Message sent successfully!'));
                setSuccess(true);
                setFormData({ name: '', email: '', message: '' });
            } else {
                throw new Error(response.data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage =
                error.response?.data?.message || error.message || 'Failed to send message. Please try again.';
            dispatch(showErrorToast(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        setSuccess(false);
        setFormData({ name: '', email: '', message: '' });
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-20">
                    <div className="order-2 lg:order-1" data-aos="fade-right" data-aos-delay="200">
                        <div className="relative">
                            <img
                                src={require('../img/contact.jpg')}
                                alt="Contact Us"
                                className="w-full h-auto rounded-3xl shadow-xl object-cover"
                                style={{ minHeight: '500px' }}
                            />
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="order-1 lg:order-2" data-aos="fade-left" data-aos-delay="400">
                        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
                            <div className="mb-8">
                                <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-3">Send us a Message</h3>
                                <p className="text-neutral">
                                    Fill out the form below and we'll get back to you within 24 hours.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        icon={<BsPerson />}
                                        required
                                    />

                                    <Input
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        icon={<BsEnvelope />}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-primary mb-3">
                                        Message <span className="text-danger ml-1">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us how we can help you..."
                                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary hover:border-gray-300 resize-none text-base"
                                        rows="5"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="xl"
                                    loading={loading}
                                    className="w-full py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    {loading ? 'Sending Message...' : 'Send Message'}
                                </Button>

                                <p className="text-sm text-neutral text-center">
                                    By submitting this form, you agree to our{' '}
                                    <a href="/privacy" className="text-primary hover:underline font-medium">
                                        Privacy Policy
                                    </a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
