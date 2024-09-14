// app/home/index.tsx

import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined} // Use Google Maps on Android, default on iOS
        style={styles.map}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default HomeScreen;
