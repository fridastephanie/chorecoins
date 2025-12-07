import { createContext, useContext, useState, useEffect } from "react";
import { loginUser as apiLoginUser, logoutUser as apiLogoutUser } from "../api/auth";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  /**
   * Logs in a user using provided credentials.
   * Stores token and user in localStorage and sets the auth header.
   * Updates local user state and navigates to the dashboard.
   */
  const login = async (credentials) => {
    const response = await apiLoginUser(credentials);
    const data = response.data;

    const userDto = data.user;

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userDto));

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    setUser(userDto);
    navigate("/dashboard");
  };

  /**
   * Logs out the current user.
   * Clears local state and localStorage regardless of API success.
   */
  const logout = async () => {
    try {
      await apiLogoutUser();
    } catch (err) {
      console.error("Logout failed, clearing local state anyway");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];

    setUser(null);
    navigate("/login", { replace: true });
  };

  /**
   * Updates the current user in both React state and localStorage.
   * Used when the user updates profile info (name, email, etc).
   */
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * Keeps user state in sync with localStorage changes (multi-tab support)
   */
  useEffect(() => {
    const handleStorage = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the AuthContext.
 */
export const useAuth = () => useContext(AuthContext);