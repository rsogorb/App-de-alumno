import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CourseDetailScreen = () => {
  // Recibimos los parámetros individuales
  const params = useLocalSearchParams();
  
  // Construimos el objeto course a partir de los parámetros
  const courseData = {
    id: params.courseId,
    name: params.courseName,
    description: params.courseDescription,
    duration: params.courseDuration,
    level: params.courseLevel,
    image: params.courseImage,
    isEnrolled: params.isEnrolled === 'true',
  };

  // Datos de ejemplo para el temario
  const syllabus = [
    "Introducción y conceptos básicos",
    "Módulo 1: Fundamentos",
    "Módulo 2: Desarrollo práctico",
    "Módulo 3: Casos de estudio",
    "Evaluación final",
  ];

  const requirements = [
    "Conocimientos básicos de informática",
    "Ganas de aprender",
    "Conexión a internet",
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Imagen del curso */}
      <Image source={{ uri: courseData.image }} style={styles.image} />

      {/* Contenido */}
      <View style={styles.content}>
        {/* Título y descripción */}
        <Text style={styles.title}>{courseData.name}</Text>
        <Text style={styles.description}>{courseData.description}</Text>

        {/* Etiquetas de duración y nivel */}
        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.tagText}>{courseData.duration}</Text>
          </View>
          <View style={styles.tag}>
            <Ionicons name="stats-chart-outline" size={16} color="#666" />
            <Text style={styles.tagText}>{courseData.level}</Text>
          </View>
        </View>

        {/* Temario */}
        <Text style={styles.sectionTitle}>Temario del curso</Text>
        {syllabus.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#34C759" />
            <Text style={styles.listItemText}>{item}</Text>
          </View>
        ))}

        {/* Requisitos */}
        <Text style={styles.sectionTitle}>Requisitos</Text>
        {requirements.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Ionicons name="alert-circle-outline" size={20} color="#FF9500" />
            <Text style={styles.listItemText}>{item}</Text>
          </View>
        ))}

        {/* Botón de inscripción */}
        <TouchableOpacity 
          style={[styles.enrollButton, courseData.isEnrolled && styles.enrolledButton]}
          onPress={() => alert(courseData.isEnrolled 
            ? `Ya estás inscrito en ${courseData.name}` 
            : `¡Te has inscrito en ${courseData.name}! (Simulado)`
          )}
        >
          <Text style={styles.enrollButtonText}>
            {courseData.isEnrolled ? '✔️ Inscrito' : 'Inscribirme ahora'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  tagText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  listItemText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#3A3A3C',
    flex: 1,
  },
  enrollButton: {
    backgroundColor: '#004A99',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  enrolledButton: {
    backgroundColor: '#34C759',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CourseDetailScreen;