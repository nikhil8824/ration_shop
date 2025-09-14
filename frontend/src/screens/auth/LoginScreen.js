import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    const result = await login(email.trim(), password);
    
    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Login successful!',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: result.message || 'Invalid credentials',
      });
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
            <Title style={styles.title}>Ration Shop</Title>
            <Paragraph style={styles.subtitle}>
              Your one-stop shop for daily essentials
            </Paragraph>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Welcome Back</Title>
              <Paragraph style={styles.cardSubtitle}>
                Sign in to your account
              </Paragraph>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
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
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFFFFF" /> : 'Sign In'}
              </Button>

              <Button
                mode="text"
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotButton}
              >
                Forgot Password?
              </Button>
            </Card.Content>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              style={styles.registerButton}
            >
              Sign Up
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardSubtitle: {
    textAlign: 'center',
    color: '#757575',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  forgotButton: {
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#757575',
    marginRight: 5,
  },
  registerButton: {
    marginLeft: 5,
  },
});

export default LoginScreen;



