import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../redux/toastAction';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaExclamationCircle } from 'react-icons/fa';

const Toast = ({ toast }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Auto-hide toast after duration
        const timer = setTimeout(() => {
            dispatch(hideToast(toast.id));
        }, toast.duration);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, dispatch]);

    const handleClose = () => {
        dispatch(hideToast(toast.id));
    };

    // Toast type configurations
    const toastConfig = {
        success: {
            icon: FaCheckCircle,
            bgColor: 'bg-green-500',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
            iconColor: 'text-green-600'
        },
        error: {
            icon: FaExclamationCircle,
            bgColor: 'bg-red-500',
            textColor: 'text-red-800',
            borderColor: 'border-red-200',
            iconColor: 'text-red-600'
        },
        warning: {
            icon: FaExclamationTriangle,
            bgColor: 'bg-yellow-500',
            textColor: 'text-yellow-800',
            borderColor: 'border-yellow-200',
            iconColor: 'text-yellow-600'
        },
        info: {
            icon: FaInfoCircle,
            bgColor: 'bg-blue-500',
            textColor: 'text-blue-800',
            borderColor: 'border-blue-200',
            iconColor: 'text-blue-600'
        }
    };

    const config = toastConfig[toast.type] || toastConfig.info;
    const IconComponent = config.icon;

    return (
        <div className={`
            flex items-center justify-between p-4 mb-3 rounded-lg shadow-lg border-l-4
            ${config.bgColor} ${config.textColor} ${config.borderColor}
            transform transition-all duration-300 ease-in-out
            animate-slideInRight
        `}>
            <div className="flex items-center space-x-3">
                <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
                <span className="font-medium">{toast.message}</span>
            </div>
            <button
                onClick={handleClose}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
                <FaTimes className="w-4 h-4" />
            </button>
        </div>
    );
};

const ToastContainer = () => {
    const { toasts } = useSelector(state => state.toast);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} />
            ))}
        </div>
    );
};

export default ToastContainer;
