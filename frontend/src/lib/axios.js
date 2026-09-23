import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_URL;


const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // allow sending/receiving cookies across origins
  headers: {
    Accept: "application/json",
  },
});


export default instance;