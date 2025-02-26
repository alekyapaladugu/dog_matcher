import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://frontend-take-home-service.fetch.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default apiClient;
