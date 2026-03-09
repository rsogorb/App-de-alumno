import { View, Text, ActivityIndicator } from 'react-native';
import { useStudent } from '../hooks/useStudent';

export const ProfileScreen = () => {
  const { data: student, isLoading, error } = useStudent();

  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error al cargar datos</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        ¡Hola, {student.first_name}!
      </Text>
      <Text>Programa: {student.program}</Text>
    </View>
  );
};