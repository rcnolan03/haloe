import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';

interface SingleSelectScreenProps {
  question: string;
  options: string[];
  onNext: (answer: string) => void;
}

const SingleSelectScreen: React.FC<SingleSelectScreenProps> = ({ question, options, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20, color: 'white'}}>{question}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => handleOptionSelect(option)}
          style={{
            borderWidth: 1,
            borderColor: selectedOption === option ? '#f5c300' : '#ccc',
            backgroundColor: selectedOption === option ? '#f5c300' : 'transparent',
            padding: 10,
            marginBottom: 10,
          }}
        >
          <Text style={{color:'white'}}>{option}</Text>
        </TouchableOpacity>
      ))}
      <Button title="Next" onPress={() => selectedOption && onNext(selectedOption)} disabled={!selectedOption} />
    </View>
  );
};

export default SingleSelectScreen;
