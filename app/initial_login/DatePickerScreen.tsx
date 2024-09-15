import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

interface DatePickerScreenProps {
  question: string;
  onNext: (answer: string) => void;
}

const DatePickerScreen: React.FC<DatePickerScreenProps> = ({ question, onNext }) => {
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [year, setYear] = useState<string>('');

  const isDateValid = () => month && day && year;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20, color: 'white' }}>{question}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInput
          placeholder="MM"
          value={month}
          onChangeText={setMonth}
          keyboardType="numeric"
          maxLength={2}
          style={{ borderWidth: 1, borderColor: '#ccc', marginTop: 5, width: 50, height: 40, textAlign: 'center' }}
        />
        <TextInput
          placeholder="DD"
          value={day}
          onChangeText={setDay}
          keyboardType="numeric"
          maxLength={2}
          style={{ borderWidth: 1, borderColor: '#ccc', width: 50, marginTop: 5, textAlign: 'center' }}
        />
        <TextInput
          placeholder="YYYY"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          maxLength={4}
          style={{ borderWidth: 1, borderColor: '#ccc', width: 80, marginTop: 5, textAlign: 'center' }}
        />
      </View>
      <Button title="Next" onPress={() => isDateValid() && onNext(`${month}/${day}/${year}`)} disabled={!isDateValid()} />
    </View>
  );
};

export default DatePickerScreen;
