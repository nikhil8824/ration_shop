import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  ActivityIndicator,
  Chip,
  Button,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usersAPI } from '../../services/api';
import Toast from 'react-native-toast-message';

const AdminUsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers();
      
      if (response.data.success) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load users',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      const response = await usersAPI.updateUserStatus(userId, !isActive);
      
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Status Updated',
          text2: `User ${!isActive ? 'activated' : 'deactivated'} successfully`,
        });
        loadUsers(); // Reload users
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update user status',
      });
    }
  };

  const renderUser = ({ item }) => (
    <Card style={styles.userCard}>
      <Card.Content>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userPhone}>{item.phone}</Text>
          </View>
          <View style={styles.userStatus}>
            <Chip
              mode="outlined"
              style={[
                styles.statusChip,
                { backgroundColor: item.isActive ? '#E8F5E8' : '#FFEBEE' }
              ]}
              textStyle={{
                color: item.isActive ? '#4CAF50' : '#F44336'
              }}
            >
              {item.isActive ? 'Active' : 'Inactive'}
            </Chip>
            <Chip
              mode="outlined"
              style={[
                styles.roleChip,
                { backgroundColor: item.role === 'admin' ? '#E3F2FD' : '#F3E5F5' }
              ]}
              textStyle={{
                color: item.role === 'admin' ? '#2196F3' : '#9C27B0'
              }}
            >
              {item.role === 'admin' ? 'Admin' : 'Customer'}
            </Chip>
          </View>
        </View>

        <View style={styles.userAddress}>
          <Text style={styles.addressText}>
            {item.address.street}, {item.address.city}, {item.address.state} - {item.address.pincode}
          </Text>
        </View>

        <View style={styles.userActions}>
          <Button
            mode="outlined"
            onPress={() => handleToggleUserStatus(item._id, item.isActive)}
            style={[
              styles.actionButton,
              { borderColor: item.isActive ? '#F44336' : '#4CAF50' }
            ]}
            textColor={item.isActive ? '#F44336' : '#4CAF50'}
            compact
          >
            {item.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Manage Users</Title>
        <Text style={styles.headerSubtitle}>
          {users.length} user{users.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 5,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  userCard: {
    marginBottom: 15,
    elevation: 2,
    borderRadius: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  userInfo: {
    flex: 1,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#757575',
  },
  userStatus: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 5,
  },
  roleChip: {
    alignSelf: 'flex-start',
  },
  userAddress: {
    marginBottom: 15,
  },
  addressText: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    borderRadius: 8,
  },
});

export default AdminUsersScreen;



