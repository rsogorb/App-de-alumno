import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, View } from "react-native"; // Cambiamos ThemedView por View
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from "react-native-reanimated";

// 1. IMPORTA TU CONTEXTO
import { useTheme } from "../context/ThemeContext";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  // 2. USA TU HOOK EN LUGAR DEL DE EXPO
  const { colors, dark } = useTheme();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      // 3. USA TUS COLORES DINÁMICOS AQUÍ
      style={{ backgroundColor: colors.background, flex: 1 }}
      scrollEventThrottle={16}
    >
      <Animated.View
        style={[
          styles.header,
          // 4. USA TU VARIABLE 'dark' PARA ELEGIR EL COLOR DE LA CABECERA
          {
            backgroundColor: dark
              ? headerBackgroundColor.dark
              : headerBackgroundColor.light,
          },
          headerAnimatedStyle,
        ]}
      >
        {headerImage}
      </Animated.View>

      {/* 5. CAMBIAMOS THEMEDVIEW POR UN VIEW NORMAL CON TU COLOR */}
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        {children}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
});
