import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loader = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="10vh"
    >
      <CircularProgress size={50} />
    </Box>
  );
};

export default Loader;
