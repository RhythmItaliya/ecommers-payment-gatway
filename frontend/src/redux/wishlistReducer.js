import { 
  ADD_TO_WISHLIST, 
  REMOVE_FROM_WISHLIST, 
  CLEAR_WISHLIST, 
  SET_WISHLIST, 
  SET_WISHLIST_LOADING 
} from './wishlistAction';

const initialState = {
  items: [],
  totalItems: 0,
  loading: false,
  error: null
};

const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    // Handle async thunk pending states
    case 'wishlist/addToWishlist/pending':
    case 'wishlist/removeFromWishlist/pending':
    case 'wishlist/clearWishlist/pending':
    case 'wishlist/fetchWishlist/pending':
    case 'wishlist/checkWishlistStatus/pending':
      return {
        ...state,
        loading: true,
        error: null
      };

    // Handle async thunk fulfilled states
    case 'wishlist/addToWishlist/fulfilled':
      return {
        ...state,
        items: action.payload.data,
        totalItems: action.payload.totalItems,
        loading: false,
        error: null
      };

    case 'wishlist/removeFromWishlist/fulfilled':
      return {
        ...state,
        items: action.payload.data,
        totalItems: action.payload.totalItems,
        loading: false,
        error: null
      };

    case 'wishlist/clearWishlist/fulfilled':
      return {
        ...state,
        items: [],
        totalItems: 0,
        loading: false,
        error: null
      };

    case 'wishlist/fetchWishlist/fulfilled':
      return {
        ...state,
        items: action.payload.data,
        totalItems: action.payload.totalItems,
        loading: false,
        error: null
      };

    case 'wishlist/checkWishlistStatus/fulfilled':
      return {
        ...state,
        loading: false,
        error: null
      };

    // Handle async thunk rejected states
    case 'wishlist/addToWishlist/rejected':
    case 'wishlist/removeFromWishlist/rejected':
    case 'wishlist/clearWishlist/rejected':
    case 'wishlist/fetchWishlist/rejected':
    case 'wishlist/checkWishlistStatus/rejected':
      return {
        ...state,
        loading: false,
        error: action.payload || 'An error occurred'
      };

    // Handle regular actions
    case SET_WISHLIST:
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.length,
        error: null
      };

    case SET_WISHLIST_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    // Legacy actions for backward compatibility
    case ADD_TO_WISHLIST:
      const existingItem = state.items.find(item => item.productId === action.payload.id);
      if (existingItem) {
        return state; // Item already exists
      }
      return {
        ...state,
        items: [...state.items, { productId: action.payload.id, product: action.payload }],
        totalItems: state.totalItems + 1
      };

    case REMOVE_FROM_WISHLIST:
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
        totalItems: state.totalItems - 1
      };

    case CLEAR_WISHLIST:
      return {
        ...state,
        items: [],
        totalItems: 0
      };

    default:
      return state;
  }
};

export default wishlistReducer;
