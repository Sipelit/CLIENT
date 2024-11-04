import { useMutation, useQuery } from "@apollo/client";
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
import { CREATE_USER_TRANSACTION } from "../apollo/userTransactionQuery";

export function AssignPeopleScreen({ route, navigation }) {
  const [createUserTransaction] = useMutation(CREATE_USER_TRANSACTION);

  // const { id } = route.params
  const id = "6721e9e20790e60bb0feb8cd";
  const { data, loading, error } = useQuery(getTransactionById, {
    variables: {
      id,
    },
  });

  const [people, setPeople] = useState([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [itemAssignments, setItemAssignments] = useState([]);
  const [remainingQuantities, setRemainingQuantities] = useState({});

  useEffect(() => {
    if (data?.getTransactionById) {
      const quantities = {};
      data.getTransactionById.items.forEach((item, index) => {
        quantities[index] = item.quantity;
      });
      setRemainingQuantities(quantities);
    }
  }, [data]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );

  if (error)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: {error.message}</Text>
      </View>
    );

  const transactionItems = data.getTransactionById;

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
    if (remainingQuantities[itemIndex] > 0) {
      setItemAssignments((prev) => [
        ...prev,
        {
          itemIndex,
          personId,
          itemName: transactionItems.items[itemIndex].name,
          price: transactionItems.items[itemIndex].price,
          quantity: 1,
        },
      ]);

      setRemainingQuantities((prev) => ({
        ...prev,
        [itemIndex]: prev[itemIndex] - 1,
      }));
    }
  };

  const removeItemAssignment = (assignmentIndex) => {
    const assignment = itemAssignments[assignmentIndex];

    setRemainingQuantities((prev) => ({
      ...prev,
      [assignment.itemIndex]: prev[assignment.itemIndex] + 1,
    }));

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

    const updatedQuantities = { ...remainingQuantities };
    personAssignments.forEach((assignment) => {
      updatedQuantities[assignment.itemIndex] += 1;
    });
    setRemainingQuantities(updatedQuantities);

    setItemAssignments((prev) =>
      prev.filter((assignment) => assignment.personId !== personId)
    );

    setPeople((prev) => prev.filter((person) => person.id !== personId));
  };

  const handleConfirmSplit = async () => {
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
      transactionId: id,
      totalPrice: calculatePersonTotal(person.id),
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
      return;
    }

    try {
      const response = await createUserTransaction({
        variables: { userTransactions },
      });
      console.log("Transaction added:", response.data);
      Alert.alert("Success", "User transactions have been saved.");
    } catch (err) {
      console.error("Error adding transaction:", err);
      Alert.alert("Error", "Failed to save user transactions.");
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
                    x {remainingQuantities[itemIndex]} remaining
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
                      disabled={remainingQuantities[itemIndex] === 0}
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
