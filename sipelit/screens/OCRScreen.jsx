import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Image, Alert, ScrollView } from "react-native";
import { Button, Text, Surface } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useLazyQuery } from "@apollo/client";
import { generateOCR } from "../apollo/transactionQuery";

const OcrScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [generate, { loading }] = useLazyQuery(generateOCR);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Permission to access camera is required!"
        );
      }
    };
    requestPermissions();
  }, []);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

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

  const performOcr = async () => {
    if (!imageUri) {
      Alert.alert("Error", "Please select an image first");
      return;
    }
    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const apiKey = "AIzaSyC-KckZmKIdwqoNz6PT8xpmaWVXPqWq7-Y";
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Image,
                },
                features: [
                  {
                    type: "DOCUMENT_TEXT_DETECTION",
                    maxResults: 20,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      let ocrText = "";

      if (data.responses && data.responses[0].fullTextAnnotation) {
        ocrText = data.responses[0].fullTextAnnotation.text;
      } else if (data.responses && data.responses[0].textAnnotations) {
        ocrText = data.responses[0].textAnnotations[0].description;
      } else {
        Alert.alert("No text detected in the image.");
      }

      const res = await generate({ variables: { input: ocrText } });

      navigation.navigate("CreateTransactionScreen", {
        ocrResult: res.data.gemini,
      });
    } catch (error) {
      Alert.alert("An error occurred while processing the image.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#145da0" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 4,
          marginTop: 28,
          marginBottom: 12,
        }}
      >
        <Button
          icon="keyboard-backspace"
          mode="contained"
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: "transparent",
            elevation: 0,
          }}
          labelStyle={{
            color: "#F3F4F6",
          }}
        >
          Back
        </Button>
        <Text
          style={{
            color: "#F3F4F6",
            fontSize: 26,
            fontWeight: "700",
            flex: 1,
            marginLeft: 76,
          }}
        >
          Scan
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          marginTop: 16,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Camera Scanner
          </Text>
          <Text
            style={{
              color: "#F3F4F6",
              fontSize: 16,
              opacity: 0.8,
              textAlign: "center",
            }}
          >
            Capture a photo or pick an image to generate transaction.
          </Text>
        </View>

        <Surface
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 24,
            padding: 24,
            elevation: 4,
            alignItems: "center",
          }}
        >
          {imageUri && (
            <>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                Warning!
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "red",
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
              >
                Use a clear, high-resolution image for optimal text scanning
                results.
              </Text>
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: "100%",
                  height: 350,
                  marginTop: 10,
                  marginBottom: 20,
                  borderRadius: 8,
                }}
              />
            </>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 8,
            }}
          >
            <Button
              mode="contained"
              onPress={takePhoto}
              style={{
                flex: 1,
                marginHorizontal: 4,
                paddingVertical: 6,
                backgroundColor: "#145da0",
                borderRadius: 12,
              }}
              labelStyle={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}
            >
              Take a Photo
            </Button>
            <Button
              mode="contained"
              onPress={pickImage}
              style={{
                flex: 1,
                marginHorizontal: 4,
                paddingVertical: 6,
                backgroundColor: "#145da0",
                borderRadius: 12,
              }}
              labelStyle={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}
            >
              Pick an Image
            </Button>
          </View>

          <Button
            mode="contained"
            onPress={performOcr}
            loading={loading}
            disabled={loading}
            style={{
              paddingVertical: 6,
              backgroundColor: "#56aeff",
              borderRadius: 12,
              width: "100%",
              marginVertical: 8,
            }}
            labelStyle={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}
          >
            Submit
          </Button>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OcrScreen;
