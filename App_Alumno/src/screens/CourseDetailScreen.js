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
import { enrollInCourse, unenrollFromCourse } from "../services/studentService";
import { sendLocalNotification } from "../services/notificationService"; // ← NUEVA IMPORTACIÓN

const CourseDetailScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

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
                  // NOTIFICACIÓN AL DARSE DE BAJA
                  await sendLocalNotification(
                    'Baja confirmada',
                    `Te has dado de baja de ${courseName}. ¡Esperamos verte de nuevo!`,
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
          // NOTIFICACIÓN AL INSCRIBIRSE
          await sendLocalNotification(
            '¡Inscripción exitosa!',
            `Te has inscrito en ${courseName}. ¡Aprovecha al máximo tu curso!`,
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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* IMAGEN DE CABECERA */}
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
          <Text style={styles.title}>{courseName}</Text>

          {/* BADGES DE INFO RÁPIDA */}
          <View style={styles.infoRow}>
            <View style={styles.infoBadge}>
              <Ionicons name="time-outline" size={16} color="#2469F5" />
              <Text style={styles.infoText}>{courseDuration}</Text>
            </View>
            <View style={styles.infoBadge}>
              <Ionicons name="bar-chart-outline" size={16} color="#2469F5" />
              <Text style={styles.infoText}>{courseLevel}</Text>
            </View>
          </View>

          {/* SECCIÓN: DESCRIPCIÓN */}
          <Text style={styles.sectionTitle}>Descripción del curso</Text>
          <Text style={styles.descriptionText}>{courseDescription}</Text>

          <View style={styles.divider} />

          {/* SECCIÓN: TEMARIO (Mock de ejemplo) */}
          <Text style={styles.sectionTitle}>Temario del curso</Text>
          <View style={styles.listContainer}>
            {[
              "Introducción y conceptos clave",
              "Herramientas y metodología",
              "Casos prácticos reales",
              "Evaluación final",
            ].map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listNumber}>{index + 1}</Text>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* SECCIÓN: REQUISITOS */}
          <Text style={styles.sectionTitle}>Requisitos</Text>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-done" size={20} color="#34C759" />
            <Text style={styles.requirementText}>
              Conocimientos básicos del área.
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-done" size={20} color="#34C759" />
            <Text style={styles.requirementText}>
              Conexión a internet y dispositivo compatible.
            </Text>
          </View>

          {/* Margen inferior para no tapar el botón flotante */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* BOTÓN FLOTANTE INFERIOR (Siempre visible) */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.mainButton,
            isEnrolled ? styles.buttonUnenroll : styles.buttonEnroll,
          ]}
          onPress={handleEnrollmentToggle}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons
                name={isEnrolled ? "close-circle" : "add-circle"}
                size={24}
                color="white"
              />
              <Text style={styles.buttonText}>
                {isEnrolled ? "Anular Inscripción" : "Inscribirme Ahora"}
              </Text>
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
  image: { width: "100%", height: 280 },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 25,
  },
  content: { padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  infoRow: { flexDirection: "row", gap: 12, marginBottom: 25 },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  infoText: { color: "#2469F5", fontWeight: "600", fontSize: 13 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 10,
  },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 20 },

  // Estilos de la lista de temario
  listContainer: { gap: 12 },
  listItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  listNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2469F5",
    color: "white",
    textAlign: "center",
    lineHeight: 24,
    fontSize: 12,
    fontWeight: "bold",
  },
  listText: { fontSize: 15, color: "#444" },

  // Estilos de requisitos
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  requirementText: { fontSize: 14, color: "#666" },

  // Footer y Botón
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  mainButton: {
    flexDirection: "row",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonEnroll: { backgroundColor: "#2469F5" },
  buttonUnenroll: { backgroundColor: "#FF3B30" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default CourseDetailScreen;
