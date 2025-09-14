import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const ProductDetailScreen = () => {
  const route = useRoute();
  const { product } = route.params;
  const { addToCart, getItemQuantity, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (product.stock < quantity) {
      Toast.show({
        type: 'error',
        text1: 'Insufficient Stock',
        text2: `Only ${product.stock} items available`,
      });
      return;
    }

    setLoading(true);
    try {
      addToCart(product, quantity);
      Toast.show({
        type: 'success',
        text1: 'Added to Cart',
        text2: `${product.name} added to your cart`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add item to cart',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.productImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>📦</Text>
            </View>
          )}
          {product.discount > 0 && (
            <Chip
              style={styles.discountChip}
              textStyle={styles.discountText}
            >
              {product.discount}% OFF
            </Chip>
          )}
        </View>

        <Card style={styles.detailsCard}>
          <Card.Content>
            <Title style={styles.productName}>{product.name}</Title>
            
            {product.description && (
              <Paragraph style={styles.description}>
                {product.description}
              </Paragraph>
            )}

            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{product.discountedPrice || product.price}</Text>
              {product.discount > 0 && (
                <Text style={styles.originalPrice}>₹{product.price}</Text>
              )}
              <Text style={styles.unit}>per {product.unit}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category:</Text>
              <Text style={styles.infoValue}>{product.category}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Stock:</Text>
              <Text style={[
                styles.infoValue,
                { color: product.stock > 0 ? '#4CAF50' : '#F44336' }
              ]}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </Text>
            </View>

            {product.tags && product.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                <Text style={styles.tagsLabel}>Tags:</Text>
                <View style={styles.tags}>
                  {product.tags.map((tag, index) => (
                    <Chip key={index} style={styles.tag} compact>
                      {tag}
                    </Chip>
                  ))}
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.quantityCard}>
          <Card.Content>
            <Title style={styles.quantityTitle}>Quantity</Title>
            <View style={styles.quantityContainer}>
              <Button
                mode="outlined"
                onPress={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                style={styles.quantityButton}
                icon="minus"
              >
                -
              </Button>
              <Text style={styles.quantityText}>{quantity}</Text>
              <Button
                mode="outlined"
                onPress={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
                style={styles.quantityButton}
                icon="plus"
              >
                +
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>
            ₹{((product.discountedPrice || product.price) * quantity).toFixed(2)}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={handleAddToCart}
          disabled={loading || product.stock === 0}
          style={styles.addToCartButton}
          contentStyle={styles.addToCartButtonContent}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            'Add to Cart'
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
  imageContainer: {
    height: 300,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  productImage: {
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
    fontSize: 80,
  },
  discountChip: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FF6F00',
  },
  discountText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  detailsCard: {
    margin: 20,
    marginTop: 0,
    elevation: 2,
    borderRadius: 12,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#757575',
    lineHeight: 24,
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 18,
    color: '#757575',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  unit: {
    fontSize: 16,
    color: '#757575',
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
  tagsContainer: {
    marginTop: 15,
  },
  tagsLabel: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  quantityCard: {
    margin: 20,
    marginTop: 0,
    elevation: 2,
    borderRadius: 12,
  },
  quantityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    borderRadius: 20,
    width: 50,
    height: 50,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalContainer: {
    flex: 1,
    marginRight: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: '#757575',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  addToCartButton: {
    flex: 1,
    borderRadius: 8,
  },
  addToCartButtonContent: {
    paddingVertical: 8,
  },
});

export default ProductDetailScreen;



