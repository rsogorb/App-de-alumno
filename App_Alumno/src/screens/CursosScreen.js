import { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { mockStudents } from "../mocks/mocks";
import { getCursos } from "../services/cursosServices";

const CursosScreen = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("all"); // 'all', 'available', 'enrolled'
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  // Lógica de Filtrado y Búsqueda combinada
  useEffect(() => {
    let result = [];

    // 1. Filtrar por pestaña
    if (currentFilter === "enrolled") {
      result = myCourses;
    } else if (currentFilter === "available") {
      result = allCourses.filter((c) => !myCourses.some((m) => m.id === c.id));
    } else {
      result = allCourses;
    }

    // 2. Filtrar por texto de búsqueda
    if (searchQuery.trim() !== "") {
      const term = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term),
      );
    }

    setFilteredCourses(result);
  }, [currentFilter, searchQuery, allCourses, myCourses]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const cursosApp = await getCursos(); // Esto ya viene mapeado del servicio
      setAllCourses(cursosApp);

      // Para los inscritos, usa el ID correcto
      const enrolled = mockStudents[0].enrollments.map((ins) => ({
        ...cursosApp.find((c) => c.id === ins.name), // Buscamos el objeto curso completo
        isEnrolled: true,
      }));
      setMyCourses(enrolled);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCourseCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.courseName}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>⏱️ {item.duration}</Text>
          <Text style={styles.tag}>📊 {item.level}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            item.isEnrolled ? styles.buttonEnrolled : styles.buttonAction,
          ]}
          onPress={() => router.push({
            pathname: '/course-detail',
            params: { 
              courseId: item.id,
              courseName: item.name,
              courseDescription: item.description,
              courseDuration: item.duration,
              courseLevel: item.level,
              courseImage: item.image,
              isEnrolled: item.isEnrolled ? 'true' : 'false'
            }
          })}
        >
          <Text style={styles.buttonText}>
            {item.isEnrolled ? "Acceder" : "Saber más"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2469F5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Centro de Formación</Text>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterTabs}>
          {["all", "available", "enrolled"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, currentFilter === tab && styles.activeTab]}
              onPress={() => setCurrentFilter(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  currentFilter === tab && styles.activeTabText,
                ]}
              >
                {tab === "all"
                  ? "Todos"
                  : tab === "available"
                    ? "Disponibles"
                    : "Mis Cursos"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredCourses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se han encontrado cursos.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    backgroundColor: "white",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1A1A1A",
  },
  searchBox: {
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchInput: { height: 45, fontSize: 16 },
  filterTabs: { flexDirection: "row", justifyContent: "space-between" },
  tab: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
  activeTab: { backgroundColor: "#2469F5" },
  tabText: { color: "#666", fontWeight: "600" },
  activeTabText: { color: "white" },
  listPadding: { padding: 15 },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
    overflow: "hidden",
  },
  image: { width: "100%", height: 160 },
  infoContainer: { padding: 15 },
  courseName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  description: { color: "#666", fontSize: 14, marginBottom: 10 },
  tagContainer: { flexDirection: "row", marginBottom: 15 },
  tag: {
    marginRight: 15,
    fontSize: 12,
    color: "#888",
    backgroundColor: "#F0F2F5",
    padding: 5,
    borderRadius: 5,
  },
  button: { padding: 12, borderRadius: 10, alignItems: "center" },
  buttonAction: { backgroundColor: "#2469F5" },
  buttonEnrolled: { backgroundColor: "#34C759" },
  buttonText: { color: "white", fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
});

export default CursosScreen;

