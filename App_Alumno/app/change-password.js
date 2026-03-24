import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);

  const handleSave = () => {
    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Por favor, rellena todos los campos.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Seguridad",
        "La nueva contraseña debe tener al menos 6 caracteres.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Error",
        "La nueva contraseña y su confirmación no coinciden.",
      );
      return;
    }

    // TODO: Aquí iría tu llamada a la API (fetch o axios)
    Alert.alert("Éxito", "Tu contraseña ha sido actualizada correctamente.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Nueva Contraseña
        </Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          Asegúrate de que sea una combinación segura que no uses en otros
          sitios.
        </Text>

        <View style={styles.form}>
          {/* Campo: Contraseña Actual */}
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Contraseña actual"
              placeholderTextColor={colors.subtext}
              secureTextEntry={!showPass}
              value={form.currentPassword}
              onChangeText={(txt) => setForm({ ...form, currentPassword: txt })}
            />
          </View>

          {/* Campo: Nueva Contraseña */}
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Nueva contraseña"
              placeholderTextColor={colors.subtext}
              secureTextEntry={!showPass}
              value={form.newPassword}
              onChangeText={(txt) => setForm({ ...form, newPassword: txt })}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons
                name={showPass ? "eye-off" : "eye"}
                size={20}
                color={colors.subtext}
              />
            </TouchableOpacity>
          </View>

          {/* Campo: Confirmar Contraseña */}
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Confirmar nueva contraseña"
              placeholderTextColor={colors.subtext}
              secureTextEntry={!showPass}
              value={form.confirmPassword}
              onChangeText={(txt) => setForm({ ...form, confirmPassword: txt })}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Actualizar contraseña</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "800", marginBottom: 8 },
  subtitle: { fontSize: 15, marginBottom: 32, lineHeight: 22 },
  form: { gap: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  input: { flex: 1, fontSize: 16 },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
  },
  container: {
    padding: 24,
    paddingTop: 100,
  },
});
