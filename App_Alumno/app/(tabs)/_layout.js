import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
// 1. Importamos el hook del tema
import { useTheme } from "../../context/ThemeContext";

export default function TabsLayout() {
  // 2. Extraemos los colores actuales
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        // 3. Aplicamos los colores dinámicos
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.card, // Fondo del título superior
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          color: colors.text, // Color del texto del título
        },
        tabBarStyle: {
          backgroundColor: colors.card, // Fondo de la barra inferior
          borderTopColor: colors.border,
        },
      }}
    >
      {/* 1. Inicio */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* 2. Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Mi Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Explorar */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Nosotros",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cursos"
        options={{
          href: null,
          title: "Catálogo de Cursos",
          // Importante: Aplicar estilo aquí también por si entras directamente
          headerStyle: { backgroundColor: colors.card },
          headerTitleStyle: { color: colors.text },
        }}
      />
    </Tabs>
  );
}
