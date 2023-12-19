import axios from "axios";
import { apiUrl, tokenKey } from ".";

export const init = () => {
  axios.defaults.baseURL = apiUrl;
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem(tokenKey);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
};
