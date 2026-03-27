import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SkeletonCourseCard from "../../components/SkeletonCourseCard";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getCursos } from "../../services/cursosServices";

const CursosScreen = () => {
  const { user } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  // Nuevos filtros (reemplazan a los antiguos)
  const [provincias, setProvincias] = useState(["Todas"]);
  const [familias, setFamilias] = useState(["Todas"]);
  const [areas, setAreas] = useState(["Todas"]);
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedFamilia, setSelectedFamilia] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isDataReady, setIsDataReady] = useState(false);

  const router = useRouter();
  const { colors, dark } = useTheme();

  const durations = [
    { label: "Todas", value: "", min: 0, max: 999 },
    { label: "Corta (< 50h)", value: "short", min: 0, max: 50 },
    { label: "Media (50-100h)", value: "medium", min: 50, max: 100 },
    { label: "Larga (> 100h)", value: "long", min: 100, max: 999 },
  ];

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

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
      const { getStudentProfile } = require("../../services/studentService");
      const profile = await getStudentProfile(user.dni);

      if (profile) {
        const enrolledCourseIds = (
          profile.custom_acciones_formativas || []
        ).map((ins) => String(ins.course).trim().toLowerCase());

        const updatedAll = cursosApp.map((c) => {
          const isEnrolled = enrolledCourseIds.includes(
            String(c.id).trim().toLowerCase(),
          );

          return { ...c, isEnrolled };
        });

        setAllCourses(updatedAll);
        setMyCourses(updatedAll.filter((c) => c.isEnrolled));
      }
    } catch (error) {
      console.error("Error en loadData:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar opciones dinámicas para filtros
  useEffect(() => {
    const cargarOpciones = async () => {
      console.log("useEffect ejecutado, allCourses.length:", allCourses.length);
      if (allCourses.length === 0) return;

      console.log("Cargando opciones de filtros desde cursos...");

      const provinciasUnicas = [
        ...new Set(
          allCourses
            .map((c) => c.provincia)
            .filter((p) => p && p !== "Provincia no especificada"),
        ),
      ];
      setProvincias(["Todas", ...provinciasUnicas.sort()]);

      const familiasUnicas = [
        ...new Set(
          allCourses
            .map((c) => c.familiaFormativa)
            .filter((f) => f && f !== "Familia no especificada"),
        ),
      ];
      setFamilias(["Todas", ...familiasUnicas.sort()]);

      const areasUnicas = [
        ...new Set(
          allCourses
            .map((c) => c.areaProfesional)
            .filter((a) => a && a !== "Área no especificada"),
        ),
      ];
      setAreas(["Todas", ...areasUnicas.sort()]);

      setIsDataReady(true);

      console.log("Provincias:", provinciasUnicas);
      console.log("Familias:", familiasUnicas);
      console.log("Áreas:", areasUnicas);
    };

    cargarOpciones();
  }, [allCourses]);

  // --- LÓGICA DE FILTRADO ---
  useEffect(() => {
    let result = [];

    if (currentFilter === "enrolled") {
      result = myCourses;
    } else if (currentFilter === "available") {
      result = allCourses.filter((c) => !c.isEnrolled);
    } else {
      result = allCourses;
    }

    // Búsqueda por texto
    if (searchQuery.trim() !== "") {
      const term = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term),
      );
    }

    // Filtrar por provincia
    if (selectedProvincia && selectedProvincia !== "Todas") {
      result = result.filter(
        (course) => course.provincia === selectedProvincia,
      );
    }

    // Filtrar por familia formativa
    if (selectedFamilia && selectedFamilia !== "Todas") {
      result = result.filter(
        (course) => course.familiaFormativa === selectedFamilia,
      );
    }

    // Filtrar por área profesional
    if (selectedArea && selectedArea !== "Todas") {
      result = result.filter(
        (course) => course.areaProfesional === selectedArea,
      );
    }

    // Filtrar por duración
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

    const count =
      (selectedProvincia && selectedProvincia !== "Todas" ? 1 : 0) +
      (selectedFamilia && selectedFamilia !== "Todas" ? 1 : 0) +
      (selectedArea && selectedArea !== "Todas" ? 1 : 0) +
      (selectedDuration ? 1 : 0) +
      (searchQuery.trim() !== "" ? 1 : 0);
    setActiveFiltersCount(count);
  }, [
    currentFilter,
    searchQuery,
    allCourses,
    myCourses,
    selectedProvincia,
    selectedFamilia,
    selectedArea,
    selectedDuration,
  ]);

  const renderCourseCard = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={[styles.courseName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text
          style={[styles.description, { color: colors.subtext }]}
          numberOfLines={2}
        >
          {item.description ||
            `${item.familiaFormativa || ""} - ${item.areaProfesional || ""}`}
        </Text>
        <View style={styles.tagContainer}>
          <Text
            style={[
              styles.tag,
              {
                backgroundColor: dark ? "#3A3A3C" : "#F0F2F5",
                color: colors.subtext,
              },
            ]}
          >
            🏢{" "}
            {item.centro?.length > 25
              ? item.centro.substring(0, 22) + "..."
              : item.centro || "Centro no disponible"}
          </Text>
          <Text
            style={[
              styles.tag,
              {
                backgroundColor: dark ? "#3A3A3C" : "#F0F2F5",
                color: colors.subtext,
              },
            ]}
          >
            📍 {item.provincia || "Online"}
          </Text>
          <Text
            style={[
              styles.tag,
              {
                backgroundColor: dark ? "#3A3A3C" : "#F0F2F5",
                color: colors.subtext,
              },
            ]}
          >
            📚{" "}
            {item.familiaFormativa?.length > 20
              ? item.familiaFormativa.substring(0, 18) + "..."
              : item.familiaFormativa || "Familia"}
          </Text>
          <Text
            style={[
              styles.tag,
              {
                backgroundColor: dark ? "#3A3A3C" : "#F0F2F5",
                color: colors.subtext,
              },
            ]}
          >
            📊{" "}
            {item.areaProfesional?.length > 20
              ? item.areaProfesional.substring(0, 18) + "..."
              : item.areaProfesional || "Área"}
          </Text>
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
                courseCenter: item.centro,
                courseProvince: item.provincia,
                courseFamily: item.familiaFormativa,
                courseArea: item.areaProfesional,
                courseStartDate: item.startDate,
                courseEndDate: item.endDate,
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
    setSelectedProvincia("");
    setSelectedFamilia("");
    setSelectedArea("");
    setSelectedDuration("");
    setSearchQuery("");
    setShowFilters(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Centro de Formación
          </Text>
          <View style={styles.searchRow}>
            <View
              style={[
                styles.searchSkeleton,
                { backgroundColor: dark ? "#3A3A3C" : "#E0E0E0" },
              ]}
            />
            <View
              style={[
                styles.filterButtonSkeleton,
                { backgroundColor: dark ? "#3A3A3C" : "#E0E0E0" },
              ]}
            />
          </View>
          <View style={styles.filterTabsSkeleton}>
            <View
              style={[
                styles.tabSkeleton,
                { backgroundColor: dark ? "#3A3A3C" : "#E0E0E0" },
              ]}
            />
            <View
              style={[
                styles.tabSkeleton,
                { backgroundColor: dark ? "#3A3A3C" : "#E0E0E0" },
              ]}
            />
            <View
              style={[
                styles.tabSkeleton,
                { backgroundColor: dark ? "#3A3A3C" : "#E0E0E0" },
              ]}
            />
          </View>
        </View>
        <View style={styles.listPadding}>
          {[1, 2, 3].map((_, index) => (
            <SkeletonCourseCard key={index} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Centro de Formación
        </Text>
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchBox,
              { backgroundColor: dark ? "#3A3A3C" : "#F0F2F5" },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={colors.subtext}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Buscar cursos..."
              placeholderTextColor={colors.subtext}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: dark ? "#3A3A3C" : "#F0F2F5" },
            ]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons
              name="options-outline"
              size={24}
              color={dark ? colors.primary : "#004A99"}
            />
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
              style={[
                styles.tab,
                currentFilter === tab &&
                  (styles.activeTab || { backgroundColor: colors.primary }),
              ]}
              onPress={() => setCurrentFilter(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: colors.subtext },
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
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listPadding}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            No se han encontrado cursos.
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
      <Modal visible={showFilters} animationType="slide" transparent={false}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {/* Cabecera fija */}
          <View
            style={[
              styles.modalHeaderFixed,
              { borderBottomColor: colors.border },
            ]}
          >
            <Text style={[styles.modalTitleFixed, { color: colors.text }]}>
              Filtros avanzados
            </Text>
            <TouchableOpacity
              onPress={() => setShowFilters(false)}
              style={styles.modalCloseButtonFixed}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Área de contenido desplazable */}
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.modalScrollContentFixed}
            style={{ flex: 1 }}
          >
            {/* Provincia */}
            <Text style={[styles.filterLabelFixed, { color: colors.text }]}>
              Provincia
            </Text>
            <View style={styles.filterOptionsFixed}>
              {provincias &&
                provincias.map((provincia) => (
                  <TouchableOpacity
                    key={provincia}
                    style={[
                      styles.filterChipFixed,
                      { backgroundColor: dark ? "#2C2C2E" : "#F0F2F5" },
                      selectedProvincia === provincia &&
                        styles.filterChipActiveFixed,
                    ]}
                    onPress={() =>
                      setSelectedProvincia(
                        selectedProvincia === provincia ? "" : provincia,
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipTextFixed,
                        { color: colors.subtext },
                        selectedProvincia === provincia &&
                          styles.filterChipTextActiveFixed,
                      ]}
                    >
                      {provincia}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>

            {/* Familia Formativa */}
            <Text style={[styles.filterLabelFixed, { color: colors.text }]}>
              Familia Formativa
            </Text>
            <View style={styles.filterOptionsFixed}>
              {familias &&
                familias.map((familia) => (
                  <TouchableOpacity
                    key={familia}
                    style={[
                      styles.filterChipFixed,
                      { backgroundColor: dark ? "#2C2C2E" : "#F0F2F5" },
                      selectedFamilia === familia &&
                        styles.filterChipActiveFixed,
                    ]}
                    onPress={() =>
                      setSelectedFamilia(
                        selectedFamilia === familia ? "" : familia,
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipTextFixed,
                        { color: colors.subtext },
                        selectedFamilia === familia &&
                          styles.filterChipTextActiveFixed,
                      ]}
                    >
                      {familia}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>

            {/* Área Profesional */}
            <Text style={[styles.filterLabelFixed, { color: colors.text }]}>
              Área Profesional
            </Text>
            <View style={styles.filterOptionsFixed}>
              {areas &&
                areas.map((area) => (
                  <TouchableOpacity
                    key={area}
                    style={[
                      styles.filterChipFixed,
                      { backgroundColor: dark ? "#2C2C2E" : "#F0F2F5" },
                      selectedArea === area && styles.filterChipActiveFixed,
                    ]}
                    onPress={() =>
                      setSelectedArea(selectedArea === area ? "" : area)
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipTextFixed,
                        { color: colors.subtext },
                        selectedArea === area &&
                          styles.filterChipTextActiveFixed,
                      ]}
                    >
                      {area}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>

            {/* Duración */}
            <Text style={[styles.filterLabelFixed, { color: colors.text }]}>
              Duración
            </Text>
            <View style={styles.filterOptionsFixed}>
              {durations.map((duration) => (
                <TouchableOpacity
                  key={duration.label}
                  style={[
                    styles.filterChipFixed,
                    { backgroundColor: dark ? "#2C2C2E" : "#F0F2F5" },
                    selectedDuration === duration.value &&
                      styles.filterChipActiveFixed,
                  ]}
                  onPress={() =>
                    setSelectedDuration(
                      selectedDuration === duration.value ? "" : duration.value,
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterChipTextFixed,
                      { color: colors.subtext },
                      selectedDuration === duration.value &&
                        styles.filterChipTextActiveFixed,
                    ]}
                  >
                    {duration.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Espacio extra para que los botones no queden pegados */}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Botones fijos en la parte inferior */}
          <View
            style={[
              styles.modalButtonsFixed,
              { borderTopColor: colors.border, backgroundColor: colors.card },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.clearButtonFixed,
                { backgroundColor: dark ? "#3A3A3C" : "#F0F2F5" },
              ]}
              onPress={limpiarFiltros}
            >
              <Text
                style={[styles.clearButtonTextFixed, { color: colors.subtext }]}
              >
                Limpiar todo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.applyButtonFixed,
                { backgroundColor: colors.primary },
              ]}
              onPress={aplicarFiltros}
            >
              <Text style={styles.applyButtonTextFixed}>Aplicar</Text>
            </TouchableOpacity>
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
    position: "relative",
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
  searchSkeleton: {
    flex: 1,
    height: 45,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
  },
  filterButtonSkeleton: {
    width: 45,
    height: 45,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
  },
  filterTabsSkeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  tabSkeleton: {
    flex: 1,
    height: 36,
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    marginHorizontal: 5,
  },

  // ========== ESTILOS DEL MODAL DE FILTROS ==========
  modalHeaderFixed: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitleFixed: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalCloseButtonFixed: {
    padding: 8,
    marginRight: -8,
  },
  modalScrollContentFixed: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterLabelFixed: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  filterOptionsFixed: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },
  filterChipFixed: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterChipActiveFixed: {
    backgroundColor: "#2469F5",
    borderColor: "#2469F5",
  },
  filterChipTextFixed: {
    fontSize: 14,
  },
  filterChipTextActiveFixed: {
    color: "white",
  },
  modalButtonsFixed: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  clearButtonFixed: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  clearButtonTextFixed: {
    fontSize: 16,
    fontWeight: "600",
  },
  applyButtonFixed: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  applyButtonTextFixed: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CursosScreen;
