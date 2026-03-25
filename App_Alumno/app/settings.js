import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import * as NotificationService from "../services/notificationService";

const NOTIFICATIONS_KEY = "@user_notifications_enabled";

export default function SettingsScreen() {
  const { dark, toggleTheme, colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        if (savedValue !== null) {
          setNotificationsEnabled(JSON.parse(savedValue));
        }
      } catch (e) {
        console.log("Error cargando ajustes", e);
      }
    };
    loadSettings();
  }, []);

  const toggleNotifications = async (value) => {
    if (value) {
      const granted = await NotificationService.requestPermissions();
      if (granted) {
        setNotificationsEnabled(true);
        await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(true));
        //Enviamos una notificación de prueba
        await NotificationService.sendLocalNotification(
          "¡Notificaciones activadas!",
          "Te avisaremos de tus próximos cursos.",
        );
      } else {
        setNotificationsEnabled(false);
        await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(false));
      }
    } else {
      setNotificationsEnabled(false);
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(false));
      await NotificationService.cancelAllNotifications();
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      {/* SECCIÓN: APARIENCIA */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
          APARIENCIA
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.row}>
            <View style={styles.leftSide}>
              <Ionicons
                name={dark ? "moon" : "sunny"}
                size={22}
                color={colors.primary}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.label, { color: colors.text }]}>
                Modo Oscuro
              </Text>
            </View>
            <Switch
              value={dark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#D1D1D6", true: "#34C759" }}
              thumbColor={
                Platform.OS === "ios"
                  ? undefined
                  : dark
                    ? colors.primary
                    : "#f4f3f4"
              }
            />
          </View>
        </View>
        <Text style={[styles.footerNote, { color: colors.subtext }]}>
          Activa el modo oscuro para descansar la vista en entornos de poca luz.
        </Text>
      </View>

      {/* SECCIÓN: CUENTA */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
          CUENTA Y SEGURIDAD
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[
              styles.row,
              { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            onPress={() => router.push("/change-password")}
          >
            <View style={styles.leftSide}>
              <Ionicons
                name="lock-closed"
                size={22}
                color={colors.primary}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.label, { color: colors.text }]}>
                Cambiar contraseña
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              Alert.alert(
                "Eliminar cuenta",
                "¿Estás seguro? Esta acción no se puede deshacer.",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => console.log("Eliminar"),
                  },
                ],
              );
            }}
          >
            <View style={styles.leftSide}>
              <Ionicons
                name="trash-outline"
                size={22}
                color="#FF3B30"
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.label, { color: "#FF3B30" }]}>
                Eliminar cuenta
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
          </TouchableOpacity>
        </View>
      </View>

      {/* SECCIÓN: NOTIFICACIONES */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
          NOTIFICACIONES
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.row}>
            <View style={styles.leftSide}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={colors.primary}
                style={{ marginRight: 10 }}
              />
              <View>
                <Text style={[styles.label, { color: colors.text }]}>
                  Notificaciones Push
                </Text>
                <Text style={{ color: colors.subtext, fontSize: 12 }}>
                  Avisos de cursos y mensajes
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: colors.primary + "80" }}
              thumbColor={notificationsEnabled ? colors.primary : "#f4f3f4"}
              onValueChange={toggleNotifications}
              value={notificationsEnabled}
            />
          </View>
        </View>
      </View>

      {/* SECCIÓN: SOPORTE Y LEGAL */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
          SOPORTE Y LEGAL
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[
              styles.row,
              { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            onPress={() => Linking.openURL("https://www.grupoatu.com/contacto")}
          >
            <View style={styles.leftSide}>
              <Ionicons
                name="help-circle-outline"
                size={22}
                color={colors.primary}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.label, { color: colors.text }]}>
                Centro de Ayuda / FAQ
              </Text>
            </View>
            <Ionicons name="open-outline" size={18} color={colors.subtext} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.row,
              { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            onPress={() => Linking.openURL("mailto:soporte@grupoatu.com")}
          >
            <View style={styles.leftSide}>
              <Ionicons
                name="mail-outline"
                size={22}
                color={colors.primary}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.label, { color: colors.text }]}>
                Contactar con Soporte
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              Linking.openURL("https://www.grupoatu.com/politica-de-privacidad")
            }
          >
            <View style={styles.leftSide}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color={colors.primary}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.label, { color: colors.text }]}>
                Términos y Privacidad
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
          </TouchableOpacity>
        </View>
      </View>

      {/* PIE DE PÁGINA */}
      <View style={{ marginTop: 30, alignItems: "center", marginBottom: 50 }}>
        <Text
          style={{ color: colors.subtext, fontSize: 13, fontWeight: "500" }}
        >
          Versión 1.0.0 (Build 42)
        </Text>
        <Text style={{ color: colors.subtext, fontSize: 11, marginTop: 4 }}>
          © 2026 Grupo ATU · Todos los derechos reservados
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 8,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  card: { borderRadius: 12, paddingHorizontal: 16, overflow: "hidden" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  leftSide: { flexDirection: "row", alignItems: "center" },
  label: { fontSize: 16, fontWeight: "500" },
  footerNote: {
    fontSize: 13,
    marginTop: 10,
    paddingHorizontal: 8,
    lineHeight: 18,
  },
});
