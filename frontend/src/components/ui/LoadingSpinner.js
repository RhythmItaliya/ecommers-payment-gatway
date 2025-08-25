import React from 'react';

const LoadingSpinner = ({ size = 'md', variant = 'primary', text = '', className = '' }) => {
    const sizes = {
        xs: 'w-4 h-4',
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const variants = {
        primary: 'border-primary/30 border-t-primary',
        secondary: 'border-secondary/30 border-t-secondary',
        accent: 'border-accent/30 border-t-accent',
        success: 'border-success/30 border-t-success',
        danger: 'border-danger/30 border-t-danger',
        white: 'border-white/30 border-t-white',
        gray: 'border-gray-300 border-t-gray-600',
    };

    const spinnerClasses = `${sizes[size]} border-2 rounded-full animate-spin ${variants[variant]} ${className}`;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className={spinnerClasses}></div>
            {text && <p className="mt-3 text-sm text-neutral text-center">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
