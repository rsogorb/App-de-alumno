import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("userTheme");
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    await AsyncStorage.setItem("userTheme", newValue ? "dark" : "light");
  };

  const themeValue = useMemo(
    () => ({
      dark: isDarkMode,
      toggleTheme,
      colors: {
        background: isDarkMode ? "#222121" : "#F2F2F7",
        card: isDarkMode ? "#161616" : "#FFFFFF",
        text: isDarkMode ? "#FFFFFF" : "#000000",
        subtext: "#8E8E93",
        border: isDarkMode ? "#38383A" : "#E5E5E7",
        primary: isDarkMode ? "#0A84FF" : "#004A99",
      },
    }),
    [isDarkMode],
  );

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  return context;
};
