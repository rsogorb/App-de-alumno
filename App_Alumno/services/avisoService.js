import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@avisos';

// Obtener todos los avisos
export const getAvisos = async () => {
  try {
    const avisosJSON = await AsyncStorage.getItem(STORAGE_KEY);
    return avisosJSON ? JSON.parse(avisosJSON) : [];
  } catch (error) {
    console.error('Error al obtener avisos:', error);
    return [];
  }
};

// Guardar un nuevo aviso
export const guardarAviso = async (titulo, mensaje, tipo = 'info') => {
  try {
    const avisos = await getAvisos();
    const nuevoAviso = {
      id: Date.now().toString(),
      titulo,
      mensaje,
      tipo, // 'info', 'success', 'warning', 'error'
      fecha: new Date().toISOString(),
      leido: false,
    };
    avisos.unshift(nuevoAviso);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(avisos));
    return nuevoAviso;
  } catch (error) {
    console.error('Error al guardar aviso:', error);
    return null;
  }
};

// Marcar un aviso como leído
export const marcarComoLeido = async (id) => {
  try {
    const avisos = await getAvisos();
    const actualizados = avisos.map(aviso =>
      aviso.id === id ? { ...aviso, leido: true } : aviso
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
  } catch (error) {
    console.error('Error al marcar aviso:', error);
  }
};

// Eliminar un aviso
export const eliminarAviso = async (id) => {
  try {
    const avisos = await getAvisos();
    const actualizados = avisos.filter(aviso => aviso.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
  } catch (error) {
    console.error('Error al eliminar aviso:', error);
  }
};

// Eliminar todos los avisos
export const eliminarTodosAvisos = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error al eliminar avisos:', error);
  }
};