/*
// src/screens/CursosScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { getCursos, getMisCursos, getCursosDisponibles } from '../services/cursosServices';
const CursosScreen = () => {
  // Estados para manejar los datos y la carga
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'inscritos', 'disponibles'

  // useEffect se ejecuta cuando el componente se monta
  useEffect(() => {
  cargarCursos(filtro);
}, [filtro]);

  const cargarCursos = async (filtroSeleccionado = 'todos') => {
  try {
    setCargando(true);
    let datos;
    
    // Llamamos a la función correspondiente según el filtro
    if (filtroSeleccionado === 'inscritos') {
      datos = await getMisCursos();
    } else if (filtroSeleccionado === 'disponibles') {
      datos = await getCursosDisponibles();
    } else {
      datos = await getCursos(); // 'todos'
    }
    
    setCursos(datos);
    setError(null);
  } catch (err) {
    setError('Error al cargar los cursos');
    console.error(err);
  } finally {
    setCargando(false);
  }
};

  // Función para renderizar cada curso en la lista
const renderCurso = ({ item }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.imagen }} style={styles.imagen} />
    <View style={styles.infoContainer}>
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.descripcion}>{item.descripcion || 'Sin descripción disponible'}</Text>
      <View style={styles.detallesContainer}>
        <Text style={styles.detalle}>📚 {item.duracion}</Text>
        <Text style={styles.detalle}>📊 {item.nivel}</Text>
      </View>
      <View style={styles.botonContainer}>
        <TouchableOpacity
          style={[styles.boton, item.inscrito ? styles.botonInscrito : styles.botonDisponible]}
          onPress={() => alert(`Curso seleccionado: ${item.nombre}`)}
        >
          <Text style={styles.botonTexto}>
            {item.inscrito ? '✔️ Inscrito' : '➕ Apuntarse'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
  // Filtrar cursos según el filtro seleccionado
  const cursosFiltrados = () => {
    if (filtro === 'inscritos') {
      return cursos.filter(c => c.inscrito === true);
    } else if (filtro === 'disponibles') {
      return cursos.filter(c => c.inscrito === false);
    } else {
      return cursos;
    }
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#2469F5" />
        <Text style={styles.cargandoTexto}>Cargando cursos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.errorTexto}>{error}</Text>
        <TouchableOpacity style={styles.botonReintentar} onPress={cargarCursos}>
          <Text style={styles.botonReintentarTexto}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtrosContainer}>
        <TouchableOpacity
          style={[styles.filtroBoton, filtro === 'todos' && styles.filtroActivo]}
          onPress={() => setFiltro('todos')}
        >
          <Text style={[styles.filtroTexto, filtro === 'todos' && styles.filtroTextoActivo]}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroBoton, filtro === 'disponibles' && styles.filtroActivo]}
          onPress={() => setFiltro('disponibles')}
        >
          <Text style={[styles.filtroTexto, filtro === 'disponibles' && styles.filtroTextoActivo]}>
            Disponibles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroBoton, filtro === 'inscritos' && styles.filtroActivo]}
          onPress={() => setFiltro('inscritos')}
        >
          <Text style={[styles.filtroTexto, filtro === 'inscritos' && styles.filtroTextoActivo]}>
            Mis Cursos
          </Text>
        </TouchableOpacity>
      </View>


      <FlatList
        data={cursosFiltrados()}
        renderItem={renderCurso}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centrado}>
            <Text style={styles.emptyTexto}>No hay cursos para mostrar</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtroBoton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filtroActivo: {
    backgroundColor: '#2469F5',
  },
  filtroTexto: {
    fontSize: 14,
    color: '#666',
  },
  filtroTextoActivo: {
    color: 'white',
    fontWeight: 'bold',
  },
  lista: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagen: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  detallesContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detalle: {
    fontSize: 12,
    color: '#888',
    marginRight: 16,
  },
  botonContainer: {
    alignItems: 'flex-end',
  },
  boton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  botonDisponible: {
    backgroundColor: '#4CAF50',
  },
  botonInscrito: {
    backgroundColor: '#FF9800',
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cargandoTexto: {
    marginTop: 10,
    color: '#666',
  },
  errorTexto: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  botonReintentar: {
    backgroundColor: '#2469F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  botonReintentarTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyTexto: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default CursosScreen;
*/
