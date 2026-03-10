import axios from 'axios';

const client = axios.create({
  baseURL: 'https://erppreprod.grupoatu.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const API_KEY = '53ebb6646f83156';
const API_SECRET = 'c7479f00840588a';

client.defaults.headers.common['Authorization'] = `token ${API_KEY}:${API_SECRET}`;

export default client;