import { useContext } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function WelcomeScreen() {
  const { userData } = useContext(AuthContext);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>
        Bienvenido {userData?.first_name || ""} {userData?.last_name || ""}
      </Text>
    </View>
  );
}
