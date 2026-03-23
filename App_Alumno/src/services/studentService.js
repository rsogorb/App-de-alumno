import { getStoredStudent, saveStudentUpdate } from "../utils/storage";

const USE_MOCK = true;

/**
 * Obtiene el perfil del estudiante desde los Mocks locales
 */
export const getStudentProfile = async (dni) => {
  try {
    /*
    const res = await client.get(`api/resource/Student/${dni}`)

    const data = res.data.data
    */

    if (USE_MOCK) {
      const cleanDni = dni.trim().toUpperCase();
      // Simular carga
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Buscamos en el almacenamiento persistente (AsyncStorage)
      const studentData = await getStoredStudent(cleanDni);

      if (!studentData) return null;

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
    } else {
      console.warn("La API real no está configurada aún.");
      return null;
    }
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
  if (USE_MOCK) {
    const mappedData = {
      student_mobile_number: formData.student_mobile_number,
      gender: formData.gender,
      nationality: formData.nationality,
      date_of_birth: formData.date_of_birth,
      student_email_id: formData.student_email_id,
    };
    return await saveStudentUpdate(dni, mappedData);
  }
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

export const enrollInCourse = async (dni, course) => {
  if (USE_MOCK) {
    try {
      // 1. Obtenemos los datos actuales del disco
      const student = await getStoredStudent(dni);
      if (!student) return false;

      // 2. Comprobamos si ya está inscrito para no duplicar
      const isAlreadyEnrolled = student.enrollments?.some(
        (e) => e.name === course.id,
      );
      if (isAlreadyEnrolled) return true;

      // 3. Creamos el nuevo objeto de inscripción (formato Frappe/Mock)
      const newEnrollment = {
        name: course.id,
        course_name: course.name,
        status: "En curso",
        creation: new Date().toISOString().split("T")[0],
      };

      // 4. Actualizamos el array de inscripciones
      const updatedEnrollments = [
        ...(student.enrollments || []),
        newEnrollment,
      ];

      // 5. Guardamos en AsyncStorage usando la función que ya teníamos
      await saveStudentUpdate(dni, { enrollments: updatedEnrollments });

      console.log(`--- MOCK: Alumno ${dni} inscrito en ${course.name} ---`);
      return true;
    } catch (error) {
      console.error("Error en inscripción mock:", error);
      return false;
    }
  }
};

export const unenrollFromCourse = async (dni, courseId) => {
  if (USE_MOCK) {
    try {
      const student = await getStoredStudent(dni);
      if (!student) return false;

      // Filtramos: nos quedamos con todos MENOS con el que queremos borrar
      const updatedEnrollments = (student.enrollments || []).filter(
        (e) => String(e.name) !== String(courseId),
      );

      // Guardamos el nuevo array en AsyncStorage
      await saveStudentUpdate(dni, { enrollments: updatedEnrollments });

      console.log(`--- MOCK: Alumno ${dni} dado de baja de ${courseId} ---`);
      return true;
    } catch (error) {
      console.error("Error al desapuntar en mock:", error);
      return false;
    }
  }
  return false;
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
