import axios from "axios";

const API_KEY = "7b7319730a6a40d";
const API_SECRET = "d2cb57ca40248c1";

const client = axios.create({
  baseURL: "https://erp.grupoatu.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `token ${API_KEY}:${API_SECRET}`,
  },
});

export default client;
