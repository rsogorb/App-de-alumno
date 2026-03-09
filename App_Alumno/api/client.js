import axios from 'axios';

const apiClient = axios.create({
    //TODO: Cambiar la URL base a la del backend
  baseURL: 'http://localhost:8080/api', 
  headers: {
    'Content-Type': 'application/json',
  },
}); 

export const setAuthToken = (apiKey, apiSecret) => {
    const token = btoa(`${apiKey}:${apiSecret}`);   
    apiClient.defaults.headers.common['Authorization'] = `token ${apiKey}:${apiSecret}`;
};

export default apiClient;