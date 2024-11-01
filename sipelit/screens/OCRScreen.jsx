import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; // Import expo-file-system
import TesseractOcr from 'react-native-tesseract-ocr';

const OcrScreen = () => {
  const [imageUri, setImageUri] = useState(null); // Store image URI
  const [ocrResult, setOcrResult] = useState(''); // Store OCR result

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted' || galleryStatus !== 'granted') {
        alert('Permission to access camera and gallery is required!');
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

  // Function to perform OCR
  const performOcr = async () => {
    if (!imageUri) {
      alert('Please select an image first');
      return;
    }

    try {
      // Convert URI to Base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Run OCR with the Base64 image
      const text = await TesseractOcr.recognize(
        `data:image/jpeg;base64,${base64Image}`,
        'LANG_EN', // Use appropriate language
        {
          whitelist: null,
          blacklist: null,
        }
      );
      setOcrResult(text);
    } catch (error) {
      console.error('Error during OCR processing:', error);
      alert('An error occurred while processing the image.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take a Photo" onPress={takePhoto} />
      <Button title="Pick an Image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Submit" onPress={performOcr} />
      {ocrResult ? <Text style={styles.resultText}>{ocrResult}</Text> : null}
    </View>
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


// // src/screens/OcrScreen.js
// import React, { useState, useEffect } from 'react';
// import { View, Button, Image, Text, StyleSheet } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system'; // Import expo-file-system
// import Tesseract from 'tesseract.js';

// const OcrScreen = () => {
//   const [imageUri, setImageUri] = useState(null); // Menyimpan URI gambar
//   const [ocrResult, setOcrResult] = useState(''); // Menyimpan hasil OCR

//   useEffect(() => {
//     const requestPermissions = async () => {
//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Permission to access camera is required!');
//       }
//     };
//     requestPermissions();
//   }, []);

//   // Fungsi untuk mengambil foto baru
//   const takePhoto = async () => {
//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       quality: 1,
   
//     });
//     console.log("Camera result:", result); 
  

//     if (!result.canceled) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   // Fungsi untuk memilih gambar dari galeri
//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
   
//     });

//     if (!result.canceled) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   // Fungsi untuk menjalankan OCR
//   const performOcr = async () => {
//     if (!imageUri) {
//       alert('Please select an image first');
//       return;
//     }

//     // try {
//     //   // Konversi URI gambar ke format base64
//     //   const base64Image = await FileSystem.readAsStringAsync(imageUri, {
//     //     encoding: FileSystem.EncodingType.Base64,
//     //   });

//     //   // Jalankan OCR dengan Tesseract menggunakan gambar base64
//     //   const { data: { text } } = await Tesseract.recognize(
//     //     `data:image/jpeg;base64,${base64Image}`,
//     //     'eng',
//     //     {
//     //       logger: info => console.log(info) // Melacak proses OCR
//     //     }
//     //   );
//     //   setOcrResult(text); // Menyimpan hasil OCR
//     // } catch (error) {
//     //   console.error(error);
//     //   alert('An error occurred while processing the image.');
//     // }
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Take a Photo" onPress={takePhoto} />
//       <Button title="Pick an Image" onPress={pickImage} />
//       {imageUri && (
//         <Image source={{ uri: imageUri }} style={styles.image} />
//       )}
//       <Button title="Submit" onPress={performOcr} />
//       {ocrResult ? (
//         <Text style={styles.resultText}>{ocrResult}</Text>
//       ) : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: 200,
//     height: 200,
//     marginVertical: 20,
//   },
//   resultText: {
//     marginTop: 20,
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });

// export default OcrScreen;
