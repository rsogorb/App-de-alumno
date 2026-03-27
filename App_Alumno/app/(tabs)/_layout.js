import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { getAvisos } from "../../services/avisoService";

export default function TabsLayout() {
  const { colors } = useTheme();
  const [avisosNoLeidos, setAvisosNoLeidos] = useState(0);

  useEffect(() => {
    const cargarContador = async () => {
      const avisos = await getAvisos();
      const noLeidos = avisos.filter((a) => !a.leido).length;
      setAvisosNoLeidos(noLeidos);
    };
    cargarContador();

    // Actualizar cada 5 segundos (opcional)
    const interval = setInterval(cargarContador, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          color: colors.text,
        },
        tabBarStyle: {
          backgroundColor: colors.card,
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

      {/* 4. Avisos (con badge) */}
      <Tabs.Screen
        name="avisos"
        options={{
          title: "Avisos",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="notifications" size={size} color={color} />
              {avisosNoLeidos > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -8,
                    backgroundColor: "#FF3B30",
                    borderRadius: 10,
                    minWidth: 16,
                    height: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 3,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {avisosNoLeidos > 99 ? "99+" : avisosNoLeidos}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      {/* 5. Cursos (oculto en la barra) */}
      <Tabs.Screen
        name="cursos"
        options={{
          href: null,
          title: "Catálogo de Cursos",
          headerStyle: { backgroundColor: colors.card },
          headerTitleStyle: { color: colors.text },
        }}
      />
    </Tabs>
  );
}
