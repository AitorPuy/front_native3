import { useEffect, useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import api from "../api/axiosConfig";

export default function ClientFormScreen({ route, navigation }) {
  const clientId = route.params?.id ?? null;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Cargar datos si es edición
  useEffect(() => {
    if (clientId) {
      api.get(`/clients/${clientId}/`).then((res) => {
        setName(res.data.name || "");
        setEmail(res.data.email || "");
        setPhone(res.data.phone || "");
      });
    }
  }, [clientId]);

  async function handleSubmit() {
    try {
      const data = {
        name,
        email: email || null,
        phone: phone || null,
      };

      if (clientId) {
        await api.put(`/clients/${clientId}/`, data);
      } else {
        await api.post(`/clients/`, data);
      }

      Alert.alert("OK", "Guardado");
      navigation.goBack();
    } catch (err) {
      console.log("Error al guardar:", err.response?.data);
      Alert.alert("Error", "No se pudo guardar");
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nombre *"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
      />

      <Button title="Guardar" onPress={handleSubmit} />
    </View>
  );
}
