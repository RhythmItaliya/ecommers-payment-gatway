import React from "react";

const Input = ({ 
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  required = false,
  icon,
  iconRight,
  className = "",
  ...props 
}) => {
  const baseClasses = "w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  let inputClasses = baseClasses;
  
  if (error) {
    inputClasses += " border-danger focus:ring-danger/50 focus:border-danger focus:border-2";
  } else if (success) {
    inputClasses += " border-success focus:ring-success/50 focus:border-success focus:border-2";
  } else {
    inputClasses += " border-gray-300 focus:ring-accent/50 focus:border-accent focus:border-2 hover:border-gray-400";
  }
  
  inputClasses += ` ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral mb-2">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${inputClasses} ${icon ? 'pl-10' : ''} ${iconRight ? 'pr-10' : ''}`}
          {...props}
        />
        
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral">
            {iconRight}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
      
      {success && (
        <p className="mt-1 text-sm text-success">{success}</p>
      )}
    </div>
  );
};

export default Input;
