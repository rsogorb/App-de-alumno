import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Collapsible } from "../../components/collapsible";
import { ExternalLink } from "../../components/external-link";
import ParallaxScrollView from "../../components/parallax-scroll-view";
import { useTheme } from "../../context/ThemeContext";

export default function AboutAtuScreen() {
  const { colors, dark } = useTheme();

  return (
    <ParallaxScrollView
      // 2. El encabezado ahora usa tus colores (puedes ajustarlos aquí)
      headerBackgroundColor={{
        light: "#004A99",
        dark: "#1C1C1E",
      }}
      style={{ backgroundColor: colors.background }}
      headerImage={
        <Ionicons
          size={250}
          name="business"
          color="rgba(255, 255, 255, 0.2)"
          style={styles.headerImage}
        />
      }
    >
      {/* 3. Título Principal */}
      <View style={styles.titleContainer}>
        <Text style={[styles.titleText, { color: colors.text }]}>
          Grupo ATU
        </Text>
      </View>

      {/* 4. Texto de Introducción */}
      <Text style={[styles.introText, { color: colors.text }]}>
        Líderes en formación y servicios educativos con más de 30 años de
        experiencia a nivel nacional.
      </Text>

      {/* 5. Secciones desplegables */}
      <Collapsible title="¿Quiénes somos?">
        <Text style={{ color: colors.subtext, lineHeight: 22 }}>
          Grupo ATU es una red de centros de formación especializada en la
          capacitación profesional. Nuestra misión es mejorar la empleabilidad
          de las personas y la competitividad de las empresas.
        </Text>
      </Collapsible>

      <Collapsible title="Nuestros Centros">
        <Text style={{ color: colors.subtext, lineHeight: 22 }}>
          Contamos con más de 60 centros propios repartidos por toda la
          geografía española, dotados con la última tecnología para ofrecer una
          formación de calidad.
        </Text>
      </Collapsible>

      <Collapsible title="Formación Oficial">
        <Text style={{ color: colors.subtext, lineHeight: 22 }}>
          Impartimos Certificados de Profesionalidad, Formación Profesional
          (FP), especialidades vinculadas al SEPE y formación bonificada para
          empresas.
        </Text>
      </Collapsible>

      {/* 6. Enlace Externo */}
      <View style={styles.linkContainer}>
        <ExternalLink href="https://cursosatu.grupoatu.com/">
          <Text style={{ color: colors.primary, fontWeight: "bold" }}>
            Visitar sitio web oficial
          </Text>
        </ExternalLink>
      </View>

      {/* 7. Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.subtext }]}>
          Versión de la App: 1.0.0
        </Text>
        <Text style={[styles.footerText, { color: colors.subtext }]}>
          © 2026 Grupo ATU
        </Text>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -50,
    left: -20,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
    padding: 15,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
    opacity: 0.5,
  },
  footerText: {
    fontSize: 12,
  },
});
