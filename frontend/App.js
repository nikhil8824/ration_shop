import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { theme } from './src/utils/theme';
import LoadingScreen from './src/components/LoadingScreen';

const AppContent = () => {
  const { user, loading, checkAuthState } = useAuth();

  useEffect(() => {
    checkAuthState();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <CartProvider>
          <AppContent />
          <StatusBar style="auto" />
          <Toast />
        </CartProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
