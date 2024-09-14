import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryProps {
  answers: { [key: string]: string };
}

const Summary: React.FC<SummaryProps> = ({ answers }) => {
  return (
    <View style={styles.summaryScreen}>
      <Text style={styles.headerText}>Thank you for your answers!</Text>
      {Object.keys(answers).map((key, index) => (
        <Text key={index} style={styles.answerText}>
          Question {parseInt(key) + 1}: {answers[key]}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  summaryScreen: {
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  answerText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
});

export default Summary;
