import { clearAllStores } from '../redux/authAction';

export const clearAllReduxStores = (dispatch) => {
    dispatch(clearAllStores());
};

export const clearAllData = (dispatch) => {
    localStorage.removeItem('token');
    dispatch(clearAllStores());
};
