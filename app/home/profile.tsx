import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';


const SettingsPage = () => {
  // Example user data


  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const [name, setName] = useState('Loading...');
  const [gender, setGender] = useState('Loading...');
  const [birthdate, setBirthdate] = useState('Loading...');

  // Fetch values from SecureStore
  useEffect(() => {
    const fetchData = async () => {
      const name = await getSecureStoreValue('name');
      const gender = await getSecureStoreValue('gender');
      const birthdate = await getSecureStoreValue('birthdate');

      setName(name);
      setGender(gender);
      setBirthdate(birthdate);
    };

    fetchData();
  }, []);


  const getSecureStoreValue = async (key: string) => {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value || 'Not Available'; // Default value if none is found
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      return 'Error';
    }
  };



  // Function to save data
  async function saveData(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }


  const toggleSelect = async (option: string) => { 
    
    let curArray;

    if (selectedOptions.includes(option)) {
      curArray = selectedOptions.filter(selected => selected !== option);
      setSelectedOptions(curArray)
      //setSelectedOptions(selectedOptions.filter(selected => selected !== option));
    } else {
      curArray = [...selectedOptions, option];
      setSelectedOptions(curArray);
      //setSelectedOptions([...selectedOptions, option]);
    }


    const stringifiedOptions = JSON.stringify(curArray);

    console.log('Selected Options as JSON string:', stringifiedOptions);

    await saveData('PrompList', stringifiedOptions);


  };

  const isSelected = (option: string) => selectedOptions.includes(option);

  const options = ["Option A", "Option B", "Option C"]; // String options


  // store array as string OptA;OptB;OptC;
  // Find part of array and take it out if its not selected




  return (
    <View style={styles.container}>
      {/* Profile section */}
      <View style={styles.profileContainer}>
        <Image source={require('./resources/profile.png')} style={styles.profileImage} />
        <Text style={styles.username}>{name}</Text>
      </View>

      {/* LoSettings section */}
      <Text style={styles.loSettingsText}>LoSettings</Text>

      {/* Settings box */}
      <View style={styles.settingsBox}>
        <Text style={styles.settingsText}>When I press Loe, I want it to:</Text>

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
        <Text style={styles.userInfoText}>Name: {name}</Text>
        <Text style={styles.userInfoText}>Gender: {gender}</Text> 
        <Text style={styles.userInfoText}>Birthday: {birthdate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c2c2c', // Dark gray background
    padding: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  loSettingsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f5c300', // Yellow text
    marginBottom: 10,
    marginLeft: 8
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
    marginLeft: 8
  },
  userInfoText: {
    color: '#fff', // White text
    fontSize: 16,
    marginBottom: 5,
  },
});

export default SettingsPage;
