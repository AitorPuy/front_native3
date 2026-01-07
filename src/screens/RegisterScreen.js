import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import api from "../api/axiosConfig";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const submit = async () => {
    if (password !== password2) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      await api.post("/accounts/register/", {
        email,
        password,
        password2
      });

      Alert.alert("OK", "Registro completado.");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Error", "Error en el registro");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Registro</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Repite Password"
        secureTextEntry
        value={password2}
        onChangeText={setPassword2}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Button title="Crear cuenta" onPress={submit} />
    </View>
  );
}
