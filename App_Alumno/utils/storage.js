// src/utils/storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockStudents } from "../mocks/mocks";

const STUDENT_KEY = "@student_data_v1";

/**
 * Obtiene un estudiante del almacenamiento local.
 * Si es la primera vez, inicializa el almacenamiento con los mocks.
 */
export const getStoredStudent = async (dni) => {
  try {
    const jsonValue = await AsyncStorage.getItem(STUDENT_KEY);

    if (jsonValue !== null) {
      // Ya existen datos guardados, los usamos
      const allStudents = JSON.parse(jsonValue);
      return allStudents.find((s) => s.dni === dni) || null;
    } else {
      // Es la primera vez que abrimos la app:
      // Guardamos los mocks originales en AsyncStorage para que sean editables
      console.log("--- Inicializando almacenamiento con Mocks ---");
      await AsyncStorage.setItem(STUDENT_KEY, JSON.stringify(mockStudents));
      return mockStudents.find((s) => s.dni === dni);
    }
  } catch (e) {
    console.error("Error leyendo de AsyncStorage:", e);
    return null;
  }
};

/**
 * Guarda los cambios de un estudiante sin borrar a los demás.
 */
export const saveStudentUpdate = async (dni, updatedFields) => {
  try {
    const jsonValue = await AsyncStorage.getItem(STUDENT_KEY);
    let students = jsonValue ? JSON.parse(jsonValue) : [...mockStudents];

    // Buscamos al estudiante y mezclamos sus datos antiguos con los nuevos
    students = students.map((s) =>
      s.dni === dni ? { ...s, ...updatedFields } : s,
    );

    // Guardamos el array completo actualizado en el disco
    await AsyncStorage.setItem(STUDENT_KEY, JSON.stringify(students));
    console.log("--- Cambios guardados localmente con éxito ---");
    return true;
  } catch (e) {
    console.error("Error guardando en AsyncStorage:", e);
    return false;
  }
};

/**
 * Función de utilidad para resetear la app (borrar cambios guardados)
 */
export const clearStorage = async () => {
  try {
    await AsyncStorage.removeItem(STUDENT_KEY);
    console.log("--- Almacenamiento limpiado ---");
  } catch (e) {
    console.error(e);
  }
};
