import client from '../api/client';

// Flag para alternar entre mock y API real
const USE_MOCK = false; // false = usar API real

// Datos mock (por si acaso, para pruebas)
const mockCourses = [
  {
    id: "C001",
    name: "Excel Avanzado para Finanzas",
    description: "Excel Avanzado para Finanzas - Familia: Administración - Área: Ofimática",
    duration: "40 horas",
    level: "Avanzado",
    image: "https://via.placeholder.com/300x200?text=Excel",
    city: "Almería",
    centro: "Calle LEGIÓN ESPAÑOLA, 17 bajo",
    provincia: "Almería",
    familiaFormativa: "Administración",
    areaProfesional: "Ofimática",
  },
];

// Función para obtener cursos desde la API real
const getCursosFromAPI = async () => {
  console.log('Obteniendo cursos desde API real...');
  
  try {
    const response = await client.get('/api/resource/Course?fields=["*"]&limit_page_length=1000');
    const cursosFrappe = response.data.data || [];
    
    console.log(`✅ Se obtuvieron ${cursosFrappe.length} cursos`);
    
    const cursosMapeados = cursosFrappe.map(item => ({
      id: item.name,
      // Nombre del curso: usamos course_name o el código si no hay
      name: item.course_name || item.name || 'Sin nombre',
      // Descripción: usamos la descripción real o combinamos campos
      description: item.description || `${item.custom_familia_formativa || ''} | ${item.custom_area_profesional || ''}`,
      // Duración: usamos hours (viene como string)
      duration: item.hours ? `${item.hours} horas` : 'Duración no especificada',
      // Nivel: no tenemos campo específico, usamos duración como referencia
      level: item.hours ? (parseInt(item.hours) > 100 ? 'Avanzado' : parseInt(item.hours) > 50 ? 'Intermedio' : 'Básico') : 'Básico',
      // Imagen por defecto
      image: 'https://via.placeholder.com/300x200?text=Curso',
      // Campos para filtros
      city: item.custom_pronvincia || item.comunidad_autonoma || 'Online',
      centro: item.custom_company || item.center || item.centro || 'Centro no especificado',
      provincia: item.custom_pronvincia || item.comunidad_autonoma || 'Provincia no especificada',
      familiaFormativa: item.custom_familia_formativa || 'Familia no especificada',
      areaProfesional: item.custom_area_profesional || 'Área no especificada',
      // Guardamos campos útiles adicionales
      especialidad: item.custom_especialidad,
      modalidad: item.custom_modalidad,
      totalEstudiantes: item.custom_total_de_estudiantes,
      startDate: item.start_date,
      endDate: item.end_date,
      durationHours: parseInt(item.hours) || 0,
    }));
    
    // Mostrar algunos ejemplos para verificar
    if (cursosMapeados.length > 0) {
      console.log('📋 Ejemplo de curso mapeado:', {
        nombre: cursosMapeados[0].name,
        familia: cursosMapeados[0].familiaFormativa,
        area: cursosMapeados[0].areaProfesional,
        provincia: cursosMapeados[0].provincia,
        duracion: cursosMapeados[0].duration,
      });
    }
    
    return cursosMapeados;
    
  } catch (error) {
    console.error('Error al obtener cursos desde API:', error);
    console.error('Detalle:', error.response?.data || error.message);
    throw new Error('No se pudieron cargar los cursos desde el servidor');
  }
};

// Función principal getCursos
export const getCursos = async () => {
  if (USE_MOCK) {
    console.log('Usando datos MOCK...');
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCourses.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      duration: item.duration,
      level: item.level,
      image: item.image,
      city: item.city,
      centro: item.centro,
      provincia: item.provincia,
      familiaFormativa: item.familiaFormativa,
      areaProfesional: item.areaProfesional,
      durationHours: 0,
      isEnrolled: false,
    }));
  } else {
    return await getCursosFromAPI();
  }
};

// Funciones auxiliares
export const getMisCursos = async () => {
  const todos = await getCursos();
  // Por ahora, simulamos que el usuario está inscrito en los primeros 2 cursos
  return todos.slice(0, 2);
};

export const getCursosDisponibles = async () => {
  const todos = await getCursos();
  const misCursos = await getMisCursos();
  const misIds = new Set(misCursos.map(c => c.id));
  return todos.filter(c => !misIds.has(c.id));
};

export const getProvincias = async () => {
  const cursos = await getCursos();
  const provincias = [...new Set(cursos.map(c => c.provincia).filter(p => p && p !== 'Provincia no especificada'))];
  return ['Todas', ...provincias.sort()];
};

export const getFamilias = async () => {
  const cursos = await getCursos();
  const familias = [...new Set(cursos.map(c => c.familiaFormativa).filter(f => f && f !== 'Familia no especificada'))];
  return ['Todas', ...familias.sort()];
};

export const getAreas = async () => {
  const cursos = await getCursos();
  const areas = [...new Set(cursos.map(c => c.areaProfesional).filter(a => a && a !== 'Área no especificada'))];
  return ['Todas', ...areas.sort()];
};