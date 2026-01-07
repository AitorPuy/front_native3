import { useEffect, useState } from "react";
import { Alert, Button, TextInput, View, Text, ScrollView, Switch } from "react-native";
import api from "../api/axiosConfig";

export default function CompanyFormScreen({ route, navigation }) {
  const companyId = route.params?.id ?? null;
  const [name, setName] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");

  // Cargar lista de empresas para verificar si hay una principal
  useEffect(() => {
    api.get("/companies/").then((res) => {
      setCompanies(res.data);
    }).catch((err) => {
      console.log("Error al cargar empresas:", err);
    });
  }, []);

  // Cargar datos si es edición
  useEffect(() => {
    if (companyId) {
      api.get(`/companies/${companyId}/`).then((res) => {
        setName(res.data.name || "");
        setIsPrimary(res.data.is_primary || false);
      }).catch((err) => {
        Alert.alert("Error", "No se pudieron cargar los datos de la empresa");
      });
    } else {
      // Si es nuevo, verificar si ya hay una empresa principal
      const hasPrimary = companies.some(c => c.is_primary);
      setIsPrimary(!hasPrimary);
    }
  }, [companyId, companies]);

  async function handleSubmit() {
    setError("");

    // Validación del nombre (requerido)
    if (!name || name.trim() === "") {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      const data = {
        name: name.trim(),
        is_primary: isPrimary,
      };

      if (companyId) {
        await api.put(`/companies/${companyId}/`, data);
      } else {
        await api.post(`/companies/`, data);
      }

      Alert.alert("Éxito", "Empresa guardada correctamente");
      navigation.goBack();
    } catch (err) {
      console.log("Error al guardar:", err.response?.data);
      
      let errorMessage = "No se pudo guardar la empresa";

      if (err.response && err.response.data) {
        const errorData = err.response.data;

        // Manejar errores de validación del backend
        if (errorData.name && Array.isArray(errorData.name)) {
          errorMessage = `Nombre: ${errorData.name[0]}`;
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
        style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
      />

      <View style={{ 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#f5f5f5",
        borderRadius: 5
      }}>
        <Text style={{ fontSize: 16 }}>Marcar como empresa principal</Text>
        <Switch
          value={isPrimary}
          onValueChange={(value) => {
            if (!companyId && companies.some(c => c.is_primary)) {
              Alert.alert(
                "Información",
                "Ya existe una empresa principal. Edítala para cambiar."
              );
              return;
            }
            setIsPrimary(value);
          }}
          disabled={!companyId && companies.some(c => c.is_primary)}
        />
      </View>

      <Button title="Guardar" onPress={handleSubmit} />
    </ScrollView>
  );
}
