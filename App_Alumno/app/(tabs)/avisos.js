import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { eliminarAviso, eliminarTodosAvisos, getAvisos, marcarComoLeido } from "../../services/avisoService";

export default function AvisosScreen() {
  const router = useRouter();
  const [avisos, setAvisos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      cargarAvisos();
    }, [])
  );

  const cargarAvisos = async () => {
    const avisosGuardados = await getAvisos();
    setAvisos(avisosGuardados);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarAvisos();
    setRefreshing(false);
  };

  const handleAvisoPress = (aviso) => {
    router.push({
      pathname: "/avisos/aviso-detalle",
      params: { aviso: JSON.stringify(aviso) }
    });
  };

  const handleEliminarAviso = async (id) => {
    Alert.alert(
      "Eliminar aviso",
      "¿Quieres eliminar este aviso?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await eliminarAviso(id);
            await cargarAvisos();
          },
        },
      ]
    );
  };

  const handleEliminarTodos = async () => {
    if (avisos.length === 0) return;
    Alert.alert(
      "Eliminar todos",
      "¿Quieres eliminar todos los avisos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar todos",
          style: "destructive",
          onPress: async () => {
            await eliminarTodosAvisos();
            await cargarAvisos();
          },
        },
      ]
    );
  };

  const getIconoPorTipo = (tipo) => {
    switch (tipo) {
      case 'success':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'alert-circle';
      default:
        return 'information-circle';
    }
  };

  const getColorPorTipo = (tipo) => {
    switch (tipo) {
      case 'success':
        return '#34C759';
      case 'warning':
        return '#FF9500';
      case 'error':
        return '#FF3B30';
      default:
        return '#007AFF';
    }
  };

  const renderAviso = ({ item }) => (
    <TouchableOpacity
      style={[styles.avisoCard, item.leido && styles.avisoLeido]}
      onPress={() => handleAvisoPress(item)}
      onLongPress={() => handleEliminarAviso(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.avisoIcone, { backgroundColor: getColorPorTipo(item.tipo) + '20' }]}>
        <Ionicons name={getIconoPorTipo(item.tipo)} size={24} color={getColorPorTipo(item.tipo)} />
      </View>
      <View style={styles.avisoContent}>
        <Text style={styles.avisoTitulo}>{item.titulo}</Text>
        <Text style={styles.avisoMensaje}>{item.mensaje}</Text>
        <Text style={styles.avisoFecha}>
          {new Date(item.fecha).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
      {!item.leido && <View style={styles.puntoNoLeido} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#004A99" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Avisos</Text>
        {avisos.length > 0 && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleEliminarTodos}>
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={avisos}
        renderItem={renderAviso}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={64} color="#C0C0C0" />
            <Text style={styles.emptyText}>No hay avisos</Text>
            <Text style={styles.emptySubtext}>
              Cuando te inscribas o anules cursos, los avisos aparecerán aquí
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E7",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  deleteButton: {
    padding: 8,
    marginRight: -8,
  },
  listContent: {
    padding: 16,
  },
  avisoCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avisoLeido: {
    opacity: 0.7,
    backgroundColor: "#FAFAFA",
  },
  avisoIcone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avisoContent: {
    flex: 1,
  },
  avisoTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  avisoMensaje: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  avisoFecha: {
    fontSize: 11,
    color: "#8E8E93",
  },
  puntoNoLeido: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#AEAEB2",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 40,
  },
});