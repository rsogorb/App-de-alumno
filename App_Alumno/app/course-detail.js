import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { sendLocalNotification } from "../services/notificationService";
import { enrollInCourse, unenrollFromCourse } from "../services/studentService";
import { guardarAviso } from "../services/avisoService";

const CourseDetailScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { colors, dark } = useTheme();

  const {
    courseId,
    courseName,
    courseDescription,
    courseDuration,
    courseLevel,
    courseImage,
    isEnrolled: initialIsEnrolled,
  } = useLocalSearchParams();

  const [isEnrolled, setIsEnrolled] = useState(initialIsEnrolled === "true");
  const [loading, setLoading] = useState(false);

  const handleEnrollmentToggle = async () => {
    if (!user?.dni) {
      Alert.alert("Identificación", "Inicia sesión para gestionar tus cursos.");
      return;
    }

    setLoading(true);
    try {
      if (isEnrolled) {
        Alert.alert(
          "Anular inscripción",
          "¿Deseas darte de baja de este curso?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Confirmar Baja",
              style: "destructive",
              onPress: async () => {
                const success = await unenrollFromCourse(user.dni, courseId);
                if (success) {
                  setIsEnrolled(false);
                  await guardarAviso(
                    'Baja confirmada',
                    `Te has dado de baja de ${courseName}`,
                    'warning'
                  );
                  await sendLocalNotification(
                    'Baja confirmada',
                    `Te has dado de baja de ${courseName}`,
                    { courseId }
                  );
                }
              },
            },
          ],
        );
      } else {
        const success = await enrollInCourse(user.dni, {
          id: courseId,
          name: courseName,
        });
        if (success) {
          setIsEnrolled(true);
          await guardarAviso(
            'Inscripción exitosa',
            `Te has inscrito en ${courseName}`,
            'success'
          );
          await sendLocalNotification(
            '¡Inscripción exitosa!',
            `Te has inscrito en ${courseName}`,
            { courseId }
          );
          Alert.alert("¡Hecho!", "Te has inscrito correctamente.");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: courseImage }} style={styles.image} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            {courseName || "Cargando curso..."}
          </Text>

          <View style={styles.infoRow}>
            <View style={[styles.infoBadge, { backgroundColor: dark ? "#2C2C2E" : "#E8F0FE" }]}>
              <Ionicons name="time-outline" size={16} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.primary }]}>
                {courseDuration || "N/A"}
              </Text>
            </View>
            <View style={[styles.infoBadge, { backgroundColor: dark ? "#2C2C2E" : "#E8F0FE" }]}>
              <Ionicons name="bar-chart-outline" size={16} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.primary }]}>
                {courseLevel || "General"}
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Descripción del curso</Text>
          <Text style={[styles.descriptionText, { color: colors.subtext }]}>
            {courseDescription || "No hay descripción disponible para este curso."}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Temario del curso</Text>
          <View style={styles.listContainer}>
            {["Introducción y conceptos clave", "Herramientas y metodología", "Casos prácticos reales", "Evaluación final"].map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={[styles.listNumber, { backgroundColor: colors.primary }]}>{index + 1}</Text>
                <Text style={[styles.listText, { color: colors.text }]}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Requisitos</Text>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-done" size={20} color="#34C759" />
            <Text style={[styles.requirementText, { color: colors.subtext }]}>Conocimientos básicos del área.</Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-done" size={20} color="#34C759" />
            <Text style={[styles.requirementText, { color: colors.subtext }]}>Conexión a internet estable.</Text>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.mainButton, isEnrolled ? styles.buttonUnenroll : { backgroundColor: colors.primary }]}
          onPress={handleEnrollmentToggle}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name={isEnrolled ? "close-circle" : "add-circle"} size={24} color="white" />
              <Text style={styles.buttonText}>{isEnrolled ? "Anular Inscripción" : "Inscribirme Ahora"}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { position: "relative" },
  image: { width: "100%", height: 280, backgroundColor: "#ccc" },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 25,
  },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 12 },
  infoRow: { flexDirection: "row", gap: 12, marginBottom: 25 },
  infoBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },
  infoText: { fontWeight: "700", fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  descriptionText: { fontSize: 15, lineHeight: 22, marginBottom: 10 },
  divider: { height: 1, marginVertical: 20 },
  listContainer: { gap: 12 },
  listItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  listNumber: { width: 24, height: 24, borderRadius: 12, color: "white", textAlign: "center", lineHeight: 24, fontSize: 12, fontWeight: "bold" },
  listText: { fontSize: 15 },
  requirementItem: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  requirementText: { fontSize: 14 },
  footer: { position: "absolute", bottom: 0, width: "100%", padding: 20, borderTopWidth: 1, paddingBottom: 30 },
  mainButton: { flexDirection: "row", padding: 18, borderRadius: 15, alignItems: "center", justifyContent: "center", gap: 10 },
  buttonUnenroll: { backgroundColor: "#FF3B30" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default CourseDetailScreen;
