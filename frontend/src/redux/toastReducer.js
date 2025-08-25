import { SHOW_TOAST, HIDE_TOAST, CLEAR_ALL_TOASTS } from './toastAction';

const initialState = {
    toasts: [],
    maxToasts: 5,
};

const toastReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_TOAST:
            const newToasts = [...state.toasts, action.payload];
            if (newToasts.length > state.maxToasts) {
                newToasts.shift();
            }
            return {
                ...state,
                toasts: newToasts,
            };

        case HIDE_TOAST:
            return {
                ...state,
                toasts: state.toasts.filter((toast) => toast.id !== action.payload),
            };

        case CLEAR_ALL_TOASTS:
            return {
                ...state,
                toasts: [],
            };

        case 'CLEAR_ALL_STORES':
            return {
                ...state,
                toasts: [],
            };

        default:
            return state;
    }
};

export default toastReducer;
