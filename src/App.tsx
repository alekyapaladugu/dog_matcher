import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import Dogs from "./pages/Dogs";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 3,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#a42f59",
    },
    secondary: {
      main: "#1976d2",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            color: "#B0B0B0",
          },
          "& label.Mui-focused": {
            color: "#a42f59",
          },
          "& .MuiInputLabel-shrink": {
            color: "#B0B0B0",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#B0B0B0",
            opacity: 1,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiSelect-select": {
            opacity: 1,
          },
        },
      },
    },
  },
});

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [{ path: "dogs", element: <Dogs /> }],
  },
  { path: "*", element: <Login /> },
]);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
