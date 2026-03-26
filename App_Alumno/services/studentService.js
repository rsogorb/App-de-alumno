import client from "../api/client";
import { getStoredStudent, saveStudentUpdate } from "../utils/storage";

const USE_MOCK = false;

export const getStudentProfile = async (dni) => {
  const cleanDni = dni.trim().toUpperCase();

  // 1. SI NO ES MOCK, INTENTAR API SÍ O SÍ
  if (!USE_MOCK) {
    try {
      const res = await client.get(`api/resource/Student/${cleanDni}`);
      const data = res.data.data;

      if (data) {
        console.log("--- DATOS RECIBIDOS DE API REAL ---", data.full_name);
        return {
          id: data.name,
          dni: data.dni,
          nombrePila: data.first_name,
          apellido: data.last_name,
          nombreCompleto: data.full_name || data.student_name,
          correoElectronico: data.student_email_id,
          telefono: data.student_mobile_number || "No disponible",
          genero: data.gender || "No definido",
          nacionalidad: data.nationality || "No definida",
          fechaNacimiento: data.date_of_birth || "No disponible",
          status: data.enabled === 1 ? "Activo" : "Inactivo",
          foto: data.image
            ? `https://erppreprod.grupoatu.com${data.image}`
            : null,
          enrollments: data.custom_acciones_formativas || [],
        };
      }
    } catch (error) {
      console.error(
        "Error llamando a la API, intentando fallback local:",
        error.message,
      );
      // Solo si falla la API intentamos el mock como respaldo "offline"
    }
  }

  // 2. LÓGICA DE MOCK (Si USE_MOCK es true o si la API falló arriba)
  const studentData = await getStoredStudent(cleanDni);
  if (studentData) {
    console.log("--- CARGANDO DESDE MOCK/STORAGE ---");
    return {
      id: studentData.name,
      dni: studentData.dni,
      nombrePila: studentData.first_name,
      nombreCompleto:
        studentData.full_name ||
        `${studentData.first_name} ${studentData.last_name}`,
      correoElectronico: studentData.student_email_id,
      telefono: studentData.student_mobile_number || "No disponible",
      genero: studentData.gender || "No definido",
      nacionalidad: studentData.nationality || "Española",
      fechaNacimiento: studentData.date_of_birth || "No disponible",
      status: studentData.enabled === 1 ? "Activo (Mock)" : "Inactivo (Mock)",
      foto: studentData.image_url || null,
      enrollments: studentData.enrollments || [],
    };
  }

  return null;
};

/**
 * Actualiza el perfil
 */
export const updateStudentProfile = async (dni, formData) => {
  if (USE_MOCK) {
    const mappedData = {
      student_mobile_number: formData.telefono,
      gender: formData.genero,
      nationality: formData.nacionalidad,
      date_of_birth: formData.fechaNacimiento,
      student_email_id: formData.correoElectronico,
    };
    return await saveStudentUpdate(dni, mappedData);
  } else {
    try {
      const body = {
        student_mobile_number: formData.telefono,
        gender: formData.genero,
        nationality: formData.nacionalidad,
        date_of_birth: formData.fechaNacimiento,
        student_email_id: formData.correoElectronico,
      };
      const res = await client.put(`api/resource/Student/${dni}`, body);
      return res.data.data;
    } catch (error) {
      console.error("Error actualizando en API:", error);
      throw error;
    }
  }
};

/**
 * Sube la foto del alumno
 */
export const uploadStudentPhoto = async (dni, imageUri) => {
  if (USE_MOCK) {
    console.log("--- MOCK: Simulando subida de imagen ---");
    return new Promise((resolve) => setTimeout(resolve, 1500));
  } else {
    const formData = new FormData();
    const fileName = imageUri.split("/").pop();

    formData.append("file", {
      uri: imageUri,
      name: fileName,
      type: "image/jpeg",
    });
    formData.append("doctype", "Student");
    formData.append("docname", dni);
    formData.append("fieldname", "image");

    const res = await client.post("/api/method/upload_file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.message;
  }
};

/**
 * Inscripción a cursos (Mantiene lógica local para pruebas)
 */
export const enrollInCourse = async (dni, course) => {
  if (USE_MOCK) {
    try {
      const student = await getStoredStudent(dni);
      if (!student) return false;
      const isAlreadyEnrolled = student.enrollments?.some(
        (e) => e.name === course.id,
      );
      if (isAlreadyEnrolled) return true;

      const updatedEnrollments = [
        ...(student.enrollments || []),
        {
          name: course.id,
          course_name: course.name,
          status: "En curso",
          creation: new Date().toISOString(),
        },
      ];
      await saveStudentUpdate(dni, { enrollments: updatedEnrollments });
      return true;
    } catch (error) {
      return false;
    }
  }
  // TODO: Implementar POST real a Frappe cuando sepas el Doctype
  return true;
};

/**
 * Baja de cursos
 */
export const unenrollFromCourse = async (dni, courseId) => {
  if (USE_MOCK) {
    try {
      const student = await getStoredStudent(dni);
      if (!student) return false;
      const updatedEnrollments = (student.enrollments || []).filter(
        (e) => String(e.name) !== String(courseId),
      );
      await saveStudentUpdate(dni, { enrollments: updatedEnrollments });
      return true;
    } catch (error) {
      return false;
    }
  }
  return true;
};
