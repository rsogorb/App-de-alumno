import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#004A99", // Color corporativo Grupo ATU
        tabBarInactiveTintColor: "gray",
        headerShown: true, // Muestra el título arriba de la pantalla
        headerStyle: {
          backgroundColor: "#f8f8f8",
        },
      }}
    >
      {/* 1. Inicio (Tu Dashboard de iconos) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* 2. Perfil (Datos del alumno) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Mi Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Explorar (Sobre Grupo ATU) */}
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
          href: null, // <--- ESTO OCULTA LA PESTAÑA DE LA BARRA INFERIOR
          title: "Catálogo de Cursos",
        }}
      />
    </Tabs>
  );
}
