import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useState } from "react";
import api from "../api/axiosConfig";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    const storedAccess = await SecureStore.getItemAsync("access");
    const storedRefresh = await SecureStore.getItemAsync("refresh");
    const storedRole = await SecureStore.getItemAsync("role");
    const storedEmail = await SecureStore.getItemAsync("email");

    if (storedAccess) setAccess(storedAccess);
    if (storedRefresh) setRefresh(storedRefresh);
    if (storedRole) setRole(storedRole);
    if (storedEmail) setEmail(storedEmail);

    setLoading(false);
  };

  const saveTokens = async (accessToken, refreshToken, roleValue, emailValue) => {
    setAccess(accessToken);
    setRefresh(refreshToken);
    setRole(roleValue);
    setEmail(emailValue);

    await SecureStore.setItemAsync("access", accessToken);
    await SecureStore.setItemAsync("refresh", refreshToken);
    await SecureStore.setItemAsync("role", roleValue);
    await SecureStore.setItemAsync("email", emailValue);
  };

  const login = async (email, password) => {
    const res = await api.post("/accounts/token/", { email, password });

    const accessToken = res.data.access;
    const refreshToken = res.data.refresh;

    const payload = JSON.parse(atob(accessToken.split(".")[1]));

    await saveTokens(accessToken, refreshToken, payload.role, payload.email);

    const me = await api.get("/accounts/me/");
    setUserData(me.data);
  };

  const logout = async () => {
    setAccess(null);
    setRefresh(null);
    setRole(null);
    setEmail(null);
    setUserData(null);

    await SecureStore.deleteItemAsync("access");
    await SecureStore.deleteItemAsync("refresh");
    await SecureStore.deleteItemAsync("role");
    await SecureStore.deleteItemAsync("email");
  };

  const value = {
    access,
    refresh,
    role,
    email,
    userData,
    loading,
    login,
    logout,
    setUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
