import { useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Surface,
  IconButton,
} from "react-native-paper";
import { getTransactionById } from "../apollo/transactionQuery";

export function AssignPeopleScreen({ route, navigation }) {
  const [transactionItems, setTransactionItems] = useState(null);
  // const { id } = route.params;
  const id = "672456cf2ab5fa469f2484ff";

  const { data, loading, error } = useQuery(getTransactionById, {
    variables: {
      id,
    },
  });

  useEffect(() => {
    if (data && data.getTransactionById) {
      setTransactionItems(data.getTransactionById);
    }
  }, [data]);

  const [people, setPeople] = useState([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [itemAssignments, setItemAssignments] = useState([]);

  const addPerson = () => {
    if (newPersonName) {
      setPeople((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: newPersonName,
        },
      ]);
      setNewPersonName("");
    }
  };

  const addItemAssignment = (itemIndex, personId) => {
    const item = transactionItems.items[itemIndex];

    if (item.quantity > 0) {
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
          quantity: updatedItems[itemIndex].quantity - 1,
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
        quantity: updatedItems[assignment.itemIndex].quantity + 1,
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
          quantity: updatedItems[assignment.itemIndex].quantity + 1,
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
    const userTransactions = people.map((person) => ({
      name: person.name,
      items: itemAssignments
        .filter((assignment) => assignment.personId === person.id)
        .reduce((acc, curr) => {
          const existing = acc.find((item) => item.name === curr.itemName);
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
        }, []),
      totalPrice: calculatePersonTotal(person.id),
      transactionId: id,
      userId: person.id.toString(),
    }));

    console.log("UserTransactions:", userTransactions);

    const totalAssignedQuantity = itemAssignments.length;
    const totalOriginalQuantity = transactionItems.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    if (totalAssignedQuantity < totalOriginalQuantity) {
      Alert.alert("Warning: Not all items have been assigned!");
    }


  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!transactionItems) return null;

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
          Split Bill - {transactionItems.name}
        </Text>
      </View>

      <ScrollView>
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
                    x {item.quantity} remaining
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
                      disabled={item.quantity === 0}
                    >
                      {person.name}
                    </Button>
                  ))}
                </View>
              </Surface>
            ))}
          </Surface>
        </View>

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
                          const remove = itemAssignments
                            .map((assignment, idx) =>
                              assignment.personId === person.id &&
                              assignment.itemName === item.name
                                ? idx
                                : -1
                            )
                            .filter((idx) => idx !== -1);

                          remove.forEach((idx) => removeItemAssignment(idx));
                        }}
                      />
                    </Surface>
                  ))}
                </View>
              );
            })}
          </Surface>
        </View>

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
