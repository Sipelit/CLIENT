import React from "react";
import { View, ScrollView, Image } from "react-native";
import { Text, Surface, Button } from "react-native-paper";

export function ReceiptScreen({ navigation, route }) {
  // This would normally come from route.params
  const mockData = {
    merchantName: "Hacktiv8",
    date: new Date(),
    transactionId: "TRX-001",
    splits: {
      1: {
        name: "Bryan",
        items: {
          "Kopi susu": {
            name: "Kopi susu",
            price: 8000,
            quantity: 2,
          },
        },
        totalPrice: 17600, // Including tax
        userId: "1",
      },
      2: {
        name: "Kelvin",
        items: {
          "Kopi susu": {
            name: "Kopi susu",
            price: 8000,
            quantity: 1,
          },
          "Kopi Oatside": {
            name: "Kopi Oatside",
            price: 12000,
            quantity: 1,
          },
        },
        totalPrice: 22000,
        userId: "2",
      },
    },
    tax: 10,
    originalTotal: 36000,
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#145da0" }}>
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
          }}
        >
          Create Transaction
        </Text>
      </View>
      <ScrollView>
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
              {mockData.merchantName}
            </Text>
            <Text style={{ color: "#6b7280", marginTop: 4 }}>
              {mockData.date.toLocaleString()}
            </Text>
            <Text style={{ color: "#6b7280" }}>
              Transaction ID: {mockData.transactionId}
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
          {Object.values(mockData.splits).map((split) => (
            <View key={split.userId} style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#145da0",
                  marginBottom: 8,
                }}
              >
                {split.name}'s Portion
              </Text>

              {/* Items */}
              {Object.values(split.items).map((item) => (
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

              {/* Subtotal */}
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
                    }).format(split.totalPrice / (1 + mockData.tax / 100))}
                  </Text>
                </View>

                {/* Tax */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 4,
                  }}
                >
                  <Text style={{ color: "#6b7280" }}>
                    Tax ({mockData.tax}%)
                  </Text>
                  <Text style={{ color: "#6b7280" }}>
                    {Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(
                      split.totalPrice -
                        split.totalPrice / (1 + mockData.tax / 100)
                    )}
                  </Text>
                </View>

                {/* Total */}
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
                    }).format(split.totalPrice)}
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
                }).format(mockData.originalTotal * (1 + mockData.tax / 100))}
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
            onPress={() => {}}
            style={{
              flex: 1,
              backgroundColor: "#56aeff",
            }}
          >
            Share
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            textColor="#ffff"
            style={{
              flex: 1,
              borderColor: "#ffff",
            }}
          >
            Back
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
