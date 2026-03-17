import { mockStudents } from "../mocks/mocks";

/**
 * Obtiene el perfil del estudiante desde los Mocks locales
 */
export const getStudentProfile = async (dni) => {
  try {
    /*
    const res = await client.get(`api/resource/Student/${dni}`)

    const data = res.data.data
    */

    // 1. Limpiamos el DNI recibido para evitar errores de formato
    const cleanDni = dni.trim().toUpperCase();
    console.log("--- Buscando en Mock con DNI:", cleanDni);

    // Simulamos latencia de red (500ms)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 2. Buscamos al estudiante en el array de mocks
    const studentData = mockStudents.find(
      (s) =>
        s.dni.trim().toUpperCase() === cleanDni ||
        s.name.trim().toUpperCase() === cleanDni,
    );

    // Si no existe, lanzamos error en consola y devolvemos null
    if (!studentData) {
      console.error(
        `Estudiante ${cleanDni} no encontrado. Disponibles:`,
        mockStudents.map((s) => s.dni),
      );
      return null;
    }

    // 3. Retornamos el objeto mapeado exactamente como lo pide ProfileScreen.js
    return {
      /*
      id: data.name,
      nombrePila: data.first_name,
      nombreCompleto: data.student_name,
      apellido: data.last_name,
      dni: data.dni,
      status: data.enabled === 1 ? 'Habilitado' : 'Inactivo', 
      diaIngreso: data.joining_date,
      fichaCliente: data.customer,
      fechaNacimiento: data.date_of_birth,
      genero: data.gender,
      nacionalidad: data.nationality,
      discapacidad: data.disability,
      correoElectronico: data.student_email_id,
      telefono: data.student_mobile_number,
      situacion: data.custom_situation,
      foto: data.image ? `https://erppreprod.grupoatu.com${data.image}` : null,
      */
      id: studentData.name,
      dni: studentData.dni,
      nombrePila: studentData.first_name,
      nombreCompleto: `${studentData.first_name} ${studentData.last_name}`,
      correoElectronico: studentData.student_email_id,
      telefono: studentData.student_mobile_number || "No disponible",
      genero: studentData.gender || "No definido",
      nacionalidad: studentData.nationality || "Española",
      fechaNacimiento: studentData.date_of_birth || "No disponible",
      status: studentData.enabled === 1 ? "Activo" : "Inactivo",
      foto: studentData.image_url || null,
      enrollments: studentData.enrollments || [], // Útil para CursosScreen
    };
  } catch (error) {
    /*
    console.error("Error real cargando alumno:", error.response?.status);
    throw error;
    */
    console.error("Error en el servicio Mock:", error);
    return null;
  }
};

/**
 * Simulación de actualización de perfil
 */
export const updateStudentProfile = async (dni, formData) => {
  console.log("--- MOCK: Simulando guardado en servidor para", dni, formData);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

/**
 * Simulación de subida de foto
 */
export const uploadStudentPhoto = async (dni, imageUri) => {
  console.log(
    "--- MOCK: Simulando subida de imagen para",
    dni,
    "URI:",
    imageUri,
  );
  return new Promise((resolve) => setTimeout(resolve, 1500));
};
//Lógida de foto con API
/*
  const formData = new FormData();
  const fileName = imageUri.split('/').pop();
  
  formData.append('file', {
    uri: imageUri,
    name: fileName,
    type: 'image/jpeg',
  });
  formData.append('doctype', 'Student');
  formData.append('docname', dni);
  formData.append('fieldname', 'image');

  return await client.post('/api/method/upload_file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateStudentProfile = async (dni, updatedData) => {
  try {
    const res = await client.put(`/api/resource/Student/${dni}`, updatedData);
    return res.data.data;
  } catch (error) {
    console.error("Error al actualizar el perfil en Frappe", error);
    throw error;
  }
};
*/
