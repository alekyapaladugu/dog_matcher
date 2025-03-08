import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  return (
    <Modal open={Boolean(message)} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" component="h2" color="error">
          Error
        </Typography>
        <Typography sx={{ mt: 2 }}>{message}</Typography>
        <Button
          variant="contained"
          color="error"
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
