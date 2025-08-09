import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  CardMedia,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ProfileDialog = ({ open, onClose, user }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Profile
          <IconButton size="small" onClick={onClose}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            py: 2,
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: "50%",
              border: "3px solid",
              borderColor: "primary.main",
            }}
            image={user.passportPicture}
            alt={`${user.username}'s Profile Picture`}
          />
          
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
              {user.username}
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  Phone:
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user.phone || "Not provided"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  National ID:
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user.national_id || "Not provided"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
