import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router"; // Importar Router
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAuth } from "../context/AuthContext"; // Importar Auth
import { useStudent } from "../hooks/useStudent";
import {
  updateStudentProfile,
  uploadStudentPhoto,
} from "../services/studentService";

export default function ProfileScreen() {
  const { user, logout } = useAuth(); // Obtener datos del contexto
  const router = useRouter();

  // USAMOS EL DNI DEL USUARIO LOGUEADO
  const {
    data: student,
    isLoading,
    refetch,
  } = useStudent(user?.dni || "Z1368407G");

  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [tempPhoto, setTempPhoto] = useState(null);

  useEffect(() => {
    if (student) {
      setFormData({
        student_mobile_number: student.telefono,
        gender: student.genero,
        nationality: student.nacionalidad,
        date_of_birth: student.fechaNacimiento,
        student_email_id: student.correoElectronico,
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

  if (isLoading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#004A99" />
      </View>
    );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* CABECERA */}
      <View style={styles.header}>
        <TouchableOpacity onPress={changePhoto} disabled={uploading}>
          <View style={styles.avatarWrapper}>
            {tempPhoto || student?.foto ? (
              <Image
                key={tempPhoto || student?.foto}
                source={{ uri: tempPhoto || student?.foto }}
                style={styles.avatarImg}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarLetter}>
                  {student?.nombrePila?.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              {uploading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={{ fontSize: 12 }}>📸</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.nameText}>{student?.nombreCompleto}</Text>
        <Text style={styles.idSubtext}>DNI: {student?.dni}</Text>
        <TouchableOpacity
          style={[styles.editBtn, isEditing && styles.saveBtn]}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        >
          <Text style={[styles.editBtnText, isEditing && { color: "#FFF" }]}>
            {isEditing ? "✓ Guardar Cambios" : "✎ Editar Perfil"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* BLOQUES DE INFO (Los que ya tenías) */}
      <Text style={styles.sectionTitle}>Identificación Académica</Text>
      <View style={styles.card}>
        <InfoRow label="DNI / NIE" value={student?.dni} icon="🆔" />
        <InfoRow label="Situación" value={student?.status} icon="📊" last />
      </View>

      <Text style={styles.sectionTitle}>Datos de Contacto</Text>
      <View style={styles.card}>
        <EditableRow
          label="Email"
          value={formData.student_email_id}
          isEditing={isEditing}
          onChange={(val) =>
            setFormData({ ...formData, student_email_id: val })
          }
          icon="✉️"
        />
        <EditableRow
          label="Teléfono"
          value={formData.student_mobile_number}
          isEditing={isEditing}
          onChange={(val) =>
            setFormData({ ...formData, student_mobile_number: val })
          }
          icon="📱"
          last
        />
      </View>

      {/* --- EL BOTÓN DE CERRAR SESIÓN --- */}
      <Text style={styles.sectionTitle}>Sesión</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={[styles.row, { borderBottomWidth: 0 }]}
          onPress={handleLogout}
        >
          <Text style={styles.rowIcon}>🚪</Text>
          <View>
            <Text
              style={[styles.rowValue, { color: "#FF3B30", fontWeight: "600" }]}
            >
              Cerrar Sesión
            </Text>
            <Text style={styles.rowLabel}>
              Salir de la cuenta de {student?.nombrePila}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {isEditing && (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setIsEditing(false)}
        >
          <Text style={{ color: "#FF3B30", fontWeight: "600" }}>
            Cancelar cambios
          </Text>
        </TouchableOpacity>
      )}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setFormData({
            ...formData,
            date_of_birth: date.toISOString().split("T")[0],
          });
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
        maximumDate={new Date()}
      />
    </ScrollView>
  );
}

// Mantenemos tus componentes auxiliares InfoRow, EditableRow y los styles...
const InfoRow = ({ label, value, icon, last }) => (
  <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
    <Text style={styles.rowIcon}>{icon}</Text>
    <View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || "No disponible"}</Text>
    </View>
  </View>
);

const EditableRow = ({ label, value, isEditing, onChange, icon, last }) => (
  <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
    <Text style={styles.rowIcon}>{icon}</Text>
    <View style={{ flex: 1 }}>
      <Text style={styles.rowLabel}>{label}</Text>
      {isEditing ? (
        <TextInput style={styles.input} value={value} onChangeText={onChange} />
      ) : (
        <Text style={styles.rowValue}>{value || "No definido"}</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#FFF",
    paddingVertical: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E7",
  },
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
    backgroundColor: "#004A99",
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
    borderColor: "#FFF",
    elevation: 4,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    color: "#1C1C1E",
  },
  idSubtext: { fontSize: 13, color: "#8E8E93", marginBottom: 15 },
  editBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
  },
  saveBtn: { backgroundColor: "#34C759" },
  editBtnText: { fontSize: 14, fontWeight: "600", color: "#004A99" },
  sectionTitle: {
    fontSize: 11,
    color: "#8E8E93",
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    flexDirection: "row",
    alignItems: "center",
  },
  rowIcon: { fontSize: 18, marginRight: 15, width: 25, textAlign: "center" },
  rowLabel: { fontSize: 11, color: "#8E8E93" },
  rowValue: { fontSize: 16, color: "#1C1C1E", marginTop: 1 },
  input: {
    fontSize: 16,
    color: "#007AFF",
    borderBottomWidth: 1,
    borderBottomColor: "#007AFF",
    paddingVertical: 2,
  },
  cancelBtn: { marginTop: 20, marginBottom: 20, alignItems: "center" },
});
