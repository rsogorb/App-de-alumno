import { IconSymbol } from "@/components/ui/icon-symbol";
import { PropsWithChildren, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// 1. Importamos tu contexto (ajusta la ruta si es necesario)
import { useTheme } from "../context/ThemeContext";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // 2. Usamos tus colores globales
  const { colors, dark } = useTheme();

  return (
    // 3. Cambiamos ThemedView por View con tu color de fondo
    <View style={{ backgroundColor: "transparent" }}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          // 4. El icono ahora usa tu color primario o el de texto
          color={colors.primary}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />

        {/* 5. El texto ahora usa tu color de texto global */}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </TouchableOpacity>

      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    marginTop: 6,
    marginLeft: 26,
    marginBottom: 10,
  },
});
