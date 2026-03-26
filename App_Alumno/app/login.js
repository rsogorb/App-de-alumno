import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { mockStudents } from "../mocks/mocks";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const USUARIO_TEST = "alumno@atu.com";
    const PASS_TEST = "1234";

    if (email.toLowerCase() === USUARIO_TEST && password === PASS_TEST) {
      const DNI_A_BUSCAR = "71750101Z";

      const studentData = mockStudents.find((s) => s.dni === DNI_A_BUSCAR);

      if (studentData) {
        await login({
          ...studentData,
          applicantId: "EDU-APP-2025-13819",
        });
        router.replace("/(tabs)");
      } else {
        console.log("Usando datos reales de Jennifer");
        await login({
          dni: "71750101Z",
          first_name: "JENNIFER DAYANARA",
          last_name: "NOBOA MONAR",
          nombrePila: "Jennifer Dayanara",
          applicantId: "EDU-APP-2025-13819",
          email: "jenniferdayanara@gmail.com",
          enrollments: [{}, {}],
        });
        router.replace("/(tabs)");
      }
    } else {
      Alert.alert("Acceso Denegado", "Usuario o contraseña incorrectos.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
        {/* LOGO O ICONO */}
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={80} color="#004A99" />
          <Text style={styles.title}>Portal Alumno</Text>
          <Text style={styles.subtitle}>Grupo ATU</Text>
        </View>

        {/* FORMULARIO */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.registerText}>
              ¿No tienes cuenta?{" "}
              <Text style={styles.registerLink}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#004A99",
    fontWeight: "600",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#004A99",
    borderRadius: 12,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#004A99",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 14,
  },
  registerLink: {
    color: "#004A99",
    fontWeight: "bold",
  },
});
