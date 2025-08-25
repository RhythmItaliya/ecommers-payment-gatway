import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="text-9xl font-bold text-gray-300">404</div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                <p className="text-gray-600 text-lg mb-8">
                    Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered
                    the wrong URL.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/"
                        className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Go to Homepage
                    </Link>

                    <Link
                        to="/products"
                        className="inline-block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        Browse Products
                    </Link>
                </div>

                <div className="mt-8 text-sm text-gray-500">
                    <p>If you believe this is an error, please contact our support team.</p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
