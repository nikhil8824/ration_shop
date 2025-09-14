import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  ActivityIndicator,
  HelperText,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { productsAPI } from '../../services/api';
import Toast from 'react-native-toast-message';

const AddProductScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'grains',
    unit: 'kg',
    discount: '',
    tags: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'grains', label: 'Grains' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'flour', label: 'Flour' },
    { value: 'oils', label: 'Oils' },
    { value: 'spices', label: 'Spices' },
    { value: 'packaged_food', label: 'Packaged Food' },
    { value: 'cleaning_items', label: 'Cleaning Items' },
    { value: 'personal_care', label: 'Personal Care' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'others', label: 'Others' },
  ];

  const units = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'l', label: 'Liter (l)' },
    { value: 'ml', label: 'Milliliter (ml)' },
    { value: 'piece', label: 'Piece' },
    { value: 'packet', label: 'Packet' },
    { value: 'bottle', label: 'Bottle' },
    { value: 'box', label: 'Box' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Please enter a valid stock quantity';
    }

    if (formData.discount && (isNaN(parseFloat(formData.discount)) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
      newErrors.discount = 'Discount must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix the errors below',
      });
      return;
    }

    setLoading(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      };

      const response = await productsAPI.createProduct(productData);
      
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Product created successfully',
        });
        navigation.goBack();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to create product',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Add New Product</Title>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Product Name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              mode="outlined"
              style={styles.input}
              error={!!errors.name}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <View style={styles.row}>
              <TextInput
                label="Price (₹)"
                value={formData.price}
                onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfInput]}
                error={!!errors.price}
              />
              <TextInput
                label="Stock Quantity"
                value={formData.stock}
                onChangeText={(text) => setFormData(prev => ({ ...prev, stock: text }))}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfInput]}
                error={!!errors.stock}
              />
            </View>
            <View style={styles.row}>
              <HelperText type="error" visible={!!errors.price} style={styles.halfHelper}>
                {errors.price}
              </HelperText>
              <HelperText type="error" visible={!!errors.stock} style={styles.halfHelper}>
                {errors.stock}
              </HelperText>
            </View>

            <View style={styles.row}>
              <TextInput
                label="Category"
                value={categories.find(c => c.value === formData.category)?.label || ''}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                editable={false}
                right={<TextInput.Icon icon="chevron-down" />}
              />
              <TextInput
                label="Unit"
                value={units.find(u => u.value === formData.unit)?.label || ''}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                editable={false}
                right={<TextInput.Icon icon="chevron-down" />}
              />
            </View>

            <TextInput
              label="Discount (%)"
              value={formData.discount}
              onChangeText={(text) => setFormData(prev => ({ ...prev, discount: text }))}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              error={!!errors.discount}
            />
            <HelperText type="error" visible={!!errors.discount}>
              {errors.discount}
            </HelperText>

            <TextInput
              label="Tags (comma separated)"
              value={formData.tags}
              onChangeText={(text) => setFormData(prev => ({ ...prev, tags: text }))}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., organic, premium, bestseller"
            />
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : 'Create Product'}
          </Button>
        </View>
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
    elevation: 2,
    borderRadius: 12,
  },
  input: {
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  halfHelper: {
    flex: 1,
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 8,
  },
  submitButton: {
    flex: 1,
    borderRadius: 8,
  },
});

export default AddProductScreen;



