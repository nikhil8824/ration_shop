import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  ActivityIndicator,
  Chip,
  FAB,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { productsAPI } from '../../services/api';
import Toast from 'react-native-toast-message';

const AdminProductsScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAdminProducts();
      
      if (response.data.success) {
        setProducts(response.data.data.products);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load products',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleDeleteProduct = (productId) => {
    // Implement delete functionality
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'Delete functionality will be available soon',
    });
  };

  const renderProduct = ({ item }) => (
    <Card style={styles.productCard}>
      <Card.Content>
        <View style={styles.productHeader}>
          <View style={styles.productImageContainer}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.productImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>📦</Text>
              </View>
            )}
          </View>
          
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.productCategory}>{item.category}</Text>
            <Text style={styles.productPrice}>₹{item.price}</Text>
            <Text style={styles.productStock}>
              Stock: {item.stock} {item.unit}
            </Text>
            <Chip
              mode="outlined"
              style={[
                styles.statusChip,
                { backgroundColor: item.isAvailable ? '#E8F5E8' : '#FFEBEE' }
              ]}
              textStyle={{
                color: item.isAvailable ? '#4CAF50' : '#F44336'
              }}
            >
              {item.isAvailable ? 'Available' : 'Unavailable'}
            </Chip>
          </View>
        </View>

        <View style={styles.productActions}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('EditProduct', { product: item })}
            style={styles.actionButton}
            compact
          >
            Edit
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleDeleteProduct(item._id)}
            style={[styles.actionButton, styles.deleteButton]}
            compact
            textColor="#F44336"
          >
            Delete
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
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Manage Products</Title>
        <Text style={styles.headerSubtitle}>
          {products.length} product{products.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct')}
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
  productCard: {
    marginBottom: 15,
    elevation: 2,
    borderRadius: 12,
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 8,
    overflow: 'hidden',
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
    fontSize: 24,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  deleteButton: {
    borderColor: '#F44336',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
});

export default AdminProductsScreen;



