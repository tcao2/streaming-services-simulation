import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

// Automatically get the token from Cookies if available
instance.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = Cookies.get("access_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
