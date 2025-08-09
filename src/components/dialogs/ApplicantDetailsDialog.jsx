import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  CardMedia,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_BASE_URL } from "../common/constants";

const ApplicantDetailsDialog = ({
  open,
  onClose,
  applicant,
  onImageOpen,
  onStatusUpdate,
  onDelete,
  showConfirm,
}) => {
  if (!applicant) return null;

  const handleStatusUpdate = (newStatus, actionText) => {
    if (showConfirm) {
      showConfirm(
        `Are you sure you want to ${actionText.toLowerCase()} this application?`,
        `Confirm ${actionText}`,
        () => onStatusUpdate(applicant.id, newStatus, actionText, applicant)
      );
    } else {
      onStatusUpdate(applicant.id, newStatus, actionText, applicant);
    }
  };

  const handleDelete = () => {
    if (showConfirm) {
      showConfirm(
        "Are you sure you want to delete this application? This action cannot be undone.",
        "Confirm Delete",
        () => onDelete(applicant.id)
      );
    } else {
      onDelete(applicant.id);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Applicant Details</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Personal Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {applicant.user.username}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Phone Number
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon fontSize="small" color="primary" />
                <Typography variant="body1">{applicant.user.phone}</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                National ID
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BadgeIcon fontSize="small" color="primary" />
                <Typography variant="body1">
                  {applicant.user.national_id}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon fontSize="small" color="primary" />
                <Typography variant="body1">
                  {applicant.user.email || "Not provided"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Loan Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Loan Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Loan Amount
              </Typography>
              <Typography variant="h6" color="success.main">
                Tsh. {applicant.loan_amount}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Application Status
              </Typography>
              <Chip
                label={applicant.status}
                color={
                  applicant.status === "accepted"
                    ? "success"
                    : applicant.status === "rejected"
                    ? "error"
                    : "warning"
                }
                sx={{ mt: 0.5 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Application Date
              </Typography>
              <Typography variant="body1">
                {new Date(applicant.created_at).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Purpose
              </Typography>
              <Typography variant="body1">
                {applicant.purpose || "Not specified"}
              </Typography>
            </Box>
          </Grid>

          {/* Documents */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom color="primary">
              Documents
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Passport Picture
                  </Typography>
                  <CardMedia
                    component="img"
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 2,
                      mx: "auto",
                      cursor: "pointer",
                      border: "2px solid",
                      borderColor: "primary.main",
                    }}
                    image={`${API_BASE_URL}${applicant.passport_picture}`}
                    alt="Passport"
                    onClick={() =>
                      onImageOpen(
                        `${API_BASE_URL}${applicant.passport_picture}`
                      )
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    NIDA Card (Front)
                  </Typography>
                  <CardMedia
                    component="img"
                    sx={{
                      width: 160,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 2,
                      mx: "auto",
                      cursor: "pointer",
                      border: "2px solid",
                      borderColor: "primary.main",
                    }}
                    image={`${API_BASE_URL}${applicant.nida_front}`}
                    alt="NIDA Front"
                    onClick={() =>
                      onImageOpen(`${API_BASE_URL}${applicant.nida_front}`)
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Accept Application">
            <span>
              <IconButton
                onClick={() => handleStatusUpdate("accepted", "Accept")}
                color="success"
                disabled={applicant?.status === "accepted"}
              >
                <CheckCircleOutlineIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Reject Application">
            <span>
              <IconButton
                onClick={() => handleStatusUpdate("rejected", "Reject")}
                color="error"
                disabled={applicant?.status === "rejected"}
              >
                <CancelOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete Application">
            <IconButton onClick={handleDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicantDetailsDialog;
