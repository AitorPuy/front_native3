import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedScreen({ children, role }) {
  const { access, role: userRole, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!access) return null;

  if (role && userRole !== role) return null;

  return children;
}
