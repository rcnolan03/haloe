// src/screens/AppScreen.tsx

import React, { useState } from 'react';
import { View, Button } from 'react-native';
import QuestionScreen from './QuestionScreen';
import SingleSelectScreen from './SingleSelectScreen';
import DatePickerScreen from './DatePickerScreen';
import ProgressBar from './ProgressBar';
import { styles } from './App.styles'; // External style sheet
import * as SecureStore from 'expo-secure-store';

import { useRouter } from 'expo-router';

let emptyArr: string[] = []; 
const questions = [
  { key: 'name', type: 'text', question: "What is your name?" },
  { key: 'gender', type: 'single-select', question: "Select your gender:", options: ["Male", "Female", "Other"] },
  { key: 'birthdate', type: 'date', question: "What is your birthdate?" },
];

// Function to save data
async function saveData(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
    console.log('Data saved successfully!');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Function to retrieve data
async function getData(key: string): Promise<string | null> {
  try {
    const value = await SecureStore.getItemAsync(key);
    if (value) {
      console.log('Retrieved value:', value);
      return value;
    } else {
      console.log('No data found for the key:', key);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
}

function AppScreen() {
    const router = useRouter(); // Get the router instance
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleNext = async (answer: string) => {
    const questionKey = questions[currentQuestion].key;
    await saveData(questionKey, answer);
    const retrievedValue = await getData(questionKey);
    console.log("Saved User Data: " + retrievedValue);

    setAnswers({ ...answers, [currentQuestion]: answer });
    setCurrentQuestion(currentQuestion + 1);
  };

  const navigateToHome = () => {
    router.push('/home');
  };

  return (
    <View style={styles.appContainer}>
      <ProgressBar current={currentQuestion} total={questions.length} />
      {currentQuestion < questions.length ? (
        <>
          {questions[currentQuestion].type === 'text' && (
            <QuestionScreen question={questions[currentQuestion].question} onNext={handleNext} />
          )}
          {questions[currentQuestion].type === 'single-select' && (
            <SingleSelectScreen
              question={questions[currentQuestion].question}
              options={questions[currentQuestion].options || []}
              onNext={handleNext}
            />
          )}
          {questions[currentQuestion].type === 'date' && (
            <DatePickerScreen question={questions[currentQuestion].question} onNext={navigateToHome} />
          )}
        </>
      ) : (
        <Button title="Go to Home" onPress={navigateToHome} />  // Button to navigate to HomeScreen
      )}
    </View>
  );
}

export default AppScreen;
