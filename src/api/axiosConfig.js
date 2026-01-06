import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// REQUEST
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// REFRESH
let isRefreshing = false;
let requests = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // No intentar refrescar tokens en el endpoint de login
    if (original.url && original.url.includes("/accounts/token/") && !original.url.includes("/refresh/")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refresh = await SecureStore.getItemAsync("refresh");

          if (!refresh) {
            // No hay refresh token, rechazar directamente
            await SecureStore.deleteItemAsync("access");
            await SecureStore.deleteItemAsync("refresh");
            isRefreshing = false;
            return Promise.reject(error);
          }

          const res = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URL}/accounts/token/refresh/`,
            { refresh }
          );

          const newToken = res.data.access;

          await SecureStore.setItemAsync("access", newToken);

          requests.forEach((cb) => cb(newToken));
          requests = [];
        } catch (e) {
          await SecureStore.deleteItemAsync("access");
          await SecureStore.deleteItemAsync("refresh");
          requests.forEach((cb) => cb(null));
          requests = [];
          isRefreshing = false;
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        requests.push((token) => {
          if (token) {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          } else {
            reject(error);
          }
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
