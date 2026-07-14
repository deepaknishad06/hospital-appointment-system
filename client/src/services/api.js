import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://hospital-appointment-system-xt44.onrender.com/";

const authAxios = axios.create({
  baseURL: API_BASE,
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("hospital_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { API_BASE, authAxios };
