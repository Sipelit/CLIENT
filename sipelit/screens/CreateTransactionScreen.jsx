import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Surface,
  IconButton,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export function CreateTransactionScreen({ navigation }) {
  const [transaction, setTransaction] = useState({
    name: "",
    items: [],
    category: "",
    tax: 0,
    totalPrice: 0,
  });

  const [itemInput, setItemInput] = useState({
    name: "",
    price: 0,
    quantity: 1,
  });

  const transactionCategories = [
    { icon: "shopping", label: "Shopping" },
    { icon: "food", label: "Food" },
    { icon: "train", label: "Transport" },
    { icon: "medical-bag", label: "Healthcare" },
    { icon: "gamepad-variant", label: "Entertainment" },
    { icon: "dots-horizontal-circle", label: "Other" },
  ];

  const addItem = () => {
    if (itemInput.name && itemInput.price > 0 && itemInput.quantity > 0) {
      const newItem = {
        ...itemInput,
        price: +itemInput.price,
        quantity: +itemInput.quantity,
        totalPrice: +itemInput.price * +itemInput.quantity,
      };
      setTransaction((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
      setItemInput({ name: "", price: 0, quantity: 1 });
    }
  };

  const removeItem = (index) => {
    setTransaction((prev) => {
      const newItems = [...prev.items];
      newItems.splice(index, 1);
      return {
        ...prev,
        items: newItems,
      };
    });
  };

  const calculateTotalPrice = () => {
    const subtotal = transaction.items.reduce((sum, item) => {
      return sum + +item.price * +item.quantity;
    }, 0);

    const taxRate = transaction.tax ? +transaction.tax / 100 : 0;
    const totalWithTax = subtotal * (1 + taxRate);

    setTransaction((prev) => ({ ...prev, totalPrice: totalWithTax }));
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [transaction.items, transaction.tax]);

  return (
    <View style={{ flex: 1, backgroundColor: "#145da0" }}>
      {/* Header */}
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
        {/* Transaction Name */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Surface
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text style={{ color: "#145da0", fontSize: 16, marginBottom: 8 }}>
              Transaction Name
            </Text>
            <TextInput
              value={transaction.name}
              onChangeText={(name) =>
                setTransaction((prev) => ({ ...prev, name: name }))
              }
              style={{
                backgroundColor: "#ffffff",
              }}
              placeholder="Enter transaction name"
              placeholderTextColor="#9CA3AF"
              underlineColor="#145da 0"
              activeUnderlineColor="#145da0"
            />
          </Surface>
        </View>

        {/* Transaction Categories */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text
            style={{
              color: "#ffffff",
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 12,
            }}
          >
            Category
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {transactionCategories.map((item, index) => (
              <Surface
                key={index}
                style={{
                  backgroundColor:
                    transaction.category === item.label ? "#56aeff" : "#ffffff",
                  borderRadius: 12,
                  padding: 16,
                  width: "48%",
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onTouchEnd={() =>
                  setTransaction((prev) => ({ ...prev, category: item.label }))
                }
              >
                <Icon
                  name={item.icon}
                  size={24}
                  color={
                    transaction.category === item.label ? "#ffffff" : "#145da0"
                  }
                />
                <Text
                  style={{
                    color:
                      transaction.category === item.label
                        ? "#ffffff"
                        : "#145da0",
                    marginLeft: 12,
                    fontSize: 16,
                  }}
                >
                  {item.label}
                </Text>
              </Surface>
            ))}
          </View>
        </View>

        {/* Add Items */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Surface
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text style={{ color: "#145da0", fontSize: 16, marginBottom: 16 }}>
              Add Items
            </Text>

            <View style={{ marginBottom: 16 }}>
              <TextInput
                value={itemInput.name}
                onChangeText={(name) =>
                  setItemInput((prev) => ({ ...prev, name: name }))
                }
                style={{ backgroundColor: "#ffffff", marginBottom: 8 }}
                placeholder="Item name"
                underlineColor="#145da0"
                activeUnderlineColor="#145da0"
              />

              <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
                <TextInput
                  value={itemInput.price}
                  onChangeText={(price) =>
                    setItemInput((prev) => ({ ...prev, price: price }))
                  }
                  style={{ backgroundColor: "#ffffff", flex: 2 }}
                  placeholder="Price"
                  keyboardType="numeric"
                  underlineColor="#145da0"
                  activeUnderlineColor="#145da0"
                />

                <TextInput
                  value={itemInput.quantity}
                  onChangeText={(quantity) =>
                    setItemInput((prev) => ({ ...prev, quantity: quantity }))
                  }
                  style={{ backgroundColor: "#ffffff", flex: 1 }}
                  placeholder="Qty"
                  keyboardType="numeric"
                  underlineColor="#145da0"
                  activeUnderlineColor="#145da0"
                />
              </View>

              <Button
                mode="contained"
                onPress={addItem}
                style={{
                  backgroundColor: "#145da0",
                  marginTop: 8,
                  borderRadius: 8,
                }}
              >
                Add Item
              </Button>
            </View>

            {/* Items List */}
            {transaction.items.map((item, index) => (
              <Surface
                key={index}
                style={{
                  backgroundColor: "#f3f4f6",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={{ fontSize: 16, color: "#145da0" }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: "#6b7280" }}>
                    {Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(item.totalPrice)}
                  </Text>
                </View>
                <IconButton
                  icon="close"
                  size={20}
                  onPress={() => removeItem(index)}
                  style={{ margin: 0 }}
                />
              </Surface>
            ))}
          </Surface>
        </View>

        {/* Total Price and Tax */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Surface
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <TextInput
                value={transaction.tax}
                onChangeText={(tax) =>
                  setTransaction((prev) => ({ ...prev, tax: +tax }))
                }
                style={{ backgroundColor: "#ffffff", flex: 1, marginRight: 8 }}
                placeholder="Tax"
                keyboardType="numeric"
                underlineColor="#145da0"
                activeUnderlineColor="#145da0"
              />
              <Text
                style={{ color: "#145da0", fontSize: 20, fontWeight: "500" }}
              >
                %
              </Text>
            </View>
            <Text style={{ color: "#145da0", fontSize: 16, marginBottom: 4 }}>
              Total Price
            </Text>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#145da0" }}
            >
              {Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(transaction.totalPrice)}
            </Text>
          </Surface>
        </View>

        {/* Submit Button */}
        <View style={{ padding: 20 }}>
          <Button
            mode="contained"
            onPress={() => {
              console.log(transaction);
            }}
            style={{
              backgroundColor: "#ffffff",
              padding: 8,
              borderRadius: 12,
            }}
            labelStyle={{ color: "#145da0", fontSize: 16 }}
          >
            Create Transaction
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
