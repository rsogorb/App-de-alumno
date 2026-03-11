import React from 'react';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Información Importante</ThemedText>
      
      <ThemedText style={{ marginTop: 10, textAlign: 'center' }}>
        Este es un mensaje modal para avisos rápidos o ayuda al usuario.
      </ThemedText>

      {/* dismissTo hace que al cerrar el modal vuelvas a la raíz */}
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Entendido, volver al inicio</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});