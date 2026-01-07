import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function SidebarDrawer({ navigation }) {
  const { userData, role, logout } = useContext(AuthContext);

  return (
    <DrawerContentScrollView>
      <View style={{ padding: 20 }}>
        {userData && (
          <>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {userData.first_name} {userData.last_name}
            </Text>
            <Text>{userData.email}</Text>
          </>
        )}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Inicio")}>
        <Text style={{ padding: 15 }}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Clientes")}>
        <Text style={{ padding: 15 }}>Clientes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Proveedores")}>
        <Text style={{ padding: 15 }}>Proveedores</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Empresas")}>
        <Text style={{ padding: 15 }}>Empresas</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
        <Text style={{ padding: 15 }}>Mi perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Cambiar contraseña")}>
        <Text style={{ padding: 15 }}>Cambiar contraseña</Text>
      </TouchableOpacity>

      {role === "admin" && (
        <TouchableOpacity onPress={() => navigation.navigate("Usuarios")}>
          <Text style={{ padding: 15 }}>Usuarios</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={logout}>
        <Text style={{ padding: 15, color: "red" }}>Salir</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}
