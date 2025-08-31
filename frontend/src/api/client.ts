import axios from "axios";

const base =
  (import.meta.env.VITE_API_BASE as string) || "https://movies-app-wscr.onrender.com/";
const api = axios.create({ baseURL: base });

export default api;
