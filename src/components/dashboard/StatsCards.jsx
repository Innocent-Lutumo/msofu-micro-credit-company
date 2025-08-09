import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const StatsCards = ({
  totalApplicants,
  pendingApplicants,
  acceptedApplicants,
  rejectedApplicants,
}) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            bgcolor: "background.default",
            maxWidth: 280,
            mx: "auto",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
            },
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 2.5, px: 2 }}>
            <GroupIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: "bold", mb: 0.5 }}
            >
              {totalApplicants}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Applicants
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            bgcolor: "background.default",
            maxWidth: 280,
            mx: "auto",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
            },
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 2.5, px: 2 }}>
            <PendingActionsIcon
              color="warning"
              sx={{ fontSize: 40, mb: 1 }}
            />
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: "bold", mb: 0.5 }}
            >
              {pendingApplicants}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Applications
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            bgcolor: "background.default",
            maxWidth: 280,
            mx: "auto",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
            },
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 2.5, px: 2 }}>
            <CheckCircleIcon
              color="success"
              sx={{ fontSize: 40, mb: 1 }}
            />
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: "bold", mb: 0.5 }}
            >
              {acceptedApplicants}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accepted Applications
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            bgcolor: "background.default",
            maxWidth: 280,
            mx: "auto",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
            },
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 2.5, px: 2 }}>
            <CancelIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: "bold", mb: 0.5 }}
            >
              {rejectedApplicants}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rejected Applications
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatsCards;
