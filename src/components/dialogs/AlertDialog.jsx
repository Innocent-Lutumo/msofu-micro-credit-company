import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import InfoIcon from "@mui/icons-material/Info";

const AlertDialog = ({ open, onClose, title, message }) => {
  const getAlertColor = () => {
    if (title.toLowerCase().includes("success")) return "success.main";
    if (title.toLowerCase().includes("error")) return "error.main";
    if (title.toLowerCase().includes("warning")) return "warning.main";
    return "info.main";
  };

  const getAlertIcon = () => {
    if (title.toLowerCase().includes("success")) return <CheckCircleOutlineIcon />;
    if (title.toLowerCase().includes("error")) return <CancelOutlinedIcon />;
    return <InfoIcon />;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: getAlertColor(),
        }}
      >
        {getAlertIcon()}
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: "1rem", color: "text.primary" }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
