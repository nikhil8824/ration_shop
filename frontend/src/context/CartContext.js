import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        loading: false,
      };
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.product._id === action.payload.product._id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product._id === action.payload.product._id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        };
      } else {
        const newItems = [...state.items, action.payload];
        return {
          ...state,
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        };
      }
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.product._id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(item => item.product._id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalAmount: 0,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from storage on app start
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    saveCart();
  }, [state.items]);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        const items = JSON.parse(cartData);
        dispatch({ type: 'LOAD_CART', payload: items });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (product, quantity = 1) => {
    const cartItem = {
      product,
      quantity,
      price: product.discountedPrice || product.price,
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.product._id === productId);
  };

  const value = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemQuantity,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};



