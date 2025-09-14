import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  List,
  Divider,
  ActivityIndicator,
  Avatar,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

const ProfileScreen = () => {
  const { user, logout, loading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            Toast.show({
              type: 'success',
              text1: 'Logged Out',
              text2: 'You have been logged out successfully',
            });
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'Edit profile feature will be available soon',
    });
  };

  const handleChangePassword = () => {
    // Navigate to change password screen
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'Change password feature will be available soon',
    });
  };

  const handleViewOrders = () => {
    // Navigate to orders screen
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'Orders feature will be available soon',
    });
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'For any queries or support, please contact us at:\n\nEmail: support@rationshop.com\nPhone: +91 9876543210',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Ration Shop',
      'Ration Shop v1.0.0\n\nYour one-stop shop for daily essentials.\n\nBuilt with React Native and Node.js',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={user?.name?.charAt(0)?.toUpperCase() || 'U'}
            style={styles.avatar}
          />
          <Title style={styles.userName}>{user?.name}</Title>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userRole}>
            {user?.role === 'admin' ? 'Administrator' : 'Customer'}
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Account Information</Title>
            
            <List.Item
              title="Name"
              description={user?.name}
              left={(props) => <List.Icon {...props} icon="account" />}
              right={(props) => <IconButton {...props} icon="pencil" size={20} />}
              onPress={handleEditProfile}
            />
            
            <Divider />
            
            <List.Item
              title="Email"
              description={user?.email}
              left={(props) => <List.Icon {...props} icon="email" />}
            />
            
            <Divider />
            
            <List.Item
              title="Phone"
              description={user?.phone}
              left={(props) => <List.Icon {...props} icon="phone" />}
            />
            
            <Divider />
            
            <List.Item
              title="Address"
              description={`${user?.address?.street}, ${user?.address?.city}, ${user?.address?.state} - ${user?.address?.pincode}`}
              left={(props) => <List.Icon {...props} icon="map-marker" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>My Account</Title>
            
            <List.Item
              title="My Orders"
              description="View order history and track orders"
              left={(props) => <List.Icon {...props} icon="receipt" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleViewOrders}
            />
            
            <Divider />
            
            <List.Item
              title="Change Password"
              description="Update your password"
              left={(props) => <List.Icon {...props} icon="lock" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleChangePassword}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Support & Info</Title>
            
            <List.Item
              title="Contact Support"
              description="Get help and support"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleContactSupport}
            />
            
            <Divider />
            
            <List.Item
              title="About"
              description="App version and information"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleAbout}
            />
          </Card.Content>
        </Card>

        <View style={styles.logoutContainer}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            icon="logout"
            textColor="#F44336"
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#2E7D32',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  card: {
    margin: 20,
    marginTop: 0,
    elevation: 2,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  logoutContainer: {
    padding: 20,
    paddingTop: 10,
  },
  logoutButton: {
    borderColor: '#F44336',
    borderRadius: 8,
  },
});

export default ProfileScreen;



