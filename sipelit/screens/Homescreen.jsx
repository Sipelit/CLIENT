import React, { useEffect, useState, useContext } from "react";
import { View, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import {
  Avatar,
  Card,
  Text,
  Searchbar,
  Surface,
  Divider,
  Button,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TransactionCard from "../components/TransactionCard";
import FAB from "../components/FAB";
import { useQuery } from "@apollo/client";
import { getTransactions } from "../apollo/transactionQuery";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../contexts/authContext";
import { getUserById } from "../apollo/userQuery";

export function HomeScreen({ navigation }) {
  const { setIsLoggedIn, currentUser } = useContext(AuthContext);
  const { data, error, loading, refetch } = useQuery(getTransactions);
  const { data: user } = useQuery(getUserById, {
    variables: {
      id: currentUser._id,
    },
  });

  const [total, setTotal] = useState(0);

  const calculateTotal = () => {
    let price = 0;
    data?.getTransactions?.map((el) => {
      price += el.totalPrice;
    });
    setTotal(price);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("userId");
    setIsLoggedIn(false);
    navigation.navigate("LoginScreen");
  };

  useEffect(() => {
    calculateTotal();
    refetch();
  }, [data]);

  return (
    <View style={{ flex: 1, backgroundColor: "#145da0" }}>
      <View style={{ padding: 24, marginTop: 18 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ color: "#F3F4F6", fontSize: 16, marginTop: 4 }}>
              Welcome back!
            </Text>
            <Text
              style={{
                color: "#F3F4F6",
                fontSize: 28,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              {user?.getUserById?.name}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 16 }}
            >
              <Icon name="logout" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Avatar.Image
              size={40}
              source={{
                uri:
                  user?.getUserById?.profilePicture ??
                  "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1",
              }}
            />
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Card
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 24,
            padding: 24,
            shadowColor: "#ffffff",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <View
            style={{ flexDirection: "column", justifyContent: "space-between" }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/icon.png")}
                style={{ width: 100, height: 30, marginTop: 10 }}
              />
              <Surface
                style={{
                  backgroundColor: "#145da0",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 12 }}>
                  070024358 • BCA Card
                </Text>
              </Surface>
            </View>
            <Divider
              style={{ backgroundColor: "#145da0", marginVertical: 16 }}
            />
            <Text style={{ color: "#145da0", fontSize: 16 }}>
              Total Transactions
            </Text>
            <Text
              style={{ color: "#145da0", fontSize: 36, fontWeight: "bold" }}
            >
              {Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(total)}
            </Text>
          </View>
        </Card>
      </View>

      <View style={{ marginBottom: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 20 }}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {[
            { icon: "send", label: "Send" },
            { icon: "credit-card", label: "Card" },
            { icon: "qrcode-scan", label: "Scan" },
            { icon: "swap-horizontal", label: "Exchange" },
            { icon: "dots-horizontal", label: "More" },
          ].map((item, index) => (
            <View key={index} style={{ marginRight: 16, alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "#ffffff",
                  padding: 16,
                  borderRadius: 20,
                  marginBottom: 8,
                  width: 60,
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name={item?.icon} size={24} color="#145da0" />
              </View>
              <Text style={{ color: "#ffffff", fontSize: 12 }}>
                {item?.label}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Searchbar
            placeholder="Search transactions..."
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              elevation: 0,
            }}
            inputStyle={{ color: "#145da0" }}
            iconColor="#9CA3AF"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <Text
          style={{
            color: "#F3F4F6",
            fontSize: 20,
            fontWeight: "600",
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >
          Recent Activity
        </Text>

        <ScrollView
          style={{ paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {data?.getTransactions?.map((item, index) => (
            <TransactionCard item={item} key={index} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
