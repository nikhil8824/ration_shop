import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Chip,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

const OrderDetailScreen = () => {
  const route = useRoute();
  const { order } = route.params;

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Title style={styles.orderNumber}>Order #{order.orderNumber}</Title>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(order.status) }]}
            textStyle={styles.statusText}
          >
            {getStatusText(order.status)}
          </Chip>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Order Items</Title>
            {order.items.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.itemUnit}>per {item.product.unit}</Text>
                </View>
                <View style={styles.itemQuantity}>
                  <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
                  <Text style={styles.itemPrice}>₹{item.total.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Delivery Address</Title>
            <Text style={styles.addressText}>
              {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Order Summary</Title>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{order.subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                {order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee}`}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (5%)</Text>
              <Text style={styles.summaryValue}>₹{order.tax.toFixed(2)}</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{order.totalAmount.toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Order Information</Title>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Date:</Text>
              <Text style={styles.infoValue}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method:</Text>
              <Text style={styles.infoValue}>
                {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Online Payment'}
              </Text>
            </View>
            
            {order.estimatedDelivery && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estimated Delivery:</Text>
                <Text style={styles.infoValue}>
                  {new Date(order.estimatedDelivery).toLocaleDateString()}
                </Text>
              </View>
            )}
            
            {order.deliveredAt && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Delivered On:</Text>
                <Text style={styles.infoValue}>
                  {new Date(order.deliveredAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statusChip: {
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
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
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  itemUnit: {
    fontSize: 14,
    color: '#757575',
  },
  itemQuantity: {
    alignItems: 'flex-end',
  },
  quantityText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  addressText: {
    fontSize: 16,
    color: '#212121',
    lineHeight: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#757575',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#212121',
  },
});

export default OrderDetailScreen;



