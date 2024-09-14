import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const SettingsPage = () => {
  // Use strings for the options
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(selected => selected !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // determines which box is selected
  const isSelected = (option: string) => selectedOptions.includes(option);

  const options = [
    "Tell me a joke", 
    "Play soothing sounds", 
    "Tell me a fun fact"
  ]; // String options

  return (
    <View style={styles.container}>
      {/* Profile section */}
      <View style={styles.profileContainer}>
        <Image source={require('./resources/profile.png')} style={styles.profileImage} />
        <Text style={styles.username}>Username</Text>
      </View>

      {/* LoSettings section */}
      <Text style={styles.loSettingsText}>LoSettings</Text>

      {/* Settings box */}
      <View style={styles.settingsBox}>
        <Text style={styles.settingsText}>When I tap Lo, I want them to:</Text>

        {/* Multi-select boxes */}
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => toggleSelect(option)}
            style={[
              styles.optionBox,
              isSelected(option) ? styles.optionBoxSelected : styles.optionBoxUnselected,
            ]}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c2c2c', // Dark gray background
    padding: 40,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    marginTop: 45
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 35,
    marginRight: 15,
  },
  username: {
    color: '#f5c300', // Yellow text
    fontSize: 30,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  loSettingsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f5c300', // Yellow text
    marginBottom: 10,
  },
  settingsBox: {
    backgroundColor: '#3d3d3d', // Lighter gray background
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000', // Drop shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  settingsText: {
    color: '#fff', // White text
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionBox: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionBoxUnselected: {
    borderColor: '#f5c300', // Yellow stroke when unselected
    borderWidth: 2,
  },
  optionBoxSelected: {
    borderColor: '#f5c300',
    borderWidth: 2,
    backgroundColor: '#f5c300', // Yellow fill when selected
  },
  optionText: {
    color: '#fff', // Black text
    fontSize: 14,
    fontWeight: 'normal',
  },
});

export default SettingsPage;
