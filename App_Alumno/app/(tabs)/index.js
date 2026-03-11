import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaFrameContext } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  // Configuración de los botones del menú
  const menuItems = [
    { id: 1, title: 'Mi Perfil', icon: 'person', color: '#007AFF', route: '/(tabs)/profile' },
    { id: 2, title: 'Horario', icon: 'calendar', color: '#5856D6', route: '/schedule' },
    { id: 3, title: 'Notas', icon: 'school', color: '#FF9500', route: '/grades' },
    { id: 4, title: 'Asistencia', icon: 'checkmark-circle', color: '#34C759', route: '/attendance' },
    { id: 5, title: 'Avisos', icon: 'notifications', color: '#FF3B30', route: '/notifications' },
    { id: 6, title: 'Documentos', icon: 'document-text', color: '#AF52DE', route: '/documents' },
    { id: 7, title: 'Cursos', icon: 'library', color: 'rgb(90, 200, 250)', route: '/(tabs)/cursos' },
  ];

  return (
    <SafeAreaFrameContext style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* CABECERA DE BIENVENIDA */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>¡Hola de nuevo!</Text>
          <Text style={styles.subtitleText}>Panel del Alumno</Text>
        </View>

        {/* CUADRÍCULA DE ACCESOS DIRECTOS */}
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => router.push(item.route)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={30} color="#FFF" />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Próxima Clase</Text>
          <Text style={styles.infoText}>Desarrollo de Interfaces - 10:00 AM</Text>
        </View>

      </ScrollView>
    </SafeAreaFrameContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  subtitleText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFF',
    width: '47%', 
    aspectRatio: 1, 
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  infoBox: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
});