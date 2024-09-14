// components/navigation/TabBarIcon.tsx

import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type TabBarIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
};

export function TabBarIcon({ name, color }: TabBarIconProps) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} name={name} color={color} />;
}
