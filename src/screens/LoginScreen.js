import { useContext, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      console.log("Intentando login con:", { email });
      console.log("API URL configurada:", process.env.EXPO_PUBLIC_API_URL);
      await login(email, password);
      // La navegación se maneja automáticamente por AppNavigator basándose en el estado access
    } catch (err) {
      console.log("=== ERROR DE LOGIN ===");
      console.log("Error completo:", err);
      console.log("Response data:", err.response?.data);
      console.log("Response status:", err.response?.status);
      console.log("Request URL:", err.config?.url);
      console.log("Base URL:", process.env.EXPO_PUBLIC_API_URL);
      console.log("====================");
      
      let errorMessage = "Error al iniciar sesión";
      
      if (!err.response) {
        if (err.message?.includes("Network Error") || err.code === "NETWORK_ERROR") {
          errorMessage = "Error de conexión. Verifica:\n- Que el backend esté corriendo\n- Que la URL de la API sea correcta\n- Que no haya problemas de red";
        } else {
          errorMessage = `Error de red: ${err.message || "Desconocido"}`;
        }
      } else if (err.response.status === 401) {
        errorMessage = "Email o contraseña incorrectos";
      } else if (err.response.status === 404) {
        errorMessage = `Endpoint no encontrado (404).\nURL: ${err.config?.baseURL}${err.config?.url}`;
      } else if (err.response.status >= 500) {
        errorMessage = `Error del servidor (${err.response.status})`;
      } else {
        errorMessage = `Error ${err.response.status}: ${JSON.stringify(err.response.data)}`;
      }
      
      Alert.alert("Error de Login", errorMessage);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10
        }}
      />

      <Button title="Entrar" onPress={submit} />
      <View style={{ height: 15 }} />
      <Button title="Registrarse" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}
