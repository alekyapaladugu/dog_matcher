import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dogIcon from "../assets/dog-icon.svg";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
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
  );
}
