import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import api from "../api/axiosConfig";

export default function ProvidersScreen() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/providers/");
    setItems(res.data);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Proveedores</Text>

      <FlatList
        data={items}
        keyExtractor={(x) => x.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 5 }}>{item.name}</Text>
        )}
      />
    </View>
  );
}
