import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../../redux/toastAction';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaExclamationCircle } from 'react-icons/fa';

const Toast = ({ toast }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => dispatch(hideToast(toast.id)), toast.duration);
        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, dispatch]);

    const config = {
        success: {
            icon: FaCheckCircle,
            bg: 'bg-success',
            text: 'text-white',
            border: 'border-success/20',
        },
        error: {
            icon: FaExclamationCircle,
            bg: 'bg-danger',
            text: 'text-white',
            border: 'border-danger/20',
        },
        warning: {
            icon: FaExclamationTriangle,
            bg: 'bg-secondary',
            text: 'text-white',
            border: 'border-secondary/20',
        },
        info: {
            icon: FaInfoCircle,
            bg: 'bg-accent',
            text: 'text-white',
            border: 'border-accent/20',
        },
    }[toast.type] || {
        icon: FaInfoCircle,
        bg: 'bg-accent',
        text: 'text-white',
        border: 'border-accent/20',
    };

    const Icon = config.icon;

    return (
        <div
            className={`flex items-center justify-between p-4 mb-3 rounded-lg shadow-lg border ${config.bg} ${config.text} ${config.border} backdrop-blur-sm bg-opacity-95`}
        >
            <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{toast.message}</span>
            </div>
            <button
                onClick={() => dispatch(hideToast(toast.id))}
                className="hover:opacity-80 transition-opacity duration-200 p-1 rounded-full hover:bg-white/20"
            >
                <FaTimes className="w-4 h-4" />
            </button>
        </div>
    );
};

const ToastContainer = () => {
    const { toasts } = useSelector((state) => state.toast);

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
