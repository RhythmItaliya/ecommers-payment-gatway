import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    iconRight,
    className = '',
    onClick,
    type = 'button',
    ...props
}) => {
    const baseClasses =
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50',
        secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50',
        accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent/50',
        success: 'bg-success text-white hover:bg-success/90 focus:ring-success/50',
        danger: 'bg-danger text-white hover:bg-danger/90 focus:ring-danger/50',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
        ghost: 'text-primary hover:bg-primary/10 focus:ring-primary/50',
        light: 'bg-light text-neutral hover:bg-gray-200 focus:ring-neutral/50',
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg',
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <button type={type} className={classes} disabled={disabled || loading} onClick={onClick} {...props}>
            {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            )}

            {icon && !loading && <span className="mr-2">{icon}</span>}

            {children}

            {iconRight && !loading && <span className="ml-2">{iconRight}</span>}
        </button>
    );
};

export default Button;
