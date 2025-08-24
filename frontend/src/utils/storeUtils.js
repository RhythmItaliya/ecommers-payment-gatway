import { clearAllStores } from '../redux/authAction';

/**
 * Utility function to clear all Redux stores
 * This can be imported and used anywhere in the app
 */
export const clearAllReduxStores = (dispatch) => {
  dispatch(clearAllStores());
};

/**
 * Utility function to clear all local storage and Redux stores
 */
export const clearAllData = (dispatch) => {
  // Clear localStorage
  localStorage.removeItem('token');
  
  // Clear all Redux stores
  dispatch(clearAllStores());
};
