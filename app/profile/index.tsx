// app/profile/index.tsx

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const ProfileScreen: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('User logged out');
    // Navigate back to login screen after logout
    router.push('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Welcome to your profile page!</Text>
      {/* You can add more profile-related components here */}
      
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
});

export default ProfileScreen;
