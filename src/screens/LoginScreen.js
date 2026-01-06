import { useContext, useState } from "react";
import { Button, Text, TextInput, View, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Validar formato de email
  const isValidEmail = (emailStr) => {
    if (!emailStr || emailStr.trim() === "") return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr.trim());
  };

  const submit = async () => {
    setError("");

    // Validación del email
    if (!email || email.trim() === "") {
      setError("El email es obligatorio");
      return;
    }

    if (!isValidEmail(email)) {
      setError("El email no tiene un formato válido");
      return;
    }

    // Validación de la contraseña
    if (!password || password.trim() === "") {
      setError("La contraseña es obligatoria");
      return;
    }

    try {
      await login(email.trim(), password);
      // La navegación se maneja automáticamente por AppNavigator basándose en el estado access
    } catch (err) {
      let errorMessage = "Error al iniciar sesión";
      
      if (!err.response) {
        if (err.message?.includes("Network Error") || err.code === "NETWORK_ERROR") {
          errorMessage = "Error de conexión. Verifica que el backend esté corriendo y la URL de la API sea correcta";
        } else {
          errorMessage = `Error de red: ${err.message || "Desconocido"}`;
        }
      } else if (err.response.status === 401) {
        // El backend ahora devuelve mensajes específicos
        const errorData = err.response.data;
        
        if (errorData.detail) {
          // detail puede ser string o array
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail[0] || "Email o contraseña incorrectos";
          } else {
            errorMessage = errorData.detail;
          }
        } else {
          errorMessage = "Email o contraseña incorrectos";
        }
      } else if (err.response.status === 404) {
        errorMessage = "Endpoint no encontrado. Verifica la configuración de la API";
      } else if (err.response.status === 400) {
        // Errores de validación del backend
        const errorData = err.response.data;
        if (errorData.email && Array.isArray(errorData.email)) {
          errorMessage = `Email: ${errorData.email[0]}`;
        } else if (errorData.password && Array.isArray(errorData.password)) {
          errorMessage = `Contraseña: ${errorData.password[0]}`;
        } else if (errorData.detail) {
          errorMessage = Array.isArray(errorData.detail) ? errorData.detail[0] : errorData.detail;
        } else if (typeof errorData === "object") {
          const firstError = Object.values(errorData)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        } else {
          errorMessage = "Datos inválidos";
        }
      } else if (err.response.status >= 500) {
        errorMessage = `Error del servidor (${err.response.status})`;
      } else {
        errorMessage = `Error ${err.response.status}: ${JSON.stringify(err.response.data)}`;
      }
      
      setError(errorMessage);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Login</Text>

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
        placeholder="Email *"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) setError(""); // Limpiar error al escribir
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5
        }}
      />

      <TextInput
        placeholder="Contraseña *"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (error) setError(""); // Limpiar error al escribir
        }}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
          borderRadius: 5
        }}
      />

      <Button title="Entrar" onPress={submit} />
      <View style={{ height: 15 }} />
      <Button title="Registrarse" onPress={() => navigation.navigate("Register")} />
    </ScrollView>
  );
}
