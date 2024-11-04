import React, { useRef } from "react";
import { View, ScrollView, Image } from "react-native";
import { Text, Surface, Button } from "react-native-paper";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { useQuery } from "@apollo/client";
import { getTransactionById } from "../apollo/transactionQuery";

export function ReceiptScreen({ navigation, route }) {
  const transactionId = route.params.transactionId;
  const { data, loading, error } = useQuery(getTransactionById, {
    variables: { id: transactionId },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const formattedDate = data?.getTransactionById?.createdAt
    ? new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(new Date(data.getTransactionById.createdAt))
    : "";

  const imageRef = useRef();

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, { height: 440, quality: 1 });
      await MediaLibrary.saveToLibraryAsync(localUri);
      await Sharing.shareAsync(localUri);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#145da0" }}>
      <ScrollView>
        <View ref={imageRef} collapsable={false} style={{ marginTop: 36 }}>
          <Surface
            style={{
              backgroundColor: "#ffffff",
              margin: 20,
              borderRadius: 8,
              padding: 20,
            }}
          >
            {/* Receipt Header */}
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#145da0" }}
              >
                {data.getTransactionById?.name}
              </Text>
              <Text style={{ color: "#6b7280", marginTop: 4 }}>
                {formattedDate}
              </Text>
              <Text style={{ color: "#6b7280" }}>
                Transaction ID: {data.getTransactionById?._id}
              </Text>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderStyle: "dashed",
                  borderColor: "#cbd5e1",
                  width: "100%",
                  marginTop: 12,
                }}
              />
            </View>

            {/* Split Details */}
            {data.getTransactionById?.userTransaction?.map((user) => (
              <View key={user.userId} style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#145da0",
                    marginBottom: 8,
                  }}
                >
                  {user.name}'s Portion
                </Text>

                {/* Items */}
                {Object.values(user.items).map((item) => (
                  <View
                    key={item.name}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "#374151" }}>
                        {item.name} x{item.quantity}
                      </Text>
                    </View>
                    <Text style={{ color: "#374151" }}>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(item.price * item.quantity)}
                    </Text>
                  </View>
                ))}

                {/* Subtotal, Tax, Total */}
                <View
                  style={{
                    borderTopWidth: 1,
                    borderColor: "#e5e7eb",
                    marginTop: 8,
                    paddingTop: 8,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "#6b7280" }}>Subtotal</Text>
                    <Text style={{ color: "#6b7280" }}>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(user.totalPrice)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 4,
                    }}
                  >
                    <Text style={{ color: "#6b7280" }}>
                      Tax ({data.getTransactionById?.tax}%)
                    </Text>
                    <Text style={{ color: "#6b7280" }}>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(
                        user.totalPrice -
                          user.totalPrice /
                            (1 + data.getTransactionById?.tax / 100)
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 8,
                      borderTopWidth: 1,
                      borderStyle: "dashed",
                      borderColor: "#cbd5e1",
                      paddingTop: 8,
                    }}
                  >
                    <Text style={{ fontWeight: "600", color: "#145da0" }}>
                      Total
                    </Text>
                    <Text style={{ fontWeight: "600", color: "#145da0" }}>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(
                        user.totalPrice +
                          (user.totalPrice * data.getTransactionById?.tax) / 100
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Final Total */}
            <View
              style={{
                borderTopWidth: 2,
                borderColor: "#145da0",
                marginTop: 12,
                paddingTop: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <Text style={{ fontSize: 16, color: "#145da0" }}>Total</Text>
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "#145da0" }}
                >
                  {Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(
                    data.getTransactionById?.totalPrice *
                      (1 + data.getTransactionById?.tax / 100)
                  )}
                </Text>
              </View>
            </View>

            {/* Thank You Note */}
            <View style={{ alignItems: "center", marginTop: 24 }}>
              <Image
                source={require("../assets/icon.png")}
                style={{ width: 100, height: 30, marginTop: 4 }}
              />
            </View>
          </Surface>
        </View>

        {/* Action Buttons */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            padding: 20,
            justifyContent: "center",
          }}
        >
          <Button
            mode="contained"
            onPress={onSaveImageAsync}
            style={{ flex: 1, backgroundColor: "#56aeff" }}
          >
            Share
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            textColor="#ffff"
            style={{ flex: 1, borderColor: "#ffff" }}
          >
            Back
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
