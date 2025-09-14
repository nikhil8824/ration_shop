import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  Text,
  Searchbar,
  Card,
  Title,
  Chip,
  ActivityIndicator,
  Menu,
  Button,
  TextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { productsAPI } from '../../services/api';
import Toast from 'react-native-toast-message';

const ProductsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    loadCategories();
    loadProducts(true);
    
    // Handle initial search/category from navigation params
    if (route.params?.search) {
      setSearchQuery(route.params.search);
    }
    if (route.params?.category) {
      setFilters(prev => ({ ...prev, category: route.params.category }));
    }
  }, []);

  useEffect(() => {
    if (searchQuery !== '') {
      const delayedSearch = setTimeout(() => {
        loadProducts(true);
      }, 500);
      return () => clearTimeout(delayedSearch);
    }
  }, [searchQuery]);

  const loadCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      if (response.data.success) {
        setCategories(response.data.data.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const params = {
        page: reset ? 1 : page,
        limit: 20,
        search: searchQuery || undefined,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await productsAPI.getProducts(params);
      
      if (response.data.success) {
        const { products: newProducts, pagination } = response.data.data;
        
        if (reset) {
          setProducts(newProducts);
        } else {
          setProducts(prev => [...prev, ...newProducts]);
        }
        
        setHasMore(pagination.hasNext);
        if (!reset) {
          setPage(prev => prev + 1);
        }
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
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts(true);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadProducts(false);
    }
  };

  const handleSearch = () => {
    loadProducts(true);
  };

  const handleCategoryFilter = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === categoryId ? '' : categoryId,
    }));
    loadProducts(true);
  };

  const handleSort = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
    loadProducts(true);
  };

  const applyPriceFilter = () => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    }));
    setShowFilters(false);
    loadProducts(true);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    loadProducts(true);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleProductPress(item)}
    >
      <Card style={styles.productCard}>
        <View style={styles.productImageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.productImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>📦</Text>
            </View>
          )}
          {item.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
          )}
        </View>
        <Card.Content style={styles.productContent}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productCategory}>
            {categories.find(c => c.value === item.category)?.label || item.category}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              ₹{item.discountedPrice || item.price}
            </Text>
            {item.discount > 0 && (
              <Text style={styles.originalPrice}>
                ₹{item.price}
              </Text>
            )}
          </View>
          <Text style={styles.productUnit}>
            per {item.unit}
          </Text>
          <Text style={styles.stockText}>
            {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Searchbar
        placeholder="Search products..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchBar}
      />
      
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          <Chip
            selected={filters.category === ''}
            onPress={() => handleCategoryFilter('')}
            style={styles.categoryChip}
          >
            All
          </Chip>
          {categories.map(category => (
            <Chip
              key={category.value}
              selected={filters.category === category.value}
              onPress={() => handleCategoryFilter(category.value)}
              style={styles.categoryChip}
            >
              {category.label}
            </Chip>
          ))}
        </ScrollView>
        
        <View style={styles.filterButtons}>
          <Button
            mode="outlined"
            onPress={() => setShowFilters(true)}
            style={styles.filterButton}
            icon="filter"
          >
            Filter
          </Button>
          <Button
            mode="outlined"
            onPress={clearFilters}
            style={styles.filterButton}
            icon="close"
          >
            Clear
          </Button>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#2E7D32" />
      </View>
    );
  };

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
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Menu
        visible={showFilters}
        onDismiss={() => setShowFilters(false)}
        anchor={<View />}
        style={styles.filterMenu}
      >
        <View style={styles.filterContent}>
          <Title>Price Range</Title>
          <View style={styles.priceInputs}>
            <TextInput
              label="Min Price"
              value={priceRange.min}
              onChangeText={(text) => setPriceRange(prev => ({ ...prev, min: text }))}
              keyboardType="numeric"
              mode="outlined"
              style={styles.priceInput}
            />
            <TextInput
              label="Max Price"
              value={priceRange.max}
              onChangeText={(text) => setPriceRange(prev => ({ ...prev, max: text }))}
              keyboardType="numeric"
              mode="outlined"
              style={styles.priceInput}
            />
          </View>
          <View style={styles.filterActions}>
            <Button mode="outlined" onPress={() => setShowFilters(false)}>
              Cancel
            </Button>
            <Button mode="contained" onPress={applyPriceFilter}>
              Apply
            </Button>
          </View>
        </View>
      </Menu>
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
  listContainer: {
    padding: 10,
  },
  header: {
    marginBottom: 10,
  },
  searchBar: {
    marginBottom: 15,
    elevation: 2,
  },
  filterContainer: {
    marginBottom: 10,
  },
  categoriesScroll: {
    marginBottom: 10,
  },
  categoryChip: {
    marginRight: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  productItem: {
    flex: 1,
    margin: 5,
  },
  productCard: {
    elevation: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImageContainer: {
    height: 120,
    position: 'relative',
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
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6F00',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productContent: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#212121',
  },
  productCategory: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#757575',
    textDecorationLine: 'line-through',
  },
  productUnit: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  stockText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '500',
  },
  footerLoader: {
    padding: 20,
    alignItems: 'center',
  },
  filterMenu: {
    marginTop: 50,
  },
  filterContent: {
    padding: 20,
    minWidth: 300,
  },
  priceInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  priceInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default ProductsScreen;
