import { useQuery } from '@tanstack/react-query';
import { getStudentProfile } from '../services/studentService';

export const useStudent = () => {
  return useQuery({
    queryKey: ['student'],
    queryFn: getStudentProfile,
  });
};