// src/services/cursosServices.js
// Ahora usa el cliente de axios configurado para conectarse a Frappe

// Importamos el cliente que ya tiene las claves y la URL base
import client from '../api/client';

// --- FUNCIÓN PARA OBTENER TODOS LOS CURSOS ---
export const getCursos = async () => {
  console.log('Obteniendo cursos desde Frappe...');
  try {
    // Hacemos la petición GET a la API de Frappe para el recurso "Curso"
    // La URL completa será: baseURL + '/api/resource/Curso'
    const response = await client.get('/api/resource/Curso?fields=["*"]');;

    // Frappe devuelve los datos dentro de response.data.data (sí, dos veces "data")
    // Normalmente la lista de cursos está en response.data.data
    const cursosFrappe = response.data.data || [];

    const cursosMapeados = cursosFrappe.map((item) => {
  // Extraemos los valores de los campos link
  // Pueden venir como string (el nombre) o como objeto { name: "..." }
  const familia = typeof item.familia_formativa === 'object' 
    ? item.familia_formativa?.name 
    : item.familia_formativa;
  
  const area = typeof item.area_profesional === 'object' 
    ? item.area_profesional?.name 
    : item.area_profesional;

  console.log('ITEM COMPLETO:', JSON.stringify(item, null, 2));

  return {
    id: item.name,
    nombre: item.nombre || 'Sin nombre',
    descripcion: `Familia: ${familia || 'No especificada'} | Área: ${area || 'No especificada'}`,
    duracion: item.horas ? `${item.horas} horas` : 'Duración no especificada',
    nivel: item.nivel || 'Básico',
    imagen: 'https://via.placeholder.com/300x200?text=Curso',
    // Guardamos también los valores originales por si los necesitas
    familiaFormativa: familia,
    areaProfesional: area,
    inscrito: false,
  };
});

    console.log(`Se obtuvieron ${cursosMapeados.length} cursos`);
    return cursosMapeados;

  } catch (error) {
    console.error('Error detallado al obtener cursos:', error);
    // Lanzamos el error para que la pantalla lo capture y muestre el mensaje
    throw new Error('No se pudieron cargar los cursos desde el servidor');
  }
};

// --- FUNCIÓN PARA OBTENER SOLO LOS CURSOS INSCRITOS (ejemplo) ---
// Esta función requiere que el backend pueda filtrar o que tú tengas una lista de IDs inscritos.
// Por ahora, la dejaremos basada en el mock, pero luego la ajustaremos.
export const getMisCursos = async (userEmail) => {
  // --- VERSIÓN MOCK (mientras no tengas la lógica real) ---
  console.log('Obteniendo cursos inscritos (versión mock)...');
  // Simulamos que el usuario está inscrito en los cursos con id 2 y 4
  const todosLosCursos = await getCursos(); // Esto ya iría a la API
  return todosLosCursos.filter(c => c.id === 2 || c.id === 4);
  
  // --- VERSIÓN REAL (cuando tengas la relación) ---
  // Ejemplo: llamar a un endpoint personalizado de Frappe que te dé los cursos del alumno
  // const response = await client.get(`/api/method/tu_app.api.get_mis_cursos?alumno=${userEmail}`);
  // return response.data.message;
};

// --- FUNCIÓN PARA OBTENER CURSOS DISPONIBLES (NO INSCRITOS) ---
export const getCursosDisponibles = async (userEmail) => {
  // Similar a la anterior, lógica mock
  const todosLosCursos = await getCursos();
  const misCursos = await getMisCursos(userEmail);
  const misIds = new Set(misCursos.map(c => c.id));
  return todosLosCursos.filter(c => !misIds.has(c.id));
};