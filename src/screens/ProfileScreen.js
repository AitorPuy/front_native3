import { useContext } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen() {
  const { userData } = useContext(AuthContext);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Mi Perfil</Text>

      <Text style={{ marginTop: 10 }}>
        Nombre: {userData?.first_name} {userData?.last_name}
      </Text>
      <Text>Email: {userData?.email}</Text>
      <Text>Rol: {userData?.role}</Text>
    </View>
  );
}
