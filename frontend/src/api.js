import axios from "axios";
// creer une instance d'axios avec une configuration de base pour les requêtes API
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
// fonction pour récupérer le token CSRF depuis le backend
export const fetchCsrfToken = () => api.get("/csrf-token");

export default api;
