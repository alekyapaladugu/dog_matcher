import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import dogIcon from "../assets/dog-icon.svg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ErrorModal from "./ErrorModal";

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      setError("Logout Failed");
    }
  };

  return (
    <>
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
        <Toolbar>
          <Box
            component="img"
            src={dogIcon}
            alt="Dog Finder"
            sx={{ height: 40, mr: 2 }}
          />

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            DogFinder
          </Typography>

          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
}
