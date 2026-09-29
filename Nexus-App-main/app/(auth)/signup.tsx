import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp(firstName, lastName, email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={50}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Create Account</Text>
          <Text style={styles.subHeaderText}>Sign up to get started</Text>
        </View>

        <View style={styles.formContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.nameRow}>
            <TextInput
              style={styles.nameInput}
              placeholder="First Name"
              placeholderTextColor="#65676B"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.nameInput}
              placeholder="Last Name"
              placeholderTextColor="#65676B"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#65676B"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#65676B"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1877F2',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#65676B',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  nameInput: {
    backgroundColor: '#F5F6F8',
    borderRadius: 5,
    padding: 15,
    width: '48%',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#F5F6F8',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#1877F2',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginText: {
    color: '#65676B',
    fontSize: 16,
  },
  loginLink: {
    color: '#1877F2',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 15,
    textAlign: 'center',
  },
});