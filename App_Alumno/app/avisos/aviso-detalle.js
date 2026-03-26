import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { marcarComoLeido } from "../../services/avisoService";

export default function AvisoDetalleScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { aviso } = useLocalSearchParams();
  const avisoData = JSON.parse(aviso);

  // Marcar como leído cuando se ve el detalle
  useFocusEffect(
    useCallback(() => {
      if (!avisoData.leido) {
        marcarComoLeido(avisoData.id);
      }
    }, [avisoData.id, avisoData.leido]),
  );

  const getIconoPorTipo = (tipo) => {
    switch (tipo) {
      case "success":
        return "checkmark-circle";
      case "warning":
        return "warning";
      case "error":
        return "alert-circle";
      default:
        return "information-circle";
    }
  };

  const getColorPorTipo = (tipo) => {
    switch (tipo) {
      case "success":
        return "#34C759";
      case "warning":
        return "#FF9500";
      case "error":
        return "#FF3B30";
      default:
        return colors.primary;
    }
  };

  const fechaFormateada = new Date(avisoData.fecha).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace(`/(tabs)/avisos`)}
        >
          <Ionicons name="arrow-back" size={24} color="#004A99" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Detalle del aviso
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getColorPorTipo(avisoData.tipo) + "20" },
          ]}
        >
          <Ionicons
            name={getIconoPorTipo(avisoData.tipo)}
            size={48}
            color={getColorPorTipo(avisoData.tipo)}
          />
        </View>

        <Text style={[styles.titulo, { color: colors.text }]}>
          {avisoData.titulo}
        </Text>
        <Text style={[styles.fecha, { color: colors.subtext }]}>
          {fechaFormateada}
        </Text>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Text style={[styles.mensaje, { color: colors.text }]}>
          {avisoData.mensaje}
        </Text>
      </ScrollView>
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
  content: {
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
    textAlign: "center",
    marginBottom: 8,
  },
  fecha: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 20,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E5E7",
    marginVertical: 20,
  },
  mensaje: {
    fontSize: 16,
    color: "#3A3A3C",
    lineHeight: 24,
    textAlign: "center",
  },
});
