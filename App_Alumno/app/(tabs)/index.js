import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useStudent } from "../../hooks/useStudent";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: student, isLoading, isError } = useStudent(user?.dni);
  const { colors, dark } = useTheme();

  const menuItems = [
    {
      id: 1,
      title: "Mi Perfil",
      icon: "person",
      color: "#007AFF",
      route: "/(tabs)/profile",
    },
    {
      id: 2,
      title: "Horario",
      icon: "calendar",
      color: "#5856D6",
      route: "/schedule",
    },
    {
      id: 3,
      title: "Notas",
      icon: "school",
      color: "#FF9500",
      route: "/grades",
    },
    {
      id: 4,
      title: "Asistencia",
      icon: "checkmark-circle",
      color: "#34C759",
      route: "/attendance",
    },
    {
      id: 5,
      title: "Avisos",
      icon: "notifications",
      color: "#FF3B30",
      route: "/notifications",
    },
    {
      id: 6,
      title: "Documentos",
      icon: "document-text",
      color: "#AF52DE",
      route: "/documents",
    },
    {
      id: 7,
      title: "Cursos",
      icon: "library",
      color: "rgb(90, 200, 250)",
      route: "/(tabs)/cursos",
    },
  ];

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            ¡Hola de nuevo,{" "}
            {(student?.nombrePila || user?.first_name || "Alumno")
              .toLowerCase()
              .replace(/^\w/, (c) => c.toUpperCase())}
            !
          </Text>
          <Text style={[styles.subtitleText, { color: colors.subtext }]}>
            Panel del Alumno - Grupo ATU
          </Text>
        </View>

        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: colors.card }]}
              onPress={() => router.push(item.route)}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: item.color }]}
              >
                <Ionicons name={item.icon} size={30} color="#FFF" />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[
            styles.infoBox,
            { backgroundColor: colors.card, borderLeftColor: colors.primary },
          ]}
        >
          <Text style={[styles.infoTitle, { color: colors.subtext }]}>
            Estado de cuenta
          </Text>
          <Text style={[styles.infoText, { color: colors.text }]}>
            {student?.enrollments?.length > 0
              ? `Tienes ${student.enrollments.length} curso(s) activo(s)`
              : "No tienes cursos activos actualmente"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  subtitleText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFF",
    width: "47%",
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3A3A3C",
  },
  infoBox: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#007AFF",
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
  },
});
