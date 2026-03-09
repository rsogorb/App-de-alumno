import client from '../api/client.js';

// YTODO: Cambiar por una llamada real cuando tengamos el doctype
const MOCK_STUDENT = {
  name: "ALUM-2024-001",
  first_name: "Alex",
  last_name: "Casas",
  program: "Ingeniería de Software",
  image: "https://via.placeholder.com/150"
};

export const getStudentProfile = async () => {
  // SIMULACIÓN: Cuando tengas el doctype, usarás:
  // const response = await client.get('/api/resource/Student/ID_DEL_ALUMNO');
  // return response.data.data;
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_STUDENT), 800); // Simula delay de red
  });
};