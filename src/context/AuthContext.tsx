import {
  useState,
  createContext,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser, logoutUser, LoginCredentials } from "../api/authService";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) =>
      await loginUser(credentials),
    onSuccess: () => {
      setIsAuthenticated(true);
    },
    onError: (error) => {
      console.error("Login failed", error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      setIsAuthenticated(false);
    },
  });

  useEffect(() => {
    let logoutTimer: NodeJS.Timeout;

    const handleLogout = () => {
      apiClient.post("/auth/logout").finally(() => {
        setIsAuthenticated(false);
        window.location.href = "/";
      });
    };

    const startLogoutTimer = () => {
      logoutTimer = setTimeout(() => {
        handleLogout();
      }, 3600000);
    };

    startLogoutTimer();

    return () => clearTimeout(logoutTimer);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    await logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
