import {
  useState,
  createContext,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser, logoutUser, LoginCredentials } from "../api/authService";
import { fetchBreeds } from "../api/dogService";

interface AuthContextType {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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
    const checkAuth = async () => {
      try {
        await fetchBreeds(); // Backend should return 200 if session exists
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        window.location.href = "/"; // Redirect to login if session is invalid
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    await logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isCheckingAuth, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
