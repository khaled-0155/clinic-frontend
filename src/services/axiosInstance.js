import axios from "axios";

// Fallback if env not set
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach Access Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 🚨 Global 401 handler
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // if (error.response?.status === 401) {
    //   localStorage.removeItem("accessToken");
    //   localStorage.removeItem("refreshToken");
    //   window.location.href = "/login";
    // }

    return Promise.reject(error);
  },
);

// Generic request wrapper
export const apiRequest = async (config) => {
  const response = await axiosInstance(config);
  return response.data;
};

export default axiosInstance;
