import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { login as apiLogin, register as apiRegister } from "../../api/authApi";
import type { LoginData, RegisterData } from "../../api/authApi";
import {
  parseJwt,
  isTokenExpired,
  getErrorMessage,
} from "../../utils/authHelpers";

interface AuthContextType {
  token: string | null;
  user: { name: string; email: string } | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<{ message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !isTokenExpired(storedToken)) {
      return storedToken;
    }
    // If token is expired, remove it
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  });
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        console.error("Failed to parse user data from localStorage");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // If token exists but no user data, try to parse user from token
  useEffect(() => {
    if (token && !user) {
      const payload = parseJwt(token);
      if (payload) {
        const userData = {
          name: payload.name || "User",
          email: payload.email || payload.sub || "",
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    }
  }, [token, user]);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiLogin(data);
      const { access_token } = response;

      // Parse user data from JWT payload
      const payload = parseJwt(access_token);
      if (!payload) {
        throw new Error("Invalid token received");
      }

      const userData = {
        name: payload.name || data.email,
        email: payload.email || data.email,
      };

      setToken(access_token);
      setUser(userData);

      // Save to localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.error("Login failed:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRegister(data);
      return response;
    } catch (err) {
      console.error("Registration failed:", err);
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    token,
    user,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
