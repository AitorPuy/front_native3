import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import api from "../api/axiosConfig";

export default function UsersScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/accounts/users/");
    setUsers(res.data);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Usuarios</Text>

      <FlatList
        data={users}
        keyExtractor={(x) => x.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 5 }}>
            {item.email} ({item.role})
          </Text>
        )}
      />
    </View>
  );
}
