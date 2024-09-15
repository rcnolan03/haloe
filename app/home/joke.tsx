import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Speech from 'expo-speech'; 
import OpenAI from 'openai';
import * as SecureStore from 'expo-secure-store';

const AiWithTTS: React.FC = () => {
  // Store the prompt
  const [prompt] = useState("tell me a joke");
  const openai = new OpenAI({
    apiKey: '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',
  });

  // Store AI response
  const [aiResponse, setAiResponse] = useState("");



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



  const sendPromptToAI = async () => {

    try { 
      //   // Send a request to an AI API (this is a placeholder for the actual API integration)
      //   const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      //     model: 'gpt-3.5-turbo',
      //     prompt: prompt,
      //     max_tokens: 50,
      //   }, {
      //     headers: {
      //       'Authorization': `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`
      //     }
      //   });



      // get string from data
      // destringify it
      // at random, chose a value
      // that value is the prompt

      const prompsStr = await getData('PrompList');

      if (prompsStr) {
        const promptArr = JSON.parse(prompsStr);

        const randomPrompt = promptArr[Math.floor(Math.random() * promptArr.length)];

        console.log('Randomly selected prompt:', randomPrompt);

        
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              "role": "system",
              "content": [
                {
                  "type": "text",
                  "text": randomPrompt
                }
              ]
            }
          ],
          temperature: 1,
          max_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          response_format: {
            "type": "text"
          },
        });     
        
        // Extract the generated response from the API (adjust according to your API's response structure)
        console.log(response.choices[0].message.content);
        const generatedText = response.choices[0].message.content;

        // Store the response in state
        setAiResponse(generatedText!);

        // Output the response using text-to-speech
        Speech.speak(generatedText!);



      }


      
       

    } catch (error) {
      console.error("Error generating AI response:", error);
    }
  };




  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={sendPromptToAI}  style={styles.imageButton}>
        <Image
          source={require('./resources/Loe1.png')} // Replace with your image URL
          style={styles.imageButton}
        />

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c2c2c', // Dark gray background
  },
  promptText: {
    color: '#f5c300', // Yellow text
    fontSize: 18,
    marginBottom: 20,
  },
  aiResponseText: {
    color: '#fff', // White text
    fontSize: 16,
    marginTop: 20,
  },
  imageButton: {
    width: 120,
    height: 60,
    borderRadius: 40,
  },
});



export default AiWithTTS;