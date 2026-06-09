import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LoginScreenProps } from '../types/navigation';
import { Input } from '../components/Input';
import { isValidEmail, isValidPassword } from '../utils/validation';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(
      email.length > 0 && isValidEmail(email) && 
      password.length > 0 && isValidPassword(password)
    );
  }, [email, password]);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.length > 0 && !isValidEmail(text)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.length > 0 && !isValidPassword(text)) {
      setPasswordError('Password cannot be empty');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async () => {
    if (isValid) {
      await login();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={emailError}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            error={passwordError}
          />
          
          <TouchableOpacity 
            style={[styles.button, !isValid && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
