// app/home/index.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

interface Coordinate {
  latitude: number;
  longitude: number;
}

const HomeScreen: React.FC = () => {
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Request location permissions and fetch current location
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      setLoading(false);
      return;
    }

    // Get the current location of the user
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setCurrentLocation({ latitude, longitude });
    setLoading(false);

    // Fetch route data from the backend
    fetchRouteData();
  };

  const fetchRouteData = async () => {
    try {
      // Replace with your backend URL
      const response = await fetch('https://your-backend-url/api/get-route');
      const data = await response.json();

      // Assuming data is in the form of { lat: number, lng: number }[]
      const coordinates = data.map((point: { lat: number; lng: number }) => ({
        latitude: point.lat,
        longitude: point.lng,
      }));

      setRouteCoordinates(coordinates);
    } catch (error) {
      console.error('Error fetching route data:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined} // Use Google Maps on Android, default on iOS
        style={styles.map}
        region={
          currentLocation
            ? {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01, // Adjust for zoom level
                longitudeDelta: 0.01,
              }
            : undefined // Default if location is not available
        }
        showsUserLocation={true} // Show the user's current location
        followsUserLocation={true} // Follow the user's current location
      >
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates} // Plot the route using coordinates
            strokeColor="#ff0000" // Customize the route color
            strokeWidth={4} // Customize the route width
          />
        )}

        {currentLocation && (
          <Marker
            coordinate={currentLocation} // Show the user's current location as a marker
            title="You are here"
          />
        )}
      </MapView>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
