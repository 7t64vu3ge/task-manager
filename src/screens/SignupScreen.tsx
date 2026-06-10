import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SignupScreenProps } from '../types/navigation';
import { Input } from '../components/Input';
import { ErrorMessage } from '../components/ErrorMessage';
import { isValidEmail, isValidPassword, isValidFullName } from '../utils/validation';
import { useAuth } from '../context/AuthContext';

export const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const { signup, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [globalError, setGlobalError] = useState('');

  const handleFullNameChange = (text: string) => {
    setFullName(text);
    setGlobalError('');
    setFullNameError(isValidFullName(text) ? '' : 'Full name is required.');
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setGlobalError('');
    if (text.length > 0 && !isValidEmail(text)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setGlobalError('');
    if (text.length > 0 && !isValidPassword(text)) {
      setPasswordError('Password must be at least 6 characters.');
    } else {
      setPasswordError('');
    }
    // Re-validate confirm if already filled in
    if (confirmPassword.length > 0) {
      setConfirmPasswordError(
        text === confirmPassword ? '' : 'Passwords do not match.'
      );
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setGlobalError('');
    if (text.length > 0 && text !== password) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSignup = async () => {
    // Run all validations before submit
    const nameOk = isValidFullName(fullName);
    const emailOk = isValidEmail(email);
    const passOk = isValidPassword(password);
    const confirmOk = password === confirmPassword;

    if (!nameOk) setFullNameError('Full name is required.');
    if (!emailOk) setEmailError('Please enter a valid email address.');
    if (!passOk) setPasswordError('Password must be at least 6 characters.');
    if (!confirmOk) setConfirmPasswordError('Passwords do not match.');

    if (!nameOk || !emailOk || !passOk || !confirmOk) return;

    const error = await signup(fullName, email, password);
    if (error) {
      setGlobalError(error);
    }
  };

  const isSubmitDisabled =
    !fullName ||
    !email ||
    !password ||
    !confirmPassword ||
    !!fullNameError ||
    !!emailError ||
    !!passwordError ||
    !!confirmPasswordError ||
    isLoading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          {globalError ? <ErrorMessage message={globalError} /> : null}

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={handleFullNameChange}
            autoCapitalize="words"
            autoCorrect={false}
            error={fullNameError}
          />

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
            placeholder="At least 6 characters"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            error={passwordError}
          />

          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            secureTextEntry
            error={confirmPasswordError}
          />

          <TouchableOpacity
            style={[styles.button, isSubmitDisabled && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={isSubmitDisabled}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.linkBold}>Log In</Text>
            </Text>
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
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#6b7280',
    fontSize: 14,
  },
  linkBold: {
    color: '#2563eb',
    fontWeight: '700',
  },
});
