import { useNavigation } from "@react-navigation/core";
import { Touchable, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function TransactionCard({ item, navigation }) {
  const navigate = useNavigation().navigate;

  const createdAt = item?.createdAt;
  const formattedDate = createdAt
    ? new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(new Date(createdAt))
    : "";

  const categoryIcons = {
    Shopping: "shopping",
    Food: "food",
    Transport: "train",
    Healthcare: "medical-bag",
    Entertainment: "gamepad-variant",
    Other: "dots-horizontal-circle",
  };

  const handlePress = () => {
    navigate("ReceiptScreen", {
      transactionId: item._id,
    });
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={handlePress}
    >
      <View
        style={{
          backgroundColor: `#10B98120`,
          padding: 12,
          borderRadius: 12,
          marginRight: 16,
        }}
      >
        <Icon
          name={categoryIcons[item.category] || "dots-horizontal-circle"}
          size={24}
          color={"#10B981"}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#051d40", fontSize: 16, fontWeight: "500" }}>
          {item.name}
        </Text>
        <Text style={{ color: "#9CA3AF", fontSize: 14 }}>{formattedDate}</Text>
      </View>
      <Text
        style={{
          color: "#10B981",
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        {Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(item.totalPrice)}
      </Text>
    </TouchableOpacity>
  );
}
