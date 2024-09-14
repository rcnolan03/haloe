// app/notifications/index.tsx

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const NotificationsScreen: React.FC = () => {
  // Example notifications data
  const notifications = [
    { id: '1', message: 'Your order has been shipped.' },
    { id: '2', message: 'New message from John Doe.' },
    { id: '3', message: 'Your subscription is about to expire.' },
  ];

  const renderItem = ({ item }: { item: { id: string; message: string } }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
});

export default NotificationsScreen;
