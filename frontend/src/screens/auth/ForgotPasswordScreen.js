import React, { useState } from 'react';
import {
  View,
  StyleSheet,
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
import Toast from 'react-native-toast-message';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleResetPassword = async () => {
    setError('');
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Toast.show({
        type: 'success',
        text1: 'Reset Link Sent',
        text2: 'Please check your email for password reset instructions',
      });
      
      navigation.navigate('Login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send reset link. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>🔐</Text>
            <Title style={styles.title}>Forgot Password?</Title>
            <Paragraph style={styles.subtitle}>
              Don't worry! Enter your email address and we'll send you a link to reset your password.
            </Paragraph>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
                error={!!error}
              />
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>

              <Button
                mode="contained"
                onPress={handleResetPassword}
                style={styles.resetButton}
                contentStyle={styles.buttonContent}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFFFFF" /> : 'Send Reset Link'}
              </Button>

              <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                style={styles.backButton}
              >
                Back to Login
              </Button>
            </Card.Content>
          </Card>
        </View>
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  input: {
    marginBottom: 16,
  },
  resetButton: {
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  backButton: {
    alignSelf: 'center',
  },
});

export default ForgotPasswordScreen;



