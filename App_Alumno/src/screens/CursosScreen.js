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
      {/* Botones de filtro */}
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

      {/* Lista de cursos */}
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