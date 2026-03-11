// src/services/cursosServices.js
// Ahora usa el cliente de axios configurado para conectarse a Frappe

// Importamos el cliente que ya tiene las claves y la URL base
import client from '../api/client';

// --- FUNCIÓN PARA OBTENER TODOS LOS CURSOS ---
export const getCursos = async () => {
  console.log('Obteniendo cursos desde Frappe...');
  try {
    // Construimos la URL con los parámetros directamente
    const url = '/api/resource/Curso?fields=["*"]&limit_page_length=1000';
    const response = await client.get(url);

    const cursosFrappe = response.data.data || [];

    const cursosMapeados = cursosFrappe.map((item) => {
      console.log('Campos disponibles:', Object.keys(item));
      
      const familia = typeof item.familia_formativa === 'object' 
        ? item.familia_formativa?.name 
        : item.familia_formativa;
      
      const area = typeof item.area_profesional === 'object' 
        ? item.area_profesional?.name 
        : item.area_profesional;

      return {
        id: item.name,
        nombre: item.nombre || 'Sin nombre',
        descripcion: `Familia: ${familia || 'No especificada'} | Área: ${area || 'No especificada'}`,
        duracion: item.horas ? `${item.horas} horas` : 'Duración no especificada',
        nivel: item.nivel || 'Básico',
        imagen: 'https://via.placeholder.com/300x200?text=Curso',
        familiaFormativa: familia,
        areaProfesional: area,
        inscrito: false,
      };
    });

    console.log(`Se obtuvieron ${cursosMapeados.length} cursos`);
    return cursosMapeados;

  } catch (error) {
    console.error('Error detallado al obtener cursos:', error);
    throw new Error('No se pudieron cargar los cursos desde el servidor');
  }
};

// --- FUNCIÓN PARA OBTENER SOLO LOS CURSOS INSCRITOS (ejemplo) ---
export const getMisCursos = async (userEmail) => {
  console.log('Obteniendo cursos inscritos (versión mock)...');
  const todosLosCursos = await getCursos();
  return todosLosCursos.filter(c => c.id === 2 || c.id === 4);
};

// --- FUNCIÓN PARA OBTENER CURSOS DISPONIBLES (NO INSCRITOS) ---
export const getCursosDisponibles = async (userEmail) => {
  const todosLosCursos = await getCursos();
  const misCursos = await getMisCursos(userEmail);
  const misIds = new Set(misCursos.map(c => c.id));
  return todosLosCursos.filter(c => !misIds.has(c.id));
};