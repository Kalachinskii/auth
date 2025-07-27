import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const protectedApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// config - объект header передаваемый на сервер
protectedApi.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  // добавление токена
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    throw new Error("Остановка запроса, нет токена");
  }
  // всегда должен возвращаться config
  return config;
});
