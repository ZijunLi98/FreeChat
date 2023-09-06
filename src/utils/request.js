import axios from "axios";
import config from "../config/config";

const service = axios.create({
  baseURL: config.apiAddress,
  timeout: 20000,
});

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
