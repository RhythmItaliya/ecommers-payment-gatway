import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="relative">
                <div className="rounded-full h-20 w-20 bg-custom-gray animate-ping"></div>
                <div className="absolute inset-0 flex justify-center items-center">
                    <div className="rounded-full h-12 w-12 bg-gray-800 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
