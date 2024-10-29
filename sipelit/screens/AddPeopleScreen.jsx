import React, { useState, useEffect, useMemo } from "react";
import { View, ScrollView, Alert } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Surface,
  IconButton,
  Checkbox,
  Avatar,
} from "react-native-paper";

export default function AddPeopleScreen({ route, navigation }) {
  // States for managing users and assignments
  const [transaction, setTransaction] = useState({
    category: "Food",
    items: [
      { name: "Kopi susu", price: 8000, quantity: 3
       },
      {
        name: "Kopi Oatside",
        price: 12000,
        quantity: 1,
      },
    ],
    name: "Hacktiv8",
    totalPrice: 36000,
    tax: 10,
  })
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [itemAssignments, setItemAssignments] = useState({});
  const [items, setItems] = useState(() => 
    transaction.items.map(item => ({
      ...item,
      remainingQuantity: item.quantity
    }))
  );

  // Initialize item assignments
  useEffect(() => {
    const initialAssignments = {};
    items.forEach(item => {
      initialAssignments[item.name] = [];
    });
    setItemAssignments(initialAssignments);
  }, []);

  // Add new user
  const addUser = () => {
    if (newUserName.trim()) {
      setUsers(prev => [...prev, {
        id: Date.now().toString(),
        name: newUserName.trim()
      }]);
      setNewUserName("");
    } else {
      Alert.alert("Error", "Please enter a valid name");
    }
  };

  // Remove user and their assignments
  const removeUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    // Update item assignments and quantities
    setItemAssignments(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(itemName => {
        updated[itemName] = updated[itemName].filter(id => id !== userId);
      });
      return updated;
    });

    // Restore item quantities
    setItems(prev => 
      prev.map(item => ({
        ...item,
        remainingQuantity: item.remainingQuantity + 
          (itemAssignments[item.name]?.includes(userId) ? 1 : 0)
      }))
    );
  };

  // Toggle item assignment for user
  const toggleAssignment = (itemName, userId) => {
    const item = items.find(i => i.name === itemName);
    if (!item) return;

    setItemAssignments(prev => {
      const current = [...(prev[itemName] || [])];
      const index = current.indexOf(userId);

      if (index === -1) {
        // Assign item to user
        if (item.remainingQuantity > 0) {
          current.push(userId);
          setItems(prevItems => 
            prevItems.map(i => 
              i.name === itemName 
                ? { ...i, remainingQuantity: i.remainingQuantity - 1 }
                : i
            )
          );
        } else {
          Alert.alert("Error", `No more ${itemName} available`);
          return prev;
        }
      } else {
        // Remove assignment
        current.splice(index, 1);
        setItems(prevItems => 
          prevItems.map(i => 
            i.name === itemName 
              ? { ...i, remainingQuantity: i.remainingQuantity + 1 }
              : i
          )
        );
      }

      return { ...prev, [itemName]: current };
    });
  };

  // Calculate individual shares
  const calculateShares = useMemo(() => {
    const shares = {};
    const taxRate = transaction.tax / 100;

    users.forEach(user => {
      shares[user.id] = 0;
    });

    items.forEach(item => {
      const assignedUsers = itemAssignments[item.name] || [];
      if (assignedUsers.length > 0) {
        const pricePerItem = item.price * (1 + taxRate);
        assignedUsers.forEach(userId => {
          shares[userId] += pricePerItem;
        });
      }
    });

    return shares;
  }, [users, items, itemAssignments]);

  return (
    <View style={{ flex: 1, backgroundColor: "#145da0" }}>
      {/* Header */}
      <View style={{ padding: 16, paddingTop: 48 }}>
        <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "bold" }}>
          Assign Items
        </Text>
      </View>

      <ScrollView>
        {/* Add User Section */}
        <Surface style={{ margin: 16, padding: 16, borderRadius: 12 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              value={newUserName}
              onChangeText={setNewUserName}
              style={{ flex: 1, backgroundColor: "#ffffff" }}
              placeholder="Enter name"
            />
            <Button 
              mode="contained" 
              onPress={addUser}
              style={{ backgroundColor: "#145da0" }}
            >
              Add
            </Button>
          </View>
        </Surface>

        {/* Users List */}
        {users.map(user => (
          <Surface 
            key={user.id}
            style={{ margin: 16, padding: 16, borderRadius: 12 }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Avatar.Text size={40} label={user.name.substring(0, 2)} />
                <Text style={{ marginLeft: 12, fontSize: 16 }}>{user.name}</Text>
              </View>
              <IconButton icon="close" onPress={() => removeUser(user.id)} />
            </View>
          </Surface>
        ))}

        {/* Items Assignment */}
        {items.map(item => (
          <Surface 
            key={item.name}
            style={{ margin: 16, padding: 16, borderRadius: 12 }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              {item.name} - Rp {item.price}
            </Text>
            <Text style={{ marginBottom: 12, color: "#666" }}>
              Quantity: {item.remainingQuantity} / {item.quantity}
            </Text>
            
            {users.map(user => (
              <View 
                key={user.id}
                style={{ flexDirection: "row", alignItems: "center", padding: 8 }}
              >
                <Checkbox
                  status={itemAssignments[item.name]?.includes(user.id) ? 'checked' : 'unchecked'}
                  onPress={() => toggleAssignment(item.name, user.id)}
                />
                <Text>{user.name}</Text>
              </View>
            ))}
          </Surface>
        ))}

        {/* Summary */}
        <Surface style={{ margin: 16, padding: 16, borderRadius: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
            Summary
          </Text>
          {users.map(user => (
            <View 
              key={user.id}
              style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}
            >
              <Text>{user.name}</Text>
              <Text>
                Rp {calculateShares[user.id].toLocaleString()}
              </Text>
            </View>
          ))}
        </Surface>

        <Button
          mode="contained"
          onPress={() => {
            // Handle saving assignments
            console.log({ users, itemAssignments, shares: calculateShares });
          }}
          style={{ margin: 16, backgroundColor: "#145da0" }}
        >
           Confirm Assignments
        </Button>
      </ScrollView>
    </View>
  );
}