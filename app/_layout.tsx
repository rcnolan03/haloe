// app/_layout.tsx

import React from 'react';
import { Stack } from 'expo-router';

const Layout: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide header for all screens
      }}
    />
  );
};

export default Layout;
