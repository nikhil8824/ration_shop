import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  HelperText,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.address.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.address.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.address.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(formData.address.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix the errors below',
      });
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully!',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: result.message || 'Failed to create account',
      });
    }
  };

  const updateFormData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.logo}>🛒</Text>
            <Title style={styles.title}>Create Account</Title>
            <Paragraph style={styles.subtitle}>
              Join us for the best shopping experience
            </Paragraph>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Personal Information</Title>

              <TextInput
                label="Full Name"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
                error={!!errors.name}
              />
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>

              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
                error={!!errors.email}
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>

              <TextInput
                label="Phone Number"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                left={<TextInput.Icon icon="phone" />}
                error={!!errors.phone}
              />
              <HelperText type="error" visible={!!errors.phone}>
                {errors.phone}
              </HelperText>

              <TextInput
                label="Password"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                error={!!errors.password}
              />
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>

              <TextInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                error={!!errors.confirmPassword}
              />
              <HelperText type="error" visible={!!errors.confirmPassword}>
                {errors.confirmPassword}
              </HelperText>

              <Title style={styles.sectionTitle}>Address Information</Title>

              <TextInput
                label="Street Address"
                value={formData.address.street}
                onChangeText={(value) => updateFormData('address.street', value)}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="home" />}
                error={!!errors.street}
              />
              <HelperText type="error" visible={!!errors.street}>
                {errors.street}
              </HelperText>

              <View style={styles.row}>
                <TextInput
                  label="City"
                  value={formData.address.city}
                  onChangeText={(value) => updateFormData('address.city', value)}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  left={<TextInput.Icon icon="city" />}
                  error={!!errors.city}
                />
                <TextInput
                  label="State"
                  value={formData.address.state}
                  onChangeText={(value) => updateFormData('address.state', value)}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  left={<TextInput.Icon icon="map-marker" />}
                  error={!!errors.state}
                />
              </View>
              <View style={styles.row}>
                <HelperText type="error" visible={!!errors.city} style={styles.halfHelper}>
                  {errors.city}
                </HelperText>
                <HelperText type="error" visible={!!errors.state} style={styles.halfHelper}>
                  {errors.state}
                </HelperText>
              </View>

              <TextInput
                label="Pincode"
                value={formData.address.pincode}
                onChangeText={(value) => updateFormData('address.pincode', value)}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                left={<TextInput.Icon icon="map-marker-radius" />}
                error={!!errors.pincode}
              />
              <HelperText type="error" visible={!!errors.pincode}>
                {errors.pincode}
              </HelperText>

              <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.registerButton}
                contentStyle={styles.buttonContent}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFFFFF" /> : 'Create Account'}
              </Button>
            </Card.Content>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
            >
              Sign In
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  logo: {
    fontSize: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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
  registerButton: {
    marginTop: 20,
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#757575',
    marginRight: 5,
  },
  loginButton: {
    marginLeft: 5,
  },
});

export default RegisterScreen;



