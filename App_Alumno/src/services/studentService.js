import client from '../api/client.js';

export const getStudentProfile = async (dni) => {
  try {
    const res = await client.get(`api/resource/Student/${dni}`)

    const data = res.data.data
    
    return {
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
    };
  } catch (error) {
    console.error("Error real cargando alumno:", error.response?.status);
    throw error;
  }
};

export const uploadStudentPhoto = async (dni, imageUri) => {
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