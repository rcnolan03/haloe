// app/home/_layout.tsx

import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '../../components/navigation/TabBarIcon'; // Adjust the import path
import { Colors } from '../../constants/Colors'; // Adjust the import path
import { useColorScheme } from '../../hooks/useColorScheme'; // Adjust the import path

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        headerShown: false, // Hide header for all tabs
      }}
    >
      {/* <Tabs.Screen
        name="home" // Reference the folder name directly, not 'home/index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      /> */}
      {/* <Tabs.Screen
        name="profile" // Reference the folder name directly
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications" // Reference the folder name directly
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'notifications' : 'notifications-outline'} color={color} />
          ),
        }}
      /> */}
      {/* <Tabs.Screen
        name="settings" // Reference the folder name directly
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
