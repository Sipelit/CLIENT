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
          backgroundColor: `${item.color}20`,
          padding: 12,
          borderRadius: 12,
          marginRight: 16,
        }}
      >
        <Icon name={item.icon} size={24} color={item.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#051d40", fontSize: 16, fontWeight: "500" }}>
          {item.title}
        </Text>
        <Text style={{ color: "#9CA3AF", fontSize: 14 }}>{item.date}</Text>
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
  );
}
