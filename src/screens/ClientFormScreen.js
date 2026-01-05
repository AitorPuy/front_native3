import { useEffect, useState } from "react";
import { Alert, Button, TextInput, View, Text, ScrollView } from "react-native";
import api from "../api/axiosConfig";

export default function ClientFormScreen({ route, navigation }) {
  const clientId = route.params?.id ?? null;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  // Cargar datos si es edición
  useEffect(() => {
    if (clientId) {
      api.get(`/clients/${clientId}/`).then((res) => {
        setName(res.data.name || "");
        setEmail(res.data.email || "");
        setPhone(res.data.phone || "");
      }).catch((err) => {
        Alert.alert("Error", "No se pudieron cargar los datos del cliente");
      });
    }
  }, [clientId]);

  // Validar email si no está vacío
  const isValidEmail = (emailStr) => {
    if (!emailStr || emailStr.trim() === "") return true; // Email es opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr.trim());
  };

  // Validar teléfono (solo números, espacios, guiones, paréntesis y +)
  const isValidPhone = (phoneStr) => {
    if (!phoneStr || phoneStr.trim() === "") return true; // Teléfono es opcional
    const phoneRegex = /^[0-9\s\-+()]+$/;
    return phoneRegex.test(phoneStr.trim());
  };

  async function handleSubmit() {
    setError("");

    // Validación del nombre (requerido)
    if (!name || name.trim() === "") {
      setError("El nombre es obligatorio");
      return;
    }

    // Validación del email
    if (email && email.trim() !== "" && !isValidEmail(email)) {
      setError("El email no tiene un formato válido");
      return;
    }

    // Validación del teléfono
    if (phone && phone.trim() !== "" && !isValidPhone(phone)) {
      setError("El teléfono solo puede contener números, espacios, guiones, paréntesis y el símbolo +");
      return;
    }

    try {
      const data = {
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
      };

      if (clientId) {
        await api.put(`/clients/${clientId}/`, data);
      } else {
        await api.post(`/clients/`, data);
      }

      Alert.alert("Éxito", "Cliente guardado correctamente");
      navigation.goBack();
    } catch (err) {
      console.log("Error al guardar:", err.response?.data);
      
      let errorMessage = "No se pudo guardar el cliente";

      if (err.response && err.response.data) {
        const errorData = err.response.data;

        // Manejar errores de validación del backend
        if (errorData.name && Array.isArray(errorData.name)) {
          errorMessage = `Nombre: ${errorData.name[0]}`;
        } else if (errorData.email && Array.isArray(errorData.email)) {
          errorMessage = `Email: ${errorData.email[0]}`;
        } else if (errorData.phone && Array.isArray(errorData.phone)) {
          errorMessage = `Teléfono: ${errorData.phone[0]}`;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (typeof errorData === "object") {
          // Si hay múltiples errores, mostrar el primero
          const firstError = Object.values(errorData)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        }
      } else if (!err.response) {
        errorMessage = "Error de conexión. Verifica que el backend esté corriendo.";
      }

      setError(errorMessage);
    }
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      {error ? (
        <View style={{ 
          backgroundColor: "#f8d7da", 
          padding: 10, 
          borderRadius: 5, 
          marginBottom: 15,
          borderWidth: 1,
          borderColor: "#f5c6cb"
        }}>
          <Text style={{ color: "#721c24", fontWeight: "bold" }}>{error}</Text>
        </View>
      ) : null}

      <TextInput
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (error) setError(""); // Limpiar error al escribir
        }}
        placeholder="Nombre *"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) setError(""); // Limpiar error al escribir
        }}
        placeholder="Email (opcional)"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          if (error) setError(""); // Limpiar error al escribir
        }}
        placeholder="Teléfono (opcional)"
        keyboardType="phone-pad"
        style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
      />

      <Button title="Guardar" onPress={handleSubmit} />
    </ScrollView>
  );
}
