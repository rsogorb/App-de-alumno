import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useStudent } from '../../hooks/useStudent'; // Ajusta la ruta según tu carpeta

export default function ProfileScreen() {
  // Usamos el hook que creamos antes con TanStack Query
  const { data: student, isLoading, error } = useStudent();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>Error al conectar con Frappe</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Cabecera del Perfil */}
      <View style={styles.header}>
        <Image 
          source={{ uri: student?.image || 'https://via.placeholder.com/150' }} 
          style={styles.avatar} 
        />
        <Text style={styles.name}>{student?.first_name} {student?.last_name}</Text>
        <Text style={styles.idText}>{student?.name}</Text>
      </View>

      {/* Información Detallada */}
      <View style={styles.infoSection}>
        <InfoRow label="Programa" value={student?.program} icon="🎓" />
        <InfoRow label="Email" value="alumno@ejemplo.com" icon="📧" />
        <InfoRow label="Campus" value="Sede Principal" icon="📍" />
      </View>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => console.log('Cerrar sesión')}
      >
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Componente auxiliar para las filas de información
const InfoRow = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.icon}>{icon}</Text>
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  header: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E' },
  idText: { fontSize: 14, color: '#8E8E93', marginTop: 5 },
  infoSection: { backgroundColor: '#FFF', marginTop: 20, paddingHorizontal: 20 },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0' 
  },
  icon: { fontSize: 20, marginRight: 15 },
  label: { fontSize: 12, color: '#8E8E93', textTransform: 'uppercase' },
  value: { fontSize: 16, color: '#1C1C1E', fontWeight: '500' },
  logoutButton: {
    margin: 30,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});