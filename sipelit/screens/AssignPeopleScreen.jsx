import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Surface,
  IconButton,
} from "react-native-paper";

export function AssignPeopleScreen({ navigation }) {
  // Hardcoded transaction data
  const [transactionItems, setTransactionItems] = useState({
    category: "Food",
    items: [
      {
        name: "Kopi susu",
        price: 8000,
        quantity: 3,
        remainingQuantity: 3,
        totalPrice: 24000,
      },
      {
        name: "Kopi Oatside",
        price: 12000,
        quantity: 1,
        remainingQuantity: 1,
        totalPrice: 12000,
      },
    ],
    name: "Hacktiv8",
    totalPrice: 36000,
    tax: 10,
  });

  const [people, setPeople] = useState([]);
  const [newPersonName, setNewPersonName] = useState("");

  const [itemAssignments, setItemAssignments] = useState([]);

  const addPerson = () => {
    if (newPersonName.trim()) {
      setPeople((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: newPersonName.trim(),
        },
      ]);
      setNewPersonName("");
    }
  };

  const addItemAssignment = (itemIndex, personId) => {
    const item = transactionItems.items[itemIndex];

    if (item.remainingQuantity > 0) {
      setItemAssignments((prev) => [
        ...prev,
        {
          itemIndex,
          personId,
          itemName: item.name,
          price: item.price,
          quantity: 1,
        },
      ]);

      setTransactionItems((prev) => {
        const updatedItems = [...prev.items];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          remainingQuantity: updatedItems[itemIndex].remainingQuantity - 1,
        };
        return { ...prev, items: updatedItems };
      });
    }
  };

  const removeItemAssignment = (assignmentIndex) => {
    const assignment = itemAssignments[assignmentIndex];

    setTransactionItems((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[assignment.itemIndex] = {
        ...updatedItems[assignment.itemIndex],
        remainingQuantity:
          updatedItems[assignment.itemIndex].remainingQuantity + 1,
      };
      return { ...prev, items: updatedItems };
    });

    setItemAssignments((prev) =>
      prev.filter((_, index) => index !== assignmentIndex)
    );
  };

  const calculatePersonTotal = (personId) => {
    const personItems = itemAssignments.filter(
      (assignment) => assignment.personId === personId
    );
    const subtotal = personItems.reduce((sum, assignment) => {
      return sum + assignment.price * assignment.quantity;
    }, 0);

    const taxAmount = (subtotal * transactionItems.tax) / 100;
    return subtotal + taxAmount;
  };

  const removePerson = (personId) => {
    const personAssignments = itemAssignments.filter(
      (assignment) => assignment.personId === personId
    );

    personAssignments.forEach((assignment) => {
      setTransactionItems((prev) => {
        const updatedItems = [...prev.items];
        updatedItems[assignment.itemIndex] = {
          ...updatedItems[assignment.itemIndex],
          remainingQuantity:
            updatedItems[assignment.itemIndex].remainingQuantity + 1,
        };
        return { ...prev, items: updatedItems };
      });
    });

    setItemAssignments((prev) =>
      prev.filter((assignment) => assignment.personId !== personId)
    );

    setPeople((prev) => prev.filter((person) => person.id !== personId));
  };

  const handleConfirmSplit = () => {
    const userTransactions = people.map(person => ({
      _id: person.id.toString(),
      name: person.name,
      items: itemAssignments
        .filter(assignment => assignment.personId === person.id)
        .reduce((acc, curr) => {
          const existing = acc.find(item => item.name === curr.itemName);
          if (existing) {
            existing.quantity += 1;
          } else {
            acc.push({
              name: curr.itemName,
              price: curr.price,
              quantity: 1
            });
          }
          return acc;
        }, []),
      totalPrice: calculatePersonTotal(person.id),
      userId: person.id.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    console.log('UserTransactions:', userTransactions);
    
    const totalAssignedQuantity = itemAssignments.length;
    const totalOriginalQuantity = transactionItems.items.reduce(
      (sum, item) => sum + item.quantity, 0
    );
    
    if (totalAssignedQuantity < totalOriginalQuantity) {
      console.log('Warning: Not all items have been assigned!');
    }
  };

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
          Split Bill - {transactionItems.name}
        </Text>
      </View>

      <ScrollView>
        {/* Add People Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Surface
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text style={{ color: "#145da0", fontSize: 16, marginBottom: 16 }}>
              Add People
            </Text>

            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
              <TextInput
                value={newPersonName}
                onChangeText={setNewPersonName}
                style={{ flex: 1, backgroundColor: "#ffffff" }}
                placeholder="Enter name"
                underlineColor="#145da0"
                activeUnderlineColor="#145da0"
              />
              <Button
                mode="contained"
                onPress={addPerson}
                style={{
                  backgroundColor: "#145da0",
                  borderRadius: 8,
                }}
              >
                Add
              </Button>
            </View>

            {/* People List */}
            {people.map((person) => (
              <Surface
                key={person.id}
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
                <Text style={{ fontSize: 16, color: "#145da0" }}>
                  {person.name}
                </Text>
                <IconButton
                  icon="close"
                  size={20}
                  onPress={() => removePerson(person.id)}
                  style={{ margin: 0 }}
                />
              </Surface>
            ))}
          </Surface>
        </View>

        {/* Items Assignment Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Surface
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text style={{ color: "#145da0", fontSize: 16, marginBottom: 16 }}>
              Assign Items
            </Text>

            {transactionItems.items.map((item, itemIndex) => (
              <Surface
                key={itemIndex}
                style={{
                  backgroundColor: "#f3f4f6",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <View style={{ marginBottom: 8 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#145da0",
                      fontWeight: "600",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text style={{ color: "#6b7280" }}>
                    {Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(item.price)}{" "}
                    x {item.remainingQuantity} remaining
                  </Text>
                </View>

                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                >
                  {people.map((person) => (
                    <Button
                      key={person.id}
                      mode="outlined"
                      onPress={() => addItemAssignment(itemIndex, person.id)}
                      style={{
                        borderColor: "#145da0",
                      }}
                      labelStyle={{
                        color: "#145da0",
                      }}
                      disabled={item.remainingQuantity === 0}
                    >
                      {person.name}
                    </Button>
                  ))}
                </View>
              </Surface>
            ))}
          </Surface>
        </View>

        {/* Assignments Summary */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Surface
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text style={{ color: "#145da0", fontSize: 16, marginBottom: 16 }}>
              Current Assignments
            </Text>

            {people.map((person) => {
              const groupedItems = itemAssignments
                .filter((assignment) => assignment.personId === person.id)
                .reduce((acc, curr) => {
                  const existing = acc.find(
                    (item) => item.name === curr.itemName
                  );
                  if (existing) {
                    existing.quantity += 1;
                  } else {
                    acc.push({
                      name: curr.itemName,
                      price: curr.price,
                      quantity: 1,
                    });
                  }
                  return acc;
                }, []);

              return (
                <View key={person.id} style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#145da0",
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                  >
                    {person.name}
                  </Text>
                  {groupedItems.map((item, index) => (
                    <Surface
                      key={index}
                      style={{
                        backgroundColor: "#f3f4f6",
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 8,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#145da0" }}>
                        {item.name} x{item.quantity} -{" "}
                        {Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.price * item.quantity)}
                      </Text>
                      <IconButton
                        icon="close"
                        size={20}
                        onPress={() => {
                          const indicesToRemove = itemAssignments
                            .map((assignment, idx) =>
                              assignment.personId === person.id &&
                              assignment.itemName === item.name
                                ? idx
                                : -1
                            )
                            .filter((idx) => idx !== -1);

                          indicesToRemove.forEach((idx) =>
                            removeItemAssignment(idx)
                          );
                        }}
                      />
                    </Surface>
                  ))}
                </View>
              );
            })}
          </Surface>
        </View>

        {/* Final Summary */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Surface
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text style={{ color: "#145da0", fontSize: 16, marginBottom: 16 }}>
              Summary
            </Text>

            {people.map((person) => (
              <View
                key={person.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "#e5e7eb",
                }}
              >
                <Text style={{ fontSize: 16, color: "#145da0" }}>
                  {person.name}
                </Text>
                <Text
                  style={{ fontSize: 16, color: "#145da0", fontWeight: "600" }}
                >
                  {Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(calculatePersonTotal(person.id))}
                </Text>
              </View>
            ))}

            <View
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 2,
                borderTopColor: "#145da0",
              }}
            >
              <Text
                style={{ fontSize: 16, color: "#145da0", fontWeight: "600" }}
              >
                Total Bill:{" "}
                {Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(
                  transactionItems.totalPrice * (1 + transactionItems.tax / 100)
                )}
              </Text>
            </View>
          </Surface>
        </View>

        {/* Submit Button */}
        <View style={{ padding: 20 }}>
          <Button
            mode="contained"
            onPress={handleConfirmSplit}
            style={{
              backgroundColor: "#ffffff",
              padding: 8,
              borderRadius: 12,
            }}
            labelStyle={{ color: "#145da0", fontSize: 16 }}
          >
            Confirm Split
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
