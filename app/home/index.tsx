import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, ActivityIndicator, Button, Linking } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

interface Coordinate {
  latitude: number;
  longitude: number;
}

const HomeScreen: React.FC = () => {
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState<Coordinate | null>(null); // Store selected destination
  const [loading, setLoading] = useState(true);
  const [isDestinationSelected, setIsDestinationSelected] = useState(false); // Track if a destination is selected

  useEffect(() => {
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
    //const location = await Location.getCurrentPositionAsync({});
    //const { latitude, longitude } = location.coords;
    setCurrentLocation({ latitude: 41.791896, longitude: -87.603115 });
    setLoading(false);
  };

  const startWalkingRoute = () => {
    if (currentLocation && destination) {
      const startCoords = `${currentLocation.latitude},${currentLocation.longitude}`;
      const endCoords = `${destination.latitude},${destination.longitude}`;

      if (Platform.OS === 'ios') {
        // Open Apple Maps in walking mode with turn-by-turn navigation
        Linking.openURL(`http://maps.apple.com/?saddr=${startCoords}&daddr=${endCoords}&dirflg=w`);
      } else {
        // Open Google Maps in walking mode with turn-by-turn navigation
        Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${startCoords}&destination=${endCoords}&travelmode=walking`);
      }
    }
  };

  const sendLocationsToBackend = async () => {
    if (currentLocation && destination) {
      try {
        const response = await fetch('http://172.29.247.206:3000/api/send-locations', { // Replace with your backend endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startLocation: currentLocation,
            endLocation: destination,
          }),
        });

        const data = await response.json();

      // Convert array of arrays to array of objects
      const formattedData = data.map((coord: number[]) => ({
        latitude: coord[0],
        longitude: coord[1],
      }));

      console.log(formattedData);
      setRouteCoordinates(formattedData); // Set state with formatted data
      } catch (error) {
        console.error('Error sending locations to backend:', error);
      }
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
      {/* Google Places Autocomplete Search Bar */}
      <GooglePlacesAutocomplete
        placeholder="Search"
        minLength={2} // Minimum length of input before search starts
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details) {
            const { lat, lng } = details.geometry.location;
            setDestination({ latitude: lat, longitude: lng }); // Set destination
            setIsDestinationSelected(true); // Show the "Start Navigation" button
          }
        }}
        query={{
          key: 'AIzaSyCypHEZiYGK47Pxi-2pGNQwB3HbVNWwxkI', // Replace with your Google API Key
          language: 'en',
        }}
        styles={{
          container: {
            position: 'absolute',
            top: 50, // Adjust this value to move the search bar lower
            left: 0,
            right: 0,
            alignItems: 'center', // Center the search bar horizontally
            zIndex: 1,
          },
          textInputContainer: {
            width: '90%', // Adjust width as needed
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5, // Adds shadow on Android
          },
          textInput: {
            height: 40,
            color: '#5d5d5d',
            fontSize: 16,
          },
          listView: {
            backgroundColor: 'white',
            borderRadius: 10,
            marginTop: 5,
            elevation: 5,
          },
        }}
      />
      
      {/* Map View */}
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
        followsUserLocation={false} // Follow the user's current location
      >
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates} // Plot the route using formatted coordinates
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

      {/* Show button only if a destination is selected */}
      {isDestinationSelected && (
        <View style={styles.buttonContainer}>
          <Button title="Start Navigation" onPress={sendLocationsToBackend} />
        </View>
      )}
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
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: '20%',
    right: '20%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default HomeScreen;
