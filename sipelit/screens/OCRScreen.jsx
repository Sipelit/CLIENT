// src/screens/OcrScreen.js
import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const OcrScreen = () => {
  const [imageUri, setImageUri] = useState(null); 
  const [ocrResult, setOcrResult] = useState('');

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access camera is required!');
      }
    };
    requestPermissions();
  }, []);

  // Function to take a new photo
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Function to perform OCR using Google Vision API
  const performOcr = async () => {
    if (!imageUri) {
      alert('Please select an image first');
      return;
    }
    try {
      // Convert image to base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Call Google Vision API
      const apiKey = 'AIzaSyC-KckZmKIdwqoNz6PT8xpmaWVXPqWq7-Y'; 
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Image,
                },
                features: [
                  {
                    type: 'DOCUMENT_TEXT_DETECTION', 
                    maxResults: 20,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      // console.log(data); 

      // Check different fields in the response for detected text
      if (data.responses && data.responses[0].fullTextAnnotation) {
        setOcrResult(data.responses[0].fullTextAnnotation.text);
      } else if (data.responses && data.responses[0].textAnnotations) {
        setOcrResult(data.responses[0].textAnnotations[0].description);
      } else {
        alert('No text detected in the image.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while processing the image.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      <Text style={styles.title}>OCR Photo Capture</Text>
      <Text style={styles.description}>Capture a photo or pick an image to extract text.</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Take a Photo" onPress={takePhoto} color="#145da0" />
        <Button title="Pick an Image" onPress={pickImage} color="#145da0" />
      </View>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
      
      <Button title="Submit" onPress={performOcr} color="#ffcc00" />
      
      {ocrResult ? (
        <Text style={styles.resultText}>{ocrResult}</Text>
      ) : null}
    </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default OcrScreen;
