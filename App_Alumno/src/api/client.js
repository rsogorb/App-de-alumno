import axios from "axios";

const API_KEY = "0ef03c188374bc8";
const API_SECRET = "7d4dd3caa0553ef";

const client = axios.create({
  baseURL: "https://erp.grupoatu.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `token ${API_KEY}:${API_SECRET}`,
  },
});

export default client;
