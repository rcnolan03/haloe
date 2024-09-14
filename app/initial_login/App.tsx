import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import QuestionScreen from './QuestionScreen';
import SingleSelectScreen from './SingleSelectScreen';
import DatePickerScreen from './DatePickerScreen';
import ProgressBar from './ProgressBar';
import Summary from './Summary';
import { styles } from './App.styles'; // External style sheet
import HomeScreen from '../auth';

// empty array for single select error:
let emptyArr: string[] = []; 
const questions = [
  { type: 'text', question: "What is your name?" },
  { type: 'single-select', question: "Select your gender:", options: ["Male", "Female", "Other"] },
  { type: 'date', question: "What is your birthdate?" },
];

function App() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleNext = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    setCurrentQuestion(currentQuestion + 1);
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
            <DatePickerScreen question={questions[currentQuestion].question} onNext={handleNext} />
          )}
        </>
      ) : (
        // routes you to the login screen
       <HomeScreen/>

      )}
    </View>
  );
}

export default App;
