import axios from "axios";

// Vite uses import.meta.env
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = 'http://localhost:5000/api';

// create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

export default api;