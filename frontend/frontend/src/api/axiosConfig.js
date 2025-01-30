import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://e50c-46-193-56-215.ngrok-free.app/api", // URL du backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
