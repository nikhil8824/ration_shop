import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Text,
  Searchbar,
  Card,
  Title,
  Paragraph,
  Chip,
  ActivityIndicator,
  FAB,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { productsAPI } from '../../services/api';
import Toast from 'react-native-toast-message';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const categoryData = [
    { id: 'grains', name: 'Grains', icon: '🌾', color: '#FFE0B2' },
    { id: 'pulses', name: 'Pulses', icon: '🫘', color: '#E8F5E8' },
    { id: 'flour', name: 'Flour', icon: '🌾', color: '#FFF3E0' },
    { id: 'oils', name: 'Oils', icon: '🫒', color: '#E3F2FD' },
    { id: 'spices', name: 'Spices', icon: '🌶️', color: '#FFEBEE' },
    { id: 'packaged_food', name: 'Packaged Food', icon: '📦', color: '#F3E5F5' },
    { id: 'cleaning_items', name: 'Cleaning', icon: '🧽', color: '#E0F2F1' },
    { id: 'personal_care', name: 'Personal Care', icon: '🧴', color: '#FFF8E1' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const categoriesResponse = await productsAPI.getCategories();
      if (categoriesResponse.data.success) {
        setCategories(categoriesResponse.data.data.categories);
      }

      // Load featured products
      const productsResponse = await productsAPI.getProducts({
        limit: 8,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (productsResponse.data.success) {
        setFeaturedProducts(productsResponse.data.data.products);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load data',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Products', { search: searchQuery.trim() });
    }
  };

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('Products', { category: categoryId });
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderCategoryItem = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryItem, { backgroundColor: category.color }]}
      onPress={() => handleCategoryPress(category.id)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  const renderProductItem = (product) => (
    <TouchableOpacity
      key={product._id}
      style={styles.productItem}
      onPress={() => handleProductPress(product)}
    >
      <Card style={styles.productCard}>
        <Card.Content style={styles.productContent}>
          <View style={styles.productImageContainer}>
            {product.image ? (
              <Image source={{ uri: product.image }} style={styles.productImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>📦</Text>
              </View>
            )}
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.productPrice}>
              ₹{product.discountedPrice || product.price}
              {product.discount > 0 && (
                <Text style={styles.originalPrice}>
                  {' '}₹{product.price}
                </Text>
              )}
            </Text>
            <Text style={styles.productUnit}>
              per {product.unit}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome to Ration Shop!</Text>
          <Text style={styles.subtitle}>Find everything you need for your home</Text>
        </View>

        <Searchbar
          placeholder="Search products..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchBar}
        />

        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Categories</Title>
          <View style={styles.categoriesContainer}>
            {categoryData.map(renderCategoryItem)}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Featured Products</Title>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.productsScroll}
          >
            {featuredProducts.map(renderProductItem)}
          </ScrollView>
        </View>
      </ScrollView>

      <FAB
        icon="shopping-cart"
        style={styles.fab}
        onPress={() => navigation.navigate('Cart')}
      />
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
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  searchBar: {
    margin: 20,
    marginTop: 10,
    elevation: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  seeAllText: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  productsScroll: {
    paddingLeft: 20,
  },
  productItem: {
    width: 160,
    marginRight: 15,
  },
  productCard: {
    elevation: 2,
    borderRadius: 12,
  },
  productContent: {
    padding: 10,
  },
  productImageContainer: {
    height: 100,
    marginBottom: 10,
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
    fontSize: 32,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#212121',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 2,
  },
  originalPrice: {
    fontSize: 12,
    color: '#757575',
    textDecorationLine: 'line-through',
  },
  productUnit: {
    fontSize: 12,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
});

export default HomeScreen;



