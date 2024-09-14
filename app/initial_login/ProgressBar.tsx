import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;

  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${percentage}%` }]}>
        <Text style={styles.progressText}>
          {current + 1} / {total}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 20,
    backgroundColor: '#444',
    width: '80%',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#f5c300', // Yellow Highlight
  },
  progressText: {
    position: 'absolute',
    top: -25,
    color: 'white',
  },
});

export default ProgressBar;
