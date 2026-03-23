// Importamos los datos locales desde tu archivo de mocks
import { mockCourses } from "../mocks/mocks";

const USE_MOCK = true;

// --- FUNCIÓN PARA OBTENER TODOS LOS CURSOS ---
export const getCursos = async () => {
  /*
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
    return cursosMapeados; */

  if (USE_MOCK) {
    console.log("Obteniendo cursos desde MOCK...");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // IMPORTANTE: Devolvemos los campos que tu CursosScreen necesita para filtrar
    return mockCourses.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      duration: item.duration,
      durationHours: item.durationHours || 0, // Para el filtro de <50h, >100h
      level: item.level,
      city: item.city || "Almería", // Para el filtro de ciudad
      image: item.image,
      isEnrolled: false,
    }));
  }
};

// --- FUNCIÓN PARA OBTENER SOLO LOS CURSOS INSCRITOS ---
/*
// --- FUNCIÓN PARA OBTENER SOLO LOS CURSOS INSCRITOS (ejemplo) ---
export const getMisCursos = async (userEmail) => {
  console.log('Obteniendo cursos inscritos (versión mock)...');
  const todosLosCursos = await getCursos();
  return todosLosCursos.filter(c => c.id === 2 || c.id === 4);
*/
export const getMisCursos = async (studentDni) => {
  // En una app real, aquí filtrarías basándote en el perfil del estudiante
  // Por ahora, devolvemos un array vacío o una lógica simple de mock
  const todos = await getCursos();
  return todos.slice(0, 1).map((c) => ({ ...c, isEnrolled: true }));
};

/*
export const getCursosDisponibles = async (userEmail) => {
  const todosLosCursos = await getCursos();
  const misCursos = await getMisCursos(userEmail);
  const misIds = new Set(misCursos.map(c => c.id));
  return todosLosCursos.filter(c => !misIds.has(c.id));
*/
// --- FUNCIÓN PARA OBTENER CURSOS DISPONIBLES (NO INSCRITOS) ---
export const getCursosDisponibles = async (studentDni) => {
  const todos = await getCursos();
  const misCursos = await getMisCursos(studentDni);
  const misIds = new Set(misCursos.map((c) => c.id));

  return todos.filter((c) => !misIds.has(c.id));
};
