import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// export const protectedApi = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// protectedApi.interceptors.request.use((config) => {
//   const token = Cookies.get("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   } else {
//     throw new Error("Cancel query. Token is not found");
//   }
//   return config;
// });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "refresh-token"
    ) {
      console.log(222);

      originalRequest._retry = true;
      try {
        await api.get("refresh-token");
        return api(originalRequest);
      } catch (error) {
        console.log(1111111);
        return Promise.reject(error);
      }
    }

    console.log(888888888);

    return Promise.reject(error);
  }
);
