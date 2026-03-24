import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonProfile = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Animación de parpadeo infinita
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.ScrollView style={[styles.container, { opacity }]}>
      {/* Cabecera con avatar */}
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.name} />
        <View style={styles.dni} />
        <View style={styles.editButton} />
      </View>

      {/* Sección Identificación Académica */}
      <View style={styles.section}>
        <View style={styles.sectionTitle} />
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowIcon} />
            <View style={styles.rowContent}>
              <View style={styles.rowLabel} />
              <View style={styles.rowValue} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowIcon} />
            <View style={styles.rowContent}>
              <View style={styles.rowLabel} />
              <View style={styles.rowValue} />
            </View>
          </View>
        </View>
      </View>

      {/* Sección Datos de Contacto */}
      <View style={styles.section}>
        <View style={styles.sectionTitle} />
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowIcon} />
            <View style={styles.rowContent}>
              <View style={styles.rowLabel} />
              <View style={styles.rowValue} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowIcon} />
            <View style={styles.rowContent}>
              <View style={styles.rowLabel} />
              <View style={styles.rowValue} />
            </View>
          </View>
        </View>
      </View>

      {/* Sección Mis Cursos */}
      <View style={styles.section}>
        <View style={styles.sectionTitle} />
        <View style={styles.card}>
          <View style={styles.courseRow}>
            <View style={styles.courseIcon} />
            <View style={styles.courseInfo}>
              <View style={styles.courseName} />
              <View style={styles.courseStatus} />
            </View>
          </View>
        </View>
      </View>

      {/* Sección Sesión */}
      <View style={styles.section}>
        <View style={styles.sectionTitle} />
        <View style={styles.card}>
          <View style={styles.logoutRow}>
            <View style={styles.logoutIcon} />
            <View style={styles.logoutContent}>
              <View style={styles.logoutText} />
              <View style={styles.logoutSubtext} />
            </View>
          </View>
        </View>
      </View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    backgroundColor: "#FFF",
    paddingVertical: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E7",
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#C0C0C0",
    marginBottom: 12,
  },
  name: {
    width: 150,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#C0C0C0",
    marginBottom: 8,
  },
  dni: {
    width: 100,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#C0C0C0",
    marginBottom: 15,
  },
  editButton: {
    width: 120,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#C0C0C0",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    width: 120,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#C0C0C0",
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    flexDirection: "row",
    alignItems: "center",
  },
  rowIcon: {
    width: 25,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#C0C0C0",
    marginRight: 15,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    width: 40,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#C0C0C0",
    marginBottom: 6,
  },
  rowValue: {
    width: "80%",
    height: 16,
    borderRadius: 8,
    backgroundColor: "#C0C0C0",
  },
  courseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  courseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#C0C0C0",
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    width: "70%",
    height: 15,
    borderRadius: 8,
    backgroundColor: "#C0C0C0",
    marginBottom: 6,
  },
  courseStatus: {
    width: "50%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#C0C0C0",
  },
  logoutRow: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  logoutIcon: {
    width: 25,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#C0C0C0",
    marginRight: 15,
  },
  logoutContent: {
    flex: 1,
  },
  logoutText: {
    width: 100,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#C0C0C0",
    marginBottom: 4,
  },
  logoutSubtext: {
    width: 150,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#C0C0C0",
  },
});

export default SkeletonProfile;