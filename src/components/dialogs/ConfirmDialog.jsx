import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
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
          color: title.includes("Delete") ? "error.main" : "warning.main",
        }}
      >
        {title.includes("Delete") && <CancelOutlinedIcon />}
        {!title.includes("Delete") && <PendingActionsIcon />}
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: "1rem", color: "text.primary" }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          variant="outlined"
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={title.includes("Delete") ? "error" : "warning"}
          autoFocus
        >
          {title.includes("Delete") ? "Delete" : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
