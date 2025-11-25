import { createContext, useContext, useState, useEffect } from "react";
import { loginUser as apiLoginUser, logoutUser as apiLogoutUser } from "../api/auth";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

    const login = async (credentials) => {
    const response = await apiLoginUser(credentials);
    const data = response.data;

    const userDto = data.user; 

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userDto));

    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    setUser(userDto);
    navigate("/dashboard");
    };

  const logout = async () => {
    try {
      await apiLogoutUser();
    } catch (err) {
      console.error("Logout failed, clearing local state anyway");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete api.defaults.headers.common['Authorization'];

    setUser(null);
    navigate("/login", { replace: true }); 
  };

  useEffect(() => {
    const handleStorage = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);