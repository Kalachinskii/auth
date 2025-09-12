import axios from "axios";

// создаём экземпляр клиента axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // т.к. токен храним в куках - прикладываем куки к каждому запросу
  withCredentials: true,
});

// любой ответ от сервера перехватываеться
api.interceptors.response.use(
  // если всё ок то пропускаем
  (response) => response,
  // если с сервера пришла ошибка от отработай этот блок
  async (error) => {
    // копируем конфигурацию исходного запроса например есть ли доступ к главнйо стр
    const originalRequest = error.config;

    if (
      // если ошибка связана с авторизацией === 401
      error.response.status === 401 &&
      // небыло перезапроса
      !originalRequest._retry &&
      // запрос на refresh-token есле еще небыло запроса
      originalRequest.url !== "refresh-token"
    ) {
      // реализовываем перезапрос на refresh-token
      originalRequest._retry = true;
      try {
        await api.get("refresh-token");
        return api(originalRequest);
      } catch (error) {
        // если не смогли зделать refresh-token
        return Promise.reject(error);
      }
    }
    // если это не 401(не связана с авторизацией) то верни сообщение об ошибке
    return Promise.reject(error);
  }
);
