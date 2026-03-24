import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const authDataSerialized = await AsyncStorage.getItem("@AuthData");
        if (authDataSerialized) {
          const _user = JSON.parse(authDataSerialized);
          setUser(_user);
        }
      } catch (error) {
        console.error("Error cargando la sesión: ", error);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem("@AuthData", JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("@AuthData");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
