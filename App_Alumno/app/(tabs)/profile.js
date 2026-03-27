import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SkeletonProfile from "../../components/SkeletonProfile";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useStudent } from "../../hooks/useStudent";
import { mockCourses } from "../../mocks/mocks";
import {
  updateStudentProfile,
  uploadStudentPhoto,
} from "../../services/studentService";
export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { colors, dark } = useTheme();

  const {
    data: student,
    isLoading,
    isFetching,
    refetch,
  } = useStudent(user?.dni || "71750101Z");

  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [tempPhoto, setTempPhoto] = useState(null);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (student) {
      setFormData({
        telefono: student.telefono,
        genero: student.genero,
        nacionalidad: student.nacionalidad,
        fechaNacimiento: student.fechaNacimiento,
        correoElectronico: student.correoElectronico,
      });
    }
  }, [student]);

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, salir",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      await updateStudentProfile(student.dni, formData);
      Alert.alert("¡Éxito!", "Perfil actualizado correctamente.");
      setIsEditing(false);
      refetch();
    } catch (err) {
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    } finally {
      setUploading(false);
    }
  };

  const changePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Error", "Permisos necesarios.");

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setTempPhoto(selectedUri);
      setUploading(true);
      try {
        await uploadStudentPhoto(student.dni, selectedUri);
        await refetch();
        setTempPhoto(null);
        Alert.alert("¡Hecho!", "Foto actualizada.");
      } catch (err) {
        setTempPhoto(null);
        Alert.alert("Error", "No se pudo subir la foto.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      telefono: student.telefono,
      genero: student.genero,
      nacionalidad: student.nacionalidad,
      fechaNacimiento: student.fechaNacimiento,
      correoElectronico: student.correoElectronico,
    });
    setIsEditing(false);
    setTempPhoto(null);
  };

  if (isLoading) return <SkeletonProfile />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* BOTÓN DE AJUSTES INDEPENDIENTE */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push("/settings")}
      >
        <Ionicons name="settings-outline" size={26} color={colors.primary} />
      </TouchableOpacity>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* CABECERA */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity onPress={changePhoto} disabled={uploading}>
            <View style={styles.avatarWrapper}>
              {tempPhoto || student?.foto ? (
                <Image
                  key={tempPhoto || student?.foto}
                  source={{ uri: tempPhoto || student?.foto }}
                  style={styles.avatarImg}
                />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.avatarLetter}>
                    {student?.nombrePila?.charAt(0)}
                  </Text>
                </View>
              )}
              <View style={[styles.cameraIcon, { borderColor: colors.card }]}>
                {uploading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={{ fontSize: 12 }}>📸</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
          <Text style={[styles.nameText, { color: colors.text }]}>
            {student?.nombreCompleto}
          </Text>
          <Text style={[styles.idSubtext, { color: colors.subtext }]}>
            DNI: {student?.dni}
          </Text>
          <View style={styles.actionButtonsContainer}>
            {!isEditing ? (
              <TouchableOpacity
                style={[
                  styles.editBtn,
                  { backgroundColor: dark ? "#3A3A3C" : "#F2F2F7" },
                ]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={[styles.editBtnText, { color: colors.primary }]}>
                  ✎ Editar Perfil
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: "row", gap: 10 }}>
                {/* BOTÓN CANCELAR */}
                <TouchableOpacity
                  style={[styles.editBtn, { backgroundColor: "#FF3B3020" }]}
                  onPress={handleCancel}
                >
                  <Text style={[styles.editBtnText, { color: "#FF3B30" }]}>
                    ✕ Cancelar
                  </Text>
                </TouchableOpacity>

                {/* BOTÓN GUARDAR */}
                <TouchableOpacity
                  style={[styles.editBtn, { backgroundColor: "#34C759" }]}
                  onPress={handleSave}
                >
                  <Text style={[styles.editBtnText, { color: "#FFF" }]}>
                    ✓ Guardar
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
          Identificación Académica
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <InfoRow
            label="DNI / NIE"
            value={student?.dni}
            icon="🆔"
            colors={colors}
          />
          <InfoRow
            label="Situación"
            value={student?.status}
            icon="📊"
            colors={colors}
            last
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
          Datos de Contacto
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <EditableRow
            label="Email"
            value={formData.correoElectronico}
            isEditing={isEditing}
            onChange={(val) =>
              setFormData({ ...formData, correoElectronico: val })
            }
            icon="✉️"
            colors={colors}
            keyboardType="email-adress"
          />
          <EditableRow
            label="Teléfono"
            value={formData.telefono}
            isEditing={isEditing}
            onChange={(val) => setFormData({ ...formData, telefono: val })}
            icon="📱"
            colors={colors}
            last
            keyboardType="phone-pad"
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
          Mis Cursos
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {student?.enrollments && student.enrollments.length > 0 ? (
            student.enrollments.map((enrollment, index) => {
              // Intentamos buscar en mocks, si no, usamos los datos de la API
              const cursoInfo = mockCourses.find(
                (c) => String(c.id) === String(enrollment.course),
              );

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.courseRow,
                    { borderBottomColor: colors.border },
                    index === student.enrollments.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/course-detail",
                      params: {
                        courseId: enrollment.course,
                        courseName: enrollment.course_name || enrollment.course,
                        isEnrolled: "true",
                      },
                    })
                  }
                >
                  <View
                    style={[
                      styles.courseIcon,
                      { backgroundColor: dark ? "#3A3A3C" : "#F0F2F5" },
                    ]}
                  >
                    <Text>
                      {enrollment.estado === "Finalizado" ? "✅" : "📘"}
                    </Text>
                  </View>
                  <View style={styles.courseInfo}>
                    <Text
                      style={[styles.courseName, { color: colors.text }]}
                      numberOfLines={1}
                    >
                      {enrollment.course_name || enrollment.course}
                    </Text>
                    <Text
                      style={[styles.courseStatus, { color: colors.primary }]}
                    >
                      {enrollment.estado || "En curso"}
                    </Text>
                  </View>
                  <Text style={[styles.courseArrow, { color: colors.subtext }]}>
                    ›
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyCourses}>
              <Text
                style={[styles.emptyCoursesText, { color: colors.subtext }]}
              >
                No tienes cursos registrados.
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
          Sesión
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.row, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <Text style={styles.rowIcon}>🚪</Text>
            <View>
              <Text
                style={[
                  styles.rowValue,
                  { color: "#FF3B30", fontWeight: "600" },
                ]}
              >
                Cerrar Sesión
              </Text>
              <Text style={[styles.rowLabel, { color: colors.subtext }]}>
                Salir de {student?.nombrePila}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// COMPONENTES AUXILIARES CON COLORES DINÁMICOS
const InfoRow = ({ label, value, icon, last, colors }) => (
  <View
    style={[
      styles.row,
      { borderBottomColor: colors.border },
      last && { borderBottomWidth: 0 },
    ]}
  >
    <Text style={styles.rowIcon}>{icon}</Text>
    <View>
      <Text style={[styles.rowLabel, { color: colors.subtext }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>
        {value || "No disponible"}
      </Text>
    </View>
  </View>
);

const EditableRow = ({
  label,
  value,
  isEditing,
  onChange,
  icon,
  last,
  colors,
}) => (
  <View
    style={[
      styles.row,
      { borderBottomColor: colors.border },
      last && { borderBottomWidth: 0 },
    ]}
  >
    <Text style={styles.rowIcon}>{icon}</Text>
    <View style={{ flex: 1 }}>
      <Text style={[styles.rowLabel, { color: colors.subtext }]}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={[
            styles.input,
            { color: colors.primary, borderBottomColor: colors.primary },
          ]}
          value={value}
          onChangeText={onChange}
        />
      ) : (
        <Text style={[styles.rowValue, { color: colors.text }]}>
          {value || "No definido"}
        </Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  settingsButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  header: { paddingVertical: 30, alignItems: "center", borderBottomWidth: 1 },
  avatarWrapper: { width: 90, height: 90, position: "relative" },
  avatarImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E1E1E1",
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: { color: "#FFF", fontSize: 36, fontWeight: "bold" },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1C1C1E",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  nameText: { fontSize: 20, fontWeight: "bold", marginTop: 12 },
  idSubtext: { fontSize: 13, marginBottom: 15 },
  editBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 120, // Para que los botones tengan un tamaño consistente
    alignItems: "center",
  },
  saveBtn: { backgroundColor: "#34C759" },
  editBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 11,
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  rowIcon: { fontSize: 18, marginRight: 15, width: 25, textAlign: "center" },
  rowLabel: { fontSize: 11 },
  rowValue: { fontSize: 16, marginTop: 1 },
  input: { fontSize: 16, borderBottomWidth: 1, paddingVertical: 2 },
  courseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  courseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  courseInfo: { flex: 1 },
  courseName: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
  courseStatus: { fontSize: 12 },
  courseArrow: { fontSize: 18, marginLeft: 8 },
  emptyCourses: { paddingVertical: 20, alignItems: "center" },
  emptyCoursesText: { fontSize: 14, textAlign: "center" },
});
