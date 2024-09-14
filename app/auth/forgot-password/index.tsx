// app/auth/forgot-password/index.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const router = useRouter();

  const handleForgotPassword = () => {
    // Perform forgot password logic here
    console.log('Forgot password for:', email);
    // Redirect to login after sending reset email
    router.push('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button title="Send Reset Email" onPress={handleForgotPassword} />
      <Button title="Back to Login" onPress={() => router.push('/auth/login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default ForgotPasswordScreen;
