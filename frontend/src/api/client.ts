import axios from "axios";

const base =
  (import.meta.env.VITE_API_BASE as string) || "http://localhost:4000";
const api = axios.create({ baseURL: base });

export default api;
