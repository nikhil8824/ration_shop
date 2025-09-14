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
  Paragraph,
  Chip,
  ActivityIndicator,
  Button,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../services/api';
import Toast from 'react-native-toast-message';

const OrdersScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrders();
      
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

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetail', { order });
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

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleOrderPress(item)}>
      <Card style={styles.orderCard}>
        <Card.Content>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
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
              onPress={() => handleOrderPress(item)}
              style={styles.viewButton}
              compact
            >
              View Details
            </Button>
            {item.status === 'delivered' && (
              <Button
                mode="contained"
                style={styles.reorderButton}
                compact
              >
                Reorder
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Title style={styles.emptyTitle}>No Orders Yet</Title>
      <Paragraph style={styles.emptyText}>
        You haven't placed any orders yet. Start shopping to see your orders here.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Products')}
        style={styles.shopButton}
      >
        Start Shopping
      </Button>
    </View>
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
        <Title style={styles.headerTitle}>My Orders</Title>
        <Text style={styles.headerSubtitle}>
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {orders.length === 0 ? (
        renderEmptyOrders()
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
  orderDate: {
    fontSize: 14,
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
  viewButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 8,
  },
  reorderButton: {
    flex: 1,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#757575',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  shopButton: {
    borderRadius: 8,
  },
});

export default OrdersScreen;



