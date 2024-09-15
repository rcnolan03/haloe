import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, ActivityIndicator, Button, Linking, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { Text, Image } from 'react-native';
import * as Speech from 'expo-speech'; 
import OpenAI from 'openai';

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
  const [isNavigating, setIsNavigating] = useState(false); // State to track navigation status

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
    setCurrentLocation({ latitude: 41.791896, longitude: -87.603115 }); // Example coordinates
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
        const response = await fetch('http://172.29.195.118:3000/api/send-locations', { // Replace with your backend endpoint
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

        // Toggle navigation state
        setIsNavigating(true);
      } catch (error) {
        console.error('Error sending locations to backend:', error);
      }
    }
  };

  const handleNavigationToggle = () => {
    if (isNavigating) {
      // End navigation
      setIsNavigating(false);
      setIsDestinationSelected(false); // Reset destination selection
      setRouteCoordinates([]); // Clear the route coordinates to remove the polyline
    } else {
      // Start navigation
      sendLocationsToBackend();
    }
  };

    const [prompt] = useState("tell me a joke");
  const openai = new OpenAI({
    apiKey: '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',
  });

  // Store AI response
  const [aiResponse, setAiResponse] = useState("");

  const sendPromptToAI = async () => {

    try {
        
      const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              "role": "system",
              "content": [
                {
                  "type": "text",
                  "text": prompt
                }
              ]
            }
          ],
          temperature: 1,
          max_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          response_format: {
            "type": "text"
          },
        });     
        
        // Extract the generated response from the API (adjust according to your API's response structure)
        console.log(response.choices[0].message.content);
        const generatedText = response.choices[0].message.content;

        // Store the response in state
        setAiResponse(generatedText!);

        // Output the response using text-to-speech
        Speech.speak(generatedText!);
    } catch (error) {
      console.error("Error generating AI response:", error);
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
      {/* Conditionally render Google Places Autocomplete Search Bar */}
      {!isNavigating && (
        <GooglePlacesAutocomplete
          placeholder="Where you do want to go?"
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
              top: 70, // Adjust this value to move the search bar lower
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
              shadowColor: 'black',
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
      )}

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
            strokeColor="#F9DC5C" // Customize the route color
            strokeWidth={5} // Customize the route width
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
          <TouchableOpacity onPress={sendPromptToAI}  style={styles.imageButton}>
        <Image
          source={require('./resources/Loe1.png')} // Replace with your image URL
          style={styles.imageButton}
        />

      </TouchableOpacity>
          <Button
            title={isNavigating ? "End Navigation" : "Start Navigation"}
            onPress={handleNavigationToggle}
          />
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
    left: '15%',
    right: '15%',
    backgroundColor: '#3d3d3d',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageButton: {
    width: 120,
    height: 60,
    borderRadius: 40,
    marginBottom: 20,
    marginLeft: 33
  },
});

export default HomeScreen;
