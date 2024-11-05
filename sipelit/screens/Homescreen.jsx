import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { View, ScrollView, Image, TouchableOpacity } from "react-native";
import {
  Avatar,
  Card,
  Text,
  Searchbar,
  Surface,
  Divider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TransactionCard from "../components/TransactionCard";
import { useLazyQuery, useQuery } from "@apollo/client";
import { getTransactions, searchByName } from "../apollo/transactionQuery";
import * as SecureStore from "expo-secure-store";
import * as MediaLibrary from "expo-media-library";
import { AuthContext } from "../contexts/authContext";
import { getUserById } from "../apollo/userQuery";
import { useFocusEffect } from "@react-navigation/core";

export function HomeScreen({ navigation }) {
  const [input, setInput] = useState("");

  const { isLoggedIn, setIsLoggedIn, currentUser } = useContext(AuthContext);
  const [fetchData, { data, error, loading, refetch }] = useLazyQuery(
    getTransactions,
    {
      fetchPolicy: "network-only",
      nextFetchPolicy: "network-only",
    }
  );

  const { data: user } = useQuery(getUserById, {
    variables: {
      id: currentUser._id,
    },
  });

  const [total, setTotal] = useState(0);
  const [status, requestPermission] = MediaLibrary.usePermissions(true);
  const [requestPermissions, setRequestPermissions] = useState(true);

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
    setRequestPermissions(true);
    setIsLoggedIn(false);
    navigation.navigate("LoginScreen");
  };

  useFocusEffect(
    useCallback(() => {
      calculateTotal();
      refetch();
    }, [data])
  );

  useEffect(() => {
    fetchData({
      variables: {
        userId: currentUser._id,
        name: input,
      },
    });
  }, [input, isLoggedIn, data]);

  useEffect(() => {
    if (status === null) {
      requestPermission({ accessPrivileges: "limited" });
      setRequestPermissions(false);
    }
  }, [requestPermissions]);

  const navigateToCreateScreen = () => {
    navigation.navigate("CreateTransactionScreen");
  };
  const navigateToOcrScreen = () => {
    navigation.navigate("OCRScreen");
  };

  const formatCurrency = (amount) => {
    const formatted = Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);

    const [main, cents] = formatted.split(",");

    return (
      <Text>
        <Text style={{ color: "#145da0", fontSize: 36, fontWeight: "bold" }}>
          {main}
        </Text>
        <Text style={{ color: "#145da0", fontSize: 26, fontWeight: "bold" }}>
          {cents ? `,${cents}` : ""}
        </Text>
      </Text>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#145da0" }}>
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 12,
          marginTop: 18,
        }}
      >
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
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 8 }}>
              <Icon name="exit-to-app" size={26} color="#bd2024" />
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
                style={{ width: 100, height: 30, marginTop: 2 }}
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
                  Quick and Easy Bill Sharing
                </Text>
              </Surface>
            </View>
            <Divider
              style={{ backgroundColor: "#145da0", marginVertical: 16 }}
            />
            <Text style={{ color: "#145da0", fontSize: 16 }}>
              Total Transactions
            </Text>
            {formatCurrency(total)}
          </View>
        </Card>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#F3F4F6",
            marginBottom: 12,
            paddingHorizontal: 20,
          }}
        >
          Quick Actions
        </Text>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            gap: 12,
          }}
        >
          {[
            {
              icon: "plus-circle",
              label: "Create Transaction",
              action: navigateToCreateScreen,
            },
            {
              icon: "qrcode-scan",
              label: "Scan Receipt",
              action: navigateToOcrScreen,
            },
          ].map((item, index) => (
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                backgroundColor: "#ffffff",
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,
                elevation: 4,
              }}
              onPress={item.action}
              key={index}
            >
              <View
                style={{
                  backgroundColor: "#E6F0FF",
                  borderRadius: 12,
                  padding: 8,
                  marginRight: 7,
                }}
              >
                <Icon name={item.icon} size={22} color="#145da0" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#145da0",
                  }}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: "#6B7280",
                    marginTop: 4,
                  }}
                  numberOfLines={1}
                >
                  {index === 0 ? "Split bills easily" : "Scan or import image"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
            iconColor="#145da0"
            placeholderTextColor="#145da0"
            onChangeText={(text) => setInput(text)}
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
