import React from "react";
import { View, ScrollView } from "react-native";
import {
  Avatar,
  Card,
  Text,
  Searchbar,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Dashboard() {
  return (
    <View style={{ flex: 1, backgroundColor: "#111827" }}>
      {/* Modern Welcome Section */}
      <View
          style={{
            padding: 24,
            marginBottom: 10,
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
            <Text style={{ color: "#9CA3AF", fontSize: 16, marginBottom: 4 }}>
              Welcome back
            </Text>
            <Text
              style={{
                color: "#F3F4F6",
                fontSize: 28,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              Alexander B.
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#374151",
              padding: 8,
              borderRadius: 50,
            }}
          >
            <Avatar.Image
              size={40}
              source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
            />
          </View>
        </View>
      </View>

      {/* Balance Card with Glassmorphism effect */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Card
          style={{
            backgroundColor: "rgba(55, 65, 81, 0.7)",
            borderRadius: 24,
            padding: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <View>
            <Text style={{ color: "#9CA3AF", fontSize: 16, marginBottom: 8 }}>
              Total Balance
            </Text>
            <Text
              style={{ color: "#F3F4F6", fontSize: 36, fontWeight: "bold" }}
            >
              Rp. 500.000
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 16,
                backgroundColor: "rgba(37, 99, 235, 0.2)",
                padding: 8,
                borderRadius: 12,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ color: "#60A5FA", fontSize: 14 }}>
                070024358 • BCA Card
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Modern Quick Actions */}
      <View style={{ marginBottom: 20 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingLeft: 20 }}
          >
            {[
              { icon: "send", label: "Send" },
              { icon: "credit-card", label: "Card" },
              { icon: "qrcode-scan", label: "Scan" },
              { icon: "swap-horizontal", label: "Exchange" },
              { icon: "dots-horizontal", label: "More" },
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  marginRight: 16,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#374151",
                    padding: 16,
                    borderRadius: 20,
                    marginBottom: 8,
                    width: 60,
                    height: 60,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon name={item.icon} size={24} color="#60A5FA" />
                </View>
                <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

      {/* Modern Search */}
      <View style={{ paddingHorizontal: 20, marginVertical: 20 }}>
          <Searchbar
            placeholder="Search transactions..."
            style={{
              backgroundColor: "#374151",
              borderRadius: 16,
              elevation: 0,
            }}
            inputStyle={{ color: "#F3F4F6" }}
            iconColor="#9CA3AF"
            placeholderTextColor="#9CA3AF"
          />
        </View>

      {/* Transaction History with Modern Cards */}
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            color: "#F3F4F6",
            fontSize: 20,
            fontWeight: "600",
            marginBottom: 16,
          }}
        >
          Recent Activity
        </Text>
        <View showsVerticalScrollIndicator={false}>
          {[
            {
              title: "Fore Margo",
              date: "Today",
              amount: "+Rp. 50.000",
              icon: "coffee",
              color: "#10B981",
            },
            {
              title: "Netflix",
              date: "Yesterday",
              amount: "-Rp. 159.000",
              icon: "television",
              color: "#EF4444",
            },
            {
              title: "Spotify",
              date: "May 3",
              amount: "-Rp. 59.000",
              icon: "music",
              color: "#EF4444",
            },
            {
              title: "Salary",
              date: "May 1",
              amount: "+Rp. 8.500.000",
              icon: "cash",
              color: "#10B981",
            },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#374151",
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: `${item.color}20`,
                  padding: 12,
                  borderRadius: 12,
                  marginRight: 16,
                }}
              >
                <Icon name={item.icon} size={24} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ color: "#F3F4F6", fontSize: 16, fontWeight: "500" }}
                >
                  {item.title}
                </Text>
                <Text style={{ color: "#9CA3AF", fontSize: 14 }}>
                  {item.date}
                </Text>
              </View>
              <Text
                style={{
                  color: item.amount.includes("+") ? "#10B981" : "#EF4444",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {item.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
