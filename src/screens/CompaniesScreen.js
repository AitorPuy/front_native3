import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import api from "../api/axiosConfig";

export default function CompaniesScreen({ navigation }) {
  const [companies, setCompanies] = useState([]);

  const load = async () => {
    const res = await api.get("/companies/");
    setCompanies(res.data);
  };

  const remove = (id) => {
    Alert.alert("Confirmar", "¿Eliminar empresa?", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        onPress: async () => {
          await api.delete(`/companies/${id}/`);
          load();
        },
      },
    ]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ padding: 20 }}>
      <Button title="Nueva empresa" onPress={() => navigation.navigate("CompanyForm")} />

      <Text style={{ fontSize: 20, marginVertical: 10 }}>Empresas</Text>

      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
            onPress={() => navigation.navigate("CompanyForm", { id: item.id })}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", flex: 1 }}>{item.name}</Text>
              {item.is_primary && (
                <View style={{ 
                  backgroundColor: "#007bff", 
                  paddingHorizontal: 8, 
                  paddingVertical: 4, 
                  borderRadius: 4,
                  marginLeft: 10
                }}>
                  <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>Principal</Text>
                </View>
              )}
            </View>

            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <View style={{ marginRight: 10, flex: 1 }}>
                <Button title="Editar" onPress={() => navigation.navigate("CompanyForm", { id: item.id })} />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Eliminar" color="red" onPress={() => remove(item.id)} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
