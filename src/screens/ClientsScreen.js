import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import api from "../api/axiosConfig";

export default function ClientsScreen({ navigation }) {
  const [clients, setClients] = useState([]);

  const load = async () => {
    const res = await api.get("/clients/");
    setClients(res.data);
  };

  const remove = (id) => {
    Alert.alert("Confirmar", "¿Eliminar cliente?", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        onPress: async () => {
          await api.delete(`/clients/${id}/`);
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
      <Button title="Nuevo cliente" onPress={() => navigation.navigate("ClientForm")} />

      <Text style={{ fontSize: 20, marginVertical: 10 }}>Clientes</Text>

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
            onPress={() => navigation.navigate("ClientForm", { id: item.id })}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>{item.name}</Text>
            {item.email && <Text style={{ marginBottom: 3 }}>📧 {item.email}</Text>}
            {item.phone && <Text style={{ marginBottom: 5 }}>📱 {item.phone}</Text>}

            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <View style={{ marginRight: 10, flex: 1 }}>
                <Button title="Editar" onPress={() => navigation.navigate("ClientForm", { id: item.id })} />
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
