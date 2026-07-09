import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://siyu-creativity-api.onrender.com/api/admin"
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("siyu_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("siyu_admin_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
