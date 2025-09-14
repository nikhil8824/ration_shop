import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkAuthState = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        dispatch({ type: 'SET_TOKEN', payload: token });
        dispatch({ type: 'SET_USER', payload: user });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to check authentication' });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_TOKEN', payload: token });
        
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_TOKEN', payload: token });
        
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await api.put('/auth/profile', profileData);
      
      if (response.data.success) {
        const updatedUser = response.data.data.user;
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch({ type: 'SET_USER', payload: updatedUser });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



