import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import api from "../api/axiosConfig";

export default function ChangePasswordScreen() {
  const [current, setCurrent] = useState("");
  const [new1, setNew1] = useState("");
  const [new2, setNew2] = useState("");

  const submit = async () => {
    if (new1 !== new2) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      await api.post("/accounts/me/change-password/", {
        current_password: current,
        new_password: new1,
        new_password2: new2,
      });

      Alert.alert("OK", "Contraseña actualizada");
    } catch {
      Alert.alert("Error", "No se pudo cambiar la contraseña");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Cambiar contraseña
      </Text>

      <TextInput
        placeholder="Actual"
        secureTextEntry
        value={current}
        onChangeText={setCurrent}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Nueva"
        secureTextEntry
        value={new1}
        onChangeText={setNew1}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Repite nueva"
        secureTextEntry
        value={new2}
        onChangeText={setNew2}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Button title="Actualizar" onPress={submit} />
    </View>
  );
}
