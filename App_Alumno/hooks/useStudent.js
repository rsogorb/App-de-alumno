import { useQuery } from '@tanstack/react-query';
import { getStudentProfile } from '../services/studentService'; 

export const useStudent = (dniAlumno) => {
  return useQuery({
    queryKey: ['student', dniAlumno],
    queryFn: () => getStudentProfile(dniAlumno),
    enabled: !!dniAlumno, 
    keepPreviousData: true, 
    retry: false,
  });
};