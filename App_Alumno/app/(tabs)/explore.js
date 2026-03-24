import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import Collapsible from "../../components/collapsible";
import { ExternalLink } from "../../components/external-link";
import { ParallaxScrollView } from "../../components/parallax-scroll-view";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function AboutAtuScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#004A99", dark: "#002D5D" }}
      headerImage={
        <Ionicons
          size={250}
          name="business"
          color="rgba(255, 255, 255, 0.2)"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Grupo ATU</ThemedText>
      </ThemedView>

      <ThemedText style={styles.introText}>
        Líderes en formación y servicios educativos con más de 30 años de
        experiencia a nivel nacional.
      </ThemedText>

      <Collapsible title="¿Quiénes somos?">
        <ThemedText>
          Grupo ATU es una red de centros de formación especializada en la
          capacitación profesional. Nuestra misión es mejorar la empleabilidad
          de las personas y la competitividad de las empresas.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Nuestros Centros">
        <ThemedText>
          Contamos con más de 60 centros propios repartidos por toda la
          geografía española, dotados con la última tecnología para ofrecer una
          formación de calidad.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Formación Oficial">
        <ThemedText>
          Impartimos Certificados de Profesionalidad, Formación Profesional
          (FP), especialidades vinculadas al SEPE y formación bonificada para
          empresas.
        </ThemedText>
      </Collapsible>

      <ThemedView style={styles.linkContainer}>
        <ExternalLink href="https://cursosatu.grupoatu.com/">
          <ThemedText type="link">Visitar sitio web oficial</ThemedText>
        </ExternalLink>
      </ThemedView>

      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Versión de la App: 1.0.0
        </ThemedText>
        <ThemedText style={styles.footerText}>© 2024 Grupo ATU</ThemedText>
      </ThemedView>
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
    color: "#444",
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
