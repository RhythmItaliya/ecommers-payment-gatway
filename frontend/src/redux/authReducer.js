import { SET_TOKEN, LOGOUT } from './authAction';

const initialState = { token: null, isLoggedIn: false };

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TOKEN:
            return {
                ...state,
                token: action.payload,
                isLoggedIn: true,
            };
        case LOGOUT:
            return {
                ...state,
                token: null,
                isLoggedIn: false,
            };
        default:
            return state;
    }
};

export default authReducer;
