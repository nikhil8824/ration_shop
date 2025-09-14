import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  IconButton,
  Divider,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

const CartScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const {
    items,
    totalItems,
    totalAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
    loading,
  } = useCart();

  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    setUpdating(true);
    try {
      updateQuantity(productId, newQuantity);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update quantity',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = (productId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(productId),
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => clearCart(),
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Login Required',
        text2: 'Please login to proceed with checkout',
      });
      return;
    }

    if (items.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Empty Cart',
        text2: 'Please add items to your cart before checkout',
      });
      return;
    }

    navigation.navigate('Checkout');
  };

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

  const renderCartItem = ({ item }) => (
    <Card style={styles.cartItem}>
      <Card.Content>
        <View style={styles.itemHeader}>
          <View style={styles.itemImageContainer}>
            {item.product.image ? (
              <Image source={{ uri: item.product.image }} style={styles.itemImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>📦</Text>
              </View>
            )}
          </View>
          
          <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.product.name}
            </Text>
            <Text style={styles.itemUnit}>
              per {item.product.unit}
            </Text>
            <Text style={styles.itemPrice}>
              ₹{item.price}
            </Text>
            {item.product.discount > 0 && (
              <Chip
                mode="outlined"
                compact
                style={styles.discountChip}
                textStyle={styles.discountText}
              >
                {item.product.discount}% OFF
              </Chip>
            )}
          </View>

          <IconButton
            icon="close"
            size={20}
            onPress={() => handleRemoveItem(item.product._id)}
            style={styles.removeButton}
          />
        </View>

        <View style={styles.quantityContainer}>
          <View style={styles.quantityControls}>
            <IconButton
              icon="minus"
              size={20}
              onPress={() => handleQuantityChange(item.product._id, item.quantity - 1)}
              disabled={updating}
              style={styles.quantityButton}
            />
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <IconButton
              icon="plus"
              size={20}
              onPress={() => handleQuantityChange(item.product._id, item.quantity + 1)}
              disabled={updating || item.quantity >= item.product.stock}
              style={styles.quantityButton}
            />
          </View>
          
          <Text style={styles.itemTotal}>
            ₹{(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Title style={styles.emptyTitle}>Your cart is empty</Title>
      <Text style={styles.emptyText}>
        Add some products to get started
      </Text>
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
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Shopping Cart</Title>
        <Text style={styles.itemCount}>{totalItems} items</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product._id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <Card style={styles.summaryCard}>
              <Card.Content>
                <Title style={styles.summaryTitle}>Order Summary</Title>
                
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

            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={handleClearCart}
                style={styles.clearButton}
                icon="delete"
              >
                Clear Cart
              </Button>
              <Button
                mode="contained"
                onPress={handleCheckout}
                style={styles.checkoutButton}
                icon="shopping"
                contentStyle={styles.checkoutButtonContent}
              >
                Proceed to Checkout
              </Button>
            </View>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  itemCount: {
    fontSize: 16,
    color: '#757575',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartItem: {
    marginBottom: 15,
    elevation: 2,
    borderRadius: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  itemDetails: {
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
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  discountChip: {
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 10,
    color: '#FF6F00',
  },
  removeButton: {
    margin: 0,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    margin: 0,
    backgroundColor: '#F5F5F5',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 15,
    minWidth: 30,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
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
  },
  shopButton: {
    borderRadius: 8,
  },
  footer: {
    paddingBottom: 20,
  },
  summaryCard: {
    elevation: 2,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 8,
  },
  checkoutButton: {
    flex: 2,
    borderRadius: 8,
  },
  checkoutButtonContent: {
    paddingVertical: 8,
  },
});

export default CartScreen;



