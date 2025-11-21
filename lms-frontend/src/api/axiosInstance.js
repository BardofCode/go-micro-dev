import axios from "axios";

// 📌 Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: false, // Not using cookies, using JWT
});

// 🔑 ADD TOKEN TO EVERY REQUEST AUTOMATICALLY
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Read JWT from localStorage

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// ❌ AUTO LOGOUT IF TOKEN EXPIRED OR INVALID
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⛔ Session expired — logging out...");
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
