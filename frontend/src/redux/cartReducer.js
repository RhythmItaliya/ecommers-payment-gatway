import { 
  ADD_TO_CART, 
  REMOVE_FROM_CART, 
  CLEAR_CART, 
  UPDATE_QUANTITY, 
  SET_CART, 
  SET_CART_LOADING 
} from './cartAction';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  loading: false,
  error: null
};

const cartReducer = (state = initialState, action) => {
  console.log('Cart reducer action:', action.type, action.payload);
  
  switch (action.type) {
    // Handle async thunk pending states
    case 'cart/addToCart/pending':
    case 'cart/removeFromCart/pending':
    case 'cart/updateCartItemQuantity/pending':
    case 'cart/clearCart/pending':
    case 'cart/fetchCart/pending':
      return {
        ...state,
        loading: true,
        error: null
      };

    // Handle async thunk fulfilled states
    case 'cart/addToCart/fulfilled':
      console.log('addToCart fulfilled:', action.payload);
      return {
        ...state,
        items: action.payload.data || [],
        totalQuantity: action.payload.totalQuantity || 0,
        totalAmount: action.payload.totalAmount || 0,
        loading: false,
        error: null
      };

    case 'cart/removeFromCart/fulfilled':
      console.log('removeFromCart fulfilled:', action.payload);
      return {
        ...state,
        items: action.payload.data || [],
        totalQuantity: action.payload.totalQuantity || 0,
        totalAmount: action.payload.totalAmount || 0,
        loading: false,
        error: null
      };

    case 'cart/updateCartItemQuantity/fulfilled':
      console.log('updateCartItemQuantity fulfilled:', action.payload);
      return {
        ...state,
        items: action.payload.data || [],
        totalQuantity: action.payload.totalQuantity || 0,
        totalAmount: action.payload.totalAmount || 0,
        loading: false,
        error: null
      };

    case 'cart/clearCart/fulfilled':
      console.log('clearCart fulfilled:', action.payload);
      return {
        ...state,
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
        loading: false,
        error: null
      };

    case 'cart/fetchCart/fulfilled':
      console.log('fetchCart fulfilled:', action.payload);
      return {
        ...state,
        items: action.payload.data || [],
        totalQuantity: action.payload.totalQuantity || 0,
        totalAmount: action.payload.totalAmount || 0,
        loading: false,
        error: null
      };

    // Handle async thunk rejected states
    case 'cart/addToCart/rejected':
    case 'cart/removeFromCart/rejected':
    case 'cart/updateCartItemQuantity/rejected':
    case 'cart/clearCart/rejected':
    case 'cart/fetchCart/rejected':
      console.log('Cart action rejected:', action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload || 'An error occurred'
      };

    // Handle regular actions
    case SET_CART:
      console.log('SET_CART:', action.payload);
      return {
        ...state,
        items: action.payload.items || action.payload || [],
        totalQuantity: action.payload.totalQuantity || (action.payload.items ? action.payload.items.length : (action.payload ? action.payload.length : 0)),
        totalAmount: action.payload.totalAmount || 0,
        error: null
      };

    case SET_CART_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    // Legacy actions for backward compatibility
    case ADD_TO_CART:
      const existingItem = state.items.find(item => item.productId === action.payload.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        const updatedItems = state.items.map(item =>
          item.productId === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          totalQuantity: state.totalQuantity + 1,
          totalAmount: state.totalAmount + action.payload.price
        };
      } else {
        // If item doesn't exist, add new item with quantity 1
        const newItem = { 
          productId: action.payload.id, 
          product: action.payload,
          quantity: 1,
          price: action.payload.price
        };
        
        return {
          ...state,
          items: [...state.items, newItem],
          totalQuantity: state.totalQuantity + 1,
          totalAmount: state.totalAmount + action.payload.price
        };
      }

    case REMOVE_FROM_CART:
      const itemToRemove = state.items.find(item => item.productId === action.payload);
      if (!itemToRemove) return state;
      
      const filteredItems = state.items.filter(item => item.productId !== action.payload);
      
      return {
        ...state,
        items: filteredItems,
        totalQuantity: state.totalQuantity - itemToRemove.quantity,
        totalAmount: state.totalAmount - (itemToRemove.price * itemToRemove.quantity)
      };

    case UPDATE_QUANTITY:
      const { productId, quantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.productId === productId);
      
      if (!itemToUpdate || quantity <= 0) return state;
      
      const updatedItems = state.items.map(item =>
        item.productId === productId
          ? { ...item, quantity: quantity }
          : item
      );
      
      const newTotalQuantity = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const newTotalAmount = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalQuantity: newTotalQuantity,
        totalAmount: newTotalAmount
      };

    case CLEAR_CART:
      return {
        ...state,
        items: [],
        totalQuantity: 0,
        totalAmount: 0
      };

    case 'CLEAR_ALL_STORES':
      return {
        ...state,
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
        loading: false,
        error: null
      };

    default:
      return state;
  }
};

export default cartReducer;
