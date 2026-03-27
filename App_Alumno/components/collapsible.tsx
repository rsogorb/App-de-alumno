import { IconSymbol } from "@/components/ui/icon-symbol";
import { PropsWithChildren, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const { colors, dark } = useTheme();

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  return (
    <View style={{ backgroundColor: "transparent" }}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setIsOpen(!isOpen);
        }}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={colors.primary}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />

        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </TouchableOpacity>

      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    marginTop: 6,
    marginLeft: 26,
    marginBottom: 10,
  },
});
