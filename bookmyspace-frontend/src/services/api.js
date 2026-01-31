import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5203/api",
});

export default API;