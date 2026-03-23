import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router"; // Corregido: useFocusEffect
import { useCallback, useEffect, useState } from "react"; // Corregido: useCallback
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { getCursos } from "../services/cursosServices";

const CursosScreen = () => {
  const { user } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const router = useRouter();

  const cities = ["Todas", "Almería", "Madrid", "Barcelona"];
  const levels = ["Todos", "Avanzado", "Intermedio", "Experto"];
  const durations = [
    { label: "Todas", value: "", min: 0, max: 999 },
    { label: "Corta (< 50h)", value: "short", min: 0, max: 50 },
    { label: "Media (50-100h)", value: "medium", min: 50, max: 100 },
    { label: "Larga (> 100h)", value: "long", min: 100, max: 999 },
  ];

  // --- PUNTO 2: REFRESCAR AL GANAR EL FOCO ---
  useFocusEffect(
    useCallback(() => {
      if (user?.dni) {
        loadData();
      }
    }, [user?.dni]),
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const cursosApp = await getCursos();
      const { getStudentProfile } = require("../services/studentService");
      const profile = await getStudentProfile(user.dni);

      if (profile) {
        // Obtenemos los IDs de las inscripciones del alumno (ej: ["C001", "C002"])
        const enrolledIds = (profile.enrollments || []).map((ins) =>
          String(ins.name),
        );

        // 1. Sincronizamos la lista general: Marcamos isEnrolled si el ID está en la lista del alumno
        const updatedAll = cursosApp.map((c) => ({
          ...c,
          isEnrolled: enrolledIds.includes(String(c.id)),
        }));
        setAllCourses(updatedAll);

        // 2. Sincronizamos "Mis Cursos": Filtramos los que están inscritos
        const enrolled = updatedAll.filter((c) => c.isEnrolled);
        setMyCourses(enrolled);
      }
    } catch (error) {
      console.error("Error en loadData:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- LÓGICA DE FILTRADO ---
  useEffect(() => {
    let result = [];

    if (currentFilter === "enrolled") {
      result = myCourses;
    } else if (currentFilter === "available") {
      // Filtrar los que NO están inscritos
      result = allCourses.filter((c) => !c.isEnrolled);
    } else {
      result = allCourses;
    }

    if (searchQuery.trim() !== "") {
      const term = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term),
      );
    }

    if (selectedCity && selectedCity !== "Todas") {
      result = result.filter((course) => course.city === selectedCity);
    }

    if (selectedLevel && selectedLevel !== "Todos") {
      result = result.filter((course) => course.level === selectedLevel);
    }

    if (selectedDuration) {
      const durationRange = durations.find((d) => d.value === selectedDuration);
      if (durationRange) {
        result = result.filter(
          (course) =>
            course.durationHours >= durationRange.min &&
            course.durationHours < durationRange.max,
        );
      }
    }

    setFilteredCourses(result);
    setActiveFiltersCount(
      (selectedCity && selectedCity !== "Todas" ? 1 : 0) +
        (selectedLevel && selectedLevel !== "Todos" ? 1 : 0) +
        (selectedDuration ? 1 : 0),
    );
  }, [
    currentFilter,
    searchQuery,
    allCourses,
    myCourses,
    selectedCity,
    selectedLevel,
    selectedDuration,
  ]);

  const renderCourseCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.courseName}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>📍 {item.city || "Online"}</Text>
          <Text style={styles.tag}>⏱️ {item.duration}</Text>
          <Text style={styles.tag}>📊 {item.level}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            item.isEnrolled ? styles.buttonEnrolled : styles.buttonAction,
          ]}
          onPress={() => {
            router.push({
              pathname: "/course-detail",
              params: {
                courseId: item.id,
                courseName: item.name,
                courseDescription: item.description,
                courseDuration: item.duration,
                courseLevel: item.level,
                courseImage: item.image,
                isEnrolled: item.isEnrolled ? "true" : "false",
              },
            });
          }}
        >
          <Text style={styles.buttonText}>
            {item.isEnrolled ? "Acceder" : "Saber más"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const aplicarFiltros = () => setShowFilters(false);
  const limpiarFiltros = () => {
    setSelectedCity("");
    setSelectedLevel("");
    setSelectedDuration("");
    setSearchQuery("");
    setShowFilters(false);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2469F5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Centro de Formación</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar cursos..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options-outline" size={24} color="#004A99" />
            {activeFiltersCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.filterTabs}>
          {["all", "available", "enrolled"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, currentFilter === tab && styles.activeTab]}
              onPress={() => setCurrentFilter(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  currentFilter === tab && styles.activeTabText,
                ]}
              >
                {tab === "all"
                  ? "Todos"
                  : tab === "available"
                    ? "Disponibles"
                    : "Mis Cursos"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredCourses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => String(item.id)} // Forzar string para el key
        contentContainerStyle={styles.listPadding}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se han encontrado cursos.</Text>
        }
      />

      {/* Modal de filtros (Mismo código que tenías) */}
      <Modal visible={showFilters} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtros avanzados</Text>
            {/* ... resto del contenido del modal igual ... */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={limpiarFiltros}
              >
                <Text style={styles.clearButtonText}>Limpiar todo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={aplicarFiltros}
              >
                <Text style={styles.applyButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    backgroundColor: "white",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1A1A1A",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: { height: 45, fontSize: 16, flex: 1 },
  filterButton: {
    width: 45,
    height: 45,
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // ← NUEVO para posicionar el badge
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  filterTabs: { flexDirection: "row", justifyContent: "space-between" },
  tab: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
  activeTab: { backgroundColor: "#2469F5" },
  tabText: { color: "#666", fontWeight: "600" },
  activeTabText: { color: "white" },
  listPadding: { padding: 15 },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
    overflow: "hidden",
  },
  image: { width: "100%", height: 160 },
  infoContainer: { padding: 15 },
  courseName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  description: { color: "#666", fontSize: 14, marginBottom: 10 },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
    gap: 8,
  },
  tag: {
    fontSize: 12,
    color: "#888",
    backgroundColor: "#F0F2F5",
    padding: 5,
    borderRadius: 5,
  },
  button: { padding: 12, borderRadius: 10, alignItems: "center" },
  buttonAction: { backgroundColor: "#2469F5" },
  buttonEnrolled: { backgroundColor: "#34C759" },
  buttonText: { color: "white", fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
    color: "#333",
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F0F2F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterChipActive: {
    backgroundColor: "#2469F5",
    borderColor: "#2469F5",
  },
  filterChipText: {
    fontSize: 14,
    color: "#666",
  },
  filterChipTextActive: {
    color: "white",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 30,
    gap: 10,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#F0F2F5",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#2469F5",
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default CursosScreen;
