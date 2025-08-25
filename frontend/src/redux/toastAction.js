export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';
export const CLEAR_ALL_TOASTS = 'CLEAR_ALL_TOASTS';

export const showToast = (message, type = 'info', duration = 3000) => ({
    type: SHOW_TOAST,
    payload: {
        id: Date.now(),
        message,
        type,
        duration,
        timestamp: Date.now(),
    },
});

export const hideToast = (id) => ({
    type: HIDE_TOAST,
    payload: id,
});

export const clearAllToasts = () => ({
    type: CLEAR_ALL_TOASTS,
});

export const showSuccessToast = (message, duration = 3000) => showToast(message, 'success', duration);

export const showErrorToast = (message, duration = 4000) => showToast(message, 'error', duration);

export const showWarningToast = (message, duration = 3500) => showToast(message, 'warning', duration);

export const showInfoToast = (message, duration = 3000) => showToast(message, 'info', duration);
