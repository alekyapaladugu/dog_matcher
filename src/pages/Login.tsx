// pages/LoginPage.tsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LoginCredentials } from "../api/authService";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";
import { TextField, Button, Box, Typography } from "@mui/material";
import Lottie from "lottie-react";
import puppyAnimation from "../assets/puppy.json";

interface Errors {
  name: string;
  email: string;
}
const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState<Errors>({
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
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setErrors((prevErrors: Errors) => ({
      ...prevErrors,
      [name as keyof Errors]: value.trim()
        ? ""
        : prevErrors[name as keyof Errors],
    }));
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
          bgcolor: "#eddac1",
        }}
      >
        <Box textAlign="center" mt={5}>
          <Typography
            variant="h4"
            sx={(theme) => ({ color: theme.palette.primary.main })}
            gutterBottom
          >
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
      </Box>
    </>
  );
};

export default Login;
