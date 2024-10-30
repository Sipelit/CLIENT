import { View } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function TransactionCard(props) {
  const item = props.item;

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: `#10B98120`,
          padding: 12,
          borderRadius: 12,
          marginRight: 16,
        }}
      >
        <Icon name={"coffee"} size={24} color={"#10B981"} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#051d40", fontSize: 16, fontWeight: "500" }}>
          {item.name}
        </Text>
        <Text style={{ color: "#9CA3AF", fontSize: 14 }}>
          {item.createdAt.slice(0, 10)}
        </Text>
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
    </View>
  );
}
