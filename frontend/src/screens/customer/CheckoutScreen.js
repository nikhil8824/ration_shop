import React, { useState } from 'react';
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
  RadioButton,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../services/api';
import Toast from 'react-native-toast-message';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [loading, setLoading] = useState(false);

  const calculateDeliveryFee = () => {
    return totalAmount >= 500 ? 0 : 50;
  };

  const calculateTax = () => {
    return totalAmount * 0.05; // 5% tax
  };

  const calculateTotal = () => {
    const deliveryFee = calculateDeliveryFee();
    const tax = calculateTax();
    return totalAmount + deliveryFee + tax;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Login Required',
        text2: 'Please login to place an order',
      });
      return;
    }

    Alert.alert(
      'Confirm Order',
      `Total Amount: ₹${calculateTotal().toFixed(2)}\n\nDo you want to place this order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Order',
          onPress: async () => {
            setLoading(true);
            try {
              const orderData = {
                items: items.map(item => ({
                  product: item.product._id,
                  quantity: item.quantity,
                })),
                deliveryAddress: user.address,
                paymentMethod,
                notes: '',
              };

              const response = await ordersAPI.createOrder(orderData);
              
              if (response.data.success) {
                clearCart();
                Toast.show({
                  type: 'success',
                  text1: 'Order Placed',
                  text2: 'Your order has been placed successfully',
                });
                navigation.navigate('Orders');
              } else {
                throw new Error(response.data.message);
              }
            } catch (error) {
              console.error('Error placing order:', error);
              Toast.show({
                type: 'error',
                text1: 'Order Failed',
                text2: error.response?.data?.message || 'Failed to place order',
              });
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Checkout</Title>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Delivery Address</Title>
            <Text style={styles.addressText}>
              {user?.address?.street}, {user?.address?.city}, {user?.address?.state} - {user?.address?.pincode}
            </Text>
            <Button
              mode="text"
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Coming Soon',
                  text2: 'Address editing will be available soon',
                });
              }}
              style={styles.editButton}
            >
              Edit Address
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Payment Method</Title>
            <RadioButton.Group
              onValueChange={setPaymentMethod}
              value={paymentMethod}
            >
              <View style={styles.paymentOption}>
                <RadioButton value="cash_on_delivery" />
                <Text style={styles.paymentLabel}>Cash on Delivery</Text>
              </View>
              <View style={styles.paymentOption}>
                <RadioButton value="online" />
                <Text style={styles.paymentLabel}>Online Payment (Coming Soon)</Text>
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Order Summary</Title>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{totalAmount.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                {calculateDeliveryFee() === 0 ? 'Free' : `₹${calculateDeliveryFee()}`}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (5%)</Text>
              <Text style={styles.summaryValue}>₹{calculateTax().toFixed(2)}</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{calculateTotal().toFixed(2)}</Text>
            </View>
            
            {totalAmount < 500 && (
              <Text style={styles.freeDeliveryText}>
                Add ₹{(500 - totalAmount).toFixed(2)} more for free delivery
              </Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          mode="contained"
          onPress={handlePlaceOrder}
          disabled={loading || items.length === 0}
          style={styles.placeOrderButton}
          contentStyle={styles.placeOrderButtonContent}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            `Place Order - ₹${calculateTotal().toFixed(2)}`
          )}
        </Button>
      </View>
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
  addressText: {
    fontSize: 16,
    color: '#212121',
    lineHeight: 24,
    marginBottom: 10,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#212121',
    marginLeft: 10,
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
  freeDeliveryText: {
    fontSize: 12,
    color: '#FF6F00',
    textAlign: 'center',
    marginTop: 10,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  placeOrderButton: {
    borderRadius: 8,
  },
  placeOrderButtonContent: {
    paddingVertical: 8,
  },
});

export default CheckoutScreen;



