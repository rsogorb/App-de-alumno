import { useQuery } from '@tanstack/react-query';
import { getStudentProfile } from '../services/studentService'; 

export const useStudent = (dniAlumno) => {
  return useQuery({
    queryKey: ['student', dniAlumno],
    queryFn: () => getStudentProfile(dniAlumno),
    // Esto es clave: si dniAlumno es null o undefined, no intenta hacer la petición
    enabled: !!dniAlumno, 
    // Opcional: mantiene los datos anteriores mientras carga los nuevos
    keepPreviousData: true, 
    // Opcional: evita que re-intente 3 veces si falla (útil en desarrollo)
    retry: false,
  });
};