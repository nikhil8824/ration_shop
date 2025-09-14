import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../context/AuthContext';

// Customer Screens
import HomeScreen from '../screens/customer/HomeScreen';
import ProductsScreen from '../screens/customer/ProductsScreen';
import CartScreen from '../screens/customer/CartScreen';
import OrdersScreen from '../screens/customer/OrdersScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import ProductDetailScreen from '../screens/customer/ProductDetailScreen';
import CheckoutScreen from '../screens/customer/CheckoutScreen';
import OrderDetailScreen from '../screens/customer/OrderDetailScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AddProductScreen from '../screens/admin/AddProductScreen';
import EditProductScreen from '../screens/admin/EditProductScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CustomerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Products':
              iconName = 'store';
              break;
            case 'Cart':
              iconName = 'shopping-cart';
              break;
            case 'Orders':
              iconName = 'receipt';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Products':
              iconName = 'inventory';
              break;
            case 'Orders':
              iconName = 'receipt-long';
              break;
            case 'Users':
              iconName = 'people';
              break;
            default:
              iconName = 'dashboard';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Products" component={AdminProductsScreen} />
      <Tab.Screen name="Orders" component={AdminOrdersScreen} />
      <Tab.Screen name="Users" component={AdminUsersScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      {user?.role === 'admin' ? (
        <>
          <Stack.Screen name="AdminTabs" component={AdminTabs} />
          <Stack.Screen name="AddProduct" component={AddProductScreen} />
          <Stack.Screen name="EditProduct" component={EditProductScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;



