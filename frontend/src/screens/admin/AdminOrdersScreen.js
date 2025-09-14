import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Chip,
  ActivityIndicator,
  Button,
  Menu,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ordersAPI } from '../../services/api';
import Toast from 'react-native-toast-message';

const AdminOrdersScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await ordersAPI.getAdminOrders(params);
      
      if (response.data.success) {
        setOrders(response.data.data.orders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load orders',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await ordersAPI.updateOrderStatus(orderId, newStatus);
      
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Status Updated',
          text2: `Order status updated to ${newStatus}`,
        });
        loadOrders(); // Reload orders
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update order status',
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'confirmed':
        return '#2196F3';
      case 'packed':
        return '#9C27B0';
      case 'shipped':
        return '#3F51B5';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'packed':
        return 'Packed';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const renderOrder = ({ item }) => (
    <Card style={styles.orderCard}>
      <Card.Content>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
            <Text style={styles.customerName}>{item.user.name}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={styles.statusText}
          >
            {getStatusText(item.status)}
          </Chip>
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.itemCount}>
            {item.items.length} item{item.items.length > 1 ? 's' : ''}
          </Text>
          <Text style={styles.totalAmount}>₹{item.totalAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.orderItems}>
          {item.items.slice(0, 2).map((orderItem, index) => (
            <Text key={index} style={styles.orderItemText}>
              {orderItem.product.name} x{orderItem.quantity}
            </Text>
          ))}
          {item.items.length > 2 && (
            <Text style={styles.moreItemsText}>
              +{item.items.length - 2} more items
            </Text>
          )}
        </View>

        <View style={styles.orderActions}>
          <Button
            mode="outlined"
            onPress={() => {
              // Navigate to order detail
              Toast.show({
                type: 'info',
                text1: 'Coming Soon',
                text2: 'Order detail view will be available soon',
              });
            }}
            style={styles.actionButton}
            compact
          >
            View Details
          </Button>
          
          {item.status !== 'delivered' && item.status !== 'cancelled' && (
            <Menu
              anchor={
                <Button
                  mode="contained"
                  style={styles.actionButton}
                  compact
                >
                  Update Status
                </Button>
              }
              onDismiss={() => {}}
            >
              <Menu.Item
                onPress={() => handleStatusUpdate(item._id, 'confirmed')}
                title="Confirm"
              />
              <Menu.Item
                onPress={() => handleStatusUpdate(item._id, 'packed')}
                title="Packed"
              />
              <Menu.Item
                onPress={() => handleStatusUpdate(item._id, 'shipped')}
                title="Shipped"
              />
              <Menu.Item
                onPress={() => handleStatusUpdate(item._id, 'delivered')}
                title="Delivered"
              />
              <Menu.Item
                onPress={() => handleStatusUpdate(item._id, 'cancelled')}
                title="Cancel"
              />
            </Menu>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Manage Orders</Title>
        <Text style={styles.headerSubtitle}>
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <Button
          mode={statusFilter === 'all' ? 'contained' : 'outlined'}
          onPress={() => setStatusFilter('all')}
          style={styles.filterButton}
          compact
        >
          All
        </Button>
        <Button
          mode={statusFilter === 'pending' ? 'contained' : 'outlined'}
          onPress={() => setStatusFilter('pending')}
          style={styles.filterButton}
          compact
        >
          Pending
        </Button>
        <Button
          mode={statusFilter === 'delivered' ? 'contained' : 'outlined'}
          onPress={() => setStatusFilter('delivered')}
          style={styles.filterButton}
          compact
        >
          Delivered
        </Button>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrder}
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
  filterContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    marginRight: 10,
    borderRadius: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  orderCard: {
    marginBottom: 15,
    elevation: 2,
    borderRadius: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  customerName: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  statusChip: {
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemCount: {
    fontSize: 14,
    color: '#757575',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  orderItems: {
    marginBottom: 15,
  },
  orderItemText: {
    fontSize: 14,
    color: '#212121',
    marginBottom: 2,
  },
  moreItemsText: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
  },
});

export default AdminOrdersScreen;



