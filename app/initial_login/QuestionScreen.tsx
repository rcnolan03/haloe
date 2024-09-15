import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { motion } from 'framer-motion'; // If you are using framer-motion for animations

interface QuestionScreenProps {
  question: string;
  onNext: (answer: string) => void;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ question, onNext }) => {
  const [answer, setAnswer] = useState<string>("");

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question}</Text>
      <TextInput
        style={styles.inputField}
        value={answer}
        onChangeText={setAnswer}
        placeholder="Type your answer"
      />
      <Button title="Next" onPress={() => onNext(answer)} />
    </View>
  );
};

const styles = {
  container: {
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  inputField: {
    borderColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
    padding: 10,
    color: 'black',
    marginBottom: 20,
  },
};

export default QuestionScreen;
