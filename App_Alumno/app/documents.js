import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getStudentDocuments } from "../services/studentService";

export default function DocumentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    const data = await getStudentDocuments(user?.dni, user?.applicantId);
    setDocs(data);
    setLoading(false);
  };

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [docs, searchQuery]);

  const openDocument = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "No se puede abrir el archivo");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.docCard, { backgroundColor: colors.card }]}
      onPress={() => openDocument(item.url)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: "#FF3B3015" }]}>
        <Ionicons name="document-text" size={26} color="#FF3B30" />
      </View>

      <View style={styles.infoContainer}>
        <Text
          style={[styles.docName, { color: colors.text }]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <View style={styles.detailsRow}>
          <Text style={[styles.docSub, { color: colors.subtext }]}>
            {item.date}
          </Text>
          <Text style={[styles.dot, { color: colors.subtext }]}> • </Text>
          <Text style={[styles.docSub, { color: colors.subtext }]}>
            {item.size}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.border} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.card }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Mis Documentos
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <Ionicons
            name="search"
            size={20}
            color={colors.subtext}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Buscar por nombre..."
            placeholderTextColor={colors.subtext}
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={colors.subtext} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#004A99" />
        </View>
      ) : (
        <FlatList
          data={filteredDocs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="folder-open-outline"
                size={70}
                color={colors.border}
              />
              <Text style={[styles.emptyText, { color: colors.subtext }]}>
                No hay documentos disponibles.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 20, paddingTop: 10 },
  docCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: { flex: 1, marginLeft: 15 },
  docName: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  detailsRow: { flexDirection: "row", alignItems: "center" },
  docSub: { fontSize: 13 },
  dot: { fontSize: 16, fontWeight: "bold" },
  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
