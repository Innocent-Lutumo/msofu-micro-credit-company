import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ImageModal = ({ open, onClose, imageUrl }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            borderRadius: 2,
          }}
        >
          <img
            src={imageUrl}
            alt="Document"
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
          <Button
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              minWidth: "auto",
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "black",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
