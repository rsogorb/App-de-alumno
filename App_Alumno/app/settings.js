import { Ionicons } from "@expo/vector-icons";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function SettingsScreen() {
  const { dark, toggleTheme, colors } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 8,
    fontWeight: "600",
  },
  card: { borderRadius: 12, paddingHorizontal: 16, overflow: "hidden" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  leftSide: { flexDirection: "row", alignItems: "center" },
  label: { fontSize: 17 },
  footerNote: {
    fontSize: 13,
    marginTop: 10,
    paddingHorizontal: 8,
    lineHeight: 18,
  },
});
