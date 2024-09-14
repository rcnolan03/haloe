import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import questions from '../initial_login/App';
const SettingsPage = () => {
  // Example user data
  const [userInfo] = useState({
    name: questions["name"],
    gender: 'Male',
    birthday: '01/01/1990',
  });


  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(selected => selected !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const isSelected = (option: string) => selectedOptions.includes(option);

  const options = ["Option A", "Option B", "Option C"]; // String options

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
        <Text style={styles.settingsText}>Settings Options</Text>

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

      {/* User Info box */}
      <Text style={styles.userInfoTitle}>User Info</Text>
      <View style={styles.userInfoBox}>
        <Text style={styles.userInfoText}>Name: {userInfo.name}</Text>
        <Text style={styles.userInfoText}>Gender: {userInfo.gender}</Text>
        <Text style={styles.userInfoText}>Birthday: {userInfo.birthday}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c2c2c', // Dark gray background
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 55,
    marginLeft: 10
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 30,
    marginRight: 15,
  },
  username: {
    color: '#f5c300', // Yellow text
    fontSize: 20,
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
    marginBottom: 15,
  },
  optionBox: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#f5c300', // Yellow stroke when unselected
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionBoxUnselected: {
    borderColor: '#f5c300', // Yellow stroke when unselected
    borderWidth: 2,
  },
  optionBoxSelected: {
    backgroundColor: '#f5c300', // Yellow fill when selected
  },
  optionText: {
    color: '#ccc', // Black text
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfoBox: {
    backgroundColor: '#3d3d3d', // Lighter gray background
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000', // Drop shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f5c300', // Yellow text
    marginTop: 20,
  },
  userInfoText: {
    color: '#fff', // White text
    fontSize: 16,
    marginBottom: 5,
  },
});

export default SettingsPage;
