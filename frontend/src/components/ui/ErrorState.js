import React from "react";
import Button from "./Button";

const ErrorState = ({ 
  error, 
  onRetry, 
  className = "" 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <h3 className="text-xl font-semibold text-primary mb-2">Something Went Wrong</h3>
      {error && (
        <p className="text-neutral mb-6 max-w-md mx-auto">
          {error}
        </p>
      )}
      {onRetry && (
        <Button 
          variant="danger" 
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
