// pages/LoginPage.tsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LoginCredentials } from "../api/authService";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import Lottie from "lottie-react";
import puppyAnimation from "../assets/puppy.json";

const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    return null;
  }

  const { login } = authContext;

  const validate = () => {
    let isValid = true;
    const newErrors = { name: "", email: "" };

    if (!credentials.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!credentials.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      await login(credentials);
      navigate("/dogs");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Box textAlign="center" mt={5}>
          <Typography variant="h4" gutterBottom>
            Welcome to Dog Finder!
          </Typography>
          <Box textAlign="right" mt={5}>
            <Lottie
              animationData={puppyAnimation}
              style={{ width: 200, margin: "auto" }}
              loop
            />
          </Box>
          {loading && <Loader />}
          {error && (
            <ErrorModal message={error} onClose={() => setError(null)} />
          )}
          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={credentials.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2, cursor: "pointer" }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
