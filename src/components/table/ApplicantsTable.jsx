import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Box,
  CardMedia,
  Alert,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import {
  updateApplicationStatus,
  deleteApplication,
} from "../services/apiService";
import { API_BASE_URL } from "../common/constants";

const ApplicantsTable = ({
  applicants,
  setApplicants,
  searchTerm,
  filterStatus,
  onApplicantDetailsOpen,
  onImageOpen,
  showAlert,
  showConfirm,
}) => {
  const [page, setPage] = useState(() => {
    try {
      const stored = localStorage.getItem("tablePage");
      return stored ? JSON.parse(stored) : 0;
    } catch (error) {
      return 0;
    }
  });

  const [rowsPerPage, setRowsPerPage] = useState(() => {
    try {
      const stored = localStorage.getItem("tableRowsPerPage");
      return stored ? JSON.parse(stored) : 10;
    } catch (error) {
      return 10;
    }
  });

  // Filter applicants based on search term and status
  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch = applicant.user.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || applicant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem("tablePage", JSON.stringify(newPage));
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    localStorage.setItem("tableRowsPerPage", JSON.stringify(newRowsPerPage));
    localStorage.setItem("tablePage", JSON.stringify(0));
  };

  const handleStatusUpdate = async (id, newStatus, actionText, applicant) => {
    try {
      const updatedApplicant = await updateApplicationStatus(id, newStatus);

      // Update the applicants list
      setApplicants((prevApplicants) =>
        prevApplicants.map((app) => (app.id === id ? updatedApplicant : app))
      );

      showAlert(`Application ${actionText} successfully!`, "Success");
    } catch (error) {
      console.error("Error updating status:", error);
      showAlert(
        error.message ||
          `Failed to ${actionText.toLowerCase()} application. Please try again.`,
        "Error"
      );
    }
  };

  const handleDeleteApplicant = async (id) => {
    try {
      await deleteApplication(id);

      // Remove from applicants list
      setApplicants((prevApplicants) =>
        prevApplicants.filter((app) => app.id !== id)
      );

      showAlert("Application deleted successfully!", "Success");
    } catch (error) {
      console.error("Error deleting applicant:", error);
      showAlert(
        error.message || "Failed to delete application. Please try again.",
        "Error"
      );
    }
  };

  const confirmStatusUpdate = (id, newStatus, actionText, applicant) => {
    showConfirm(
      `Are you sure you want to ${actionText.toLowerCase()} this application?`,
      `Confirm ${actionText}`,
      () => handleStatusUpdate(id, newStatus, actionText, applicant)
    );
  };

  const confirmDelete = (id) => {
    showConfirm(
      "Are you sure you want to delete this application? This action cannot be undone.",
      "Confirm Delete",
      () => handleDeleteApplicant(id)
    );
  };

  if (filteredApplicants.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">
          {searchTerm || filterStatus !== "all"
            ? "No applicants found matching your criteria."
            : "No loan applications found."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: "100%", tableLayout: "fixed" }}
          aria-label="loan applicants table"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "green", padding: "6px" }}>
                Username
              </TableCell>
              <TableCell align="center" sx={{ color: "green", padding: "6px" }}>
                Phone
              </TableCell>
              <TableCell align="center" sx={{ color: "green", padding: "6px" }}>
                NIDA ID
              </TableCell>
              <TableCell align="center" sx={{ color: "green", padding: "6px" }}>
                Loan Amount
              </TableCell>
              <TableCell align="center" sx={{ color: "green", padding: "6px" }}>
                Passport
              </TableCell>
              <TableCell align="center" sx={{ color: "green", padding: "6px" }}>
                NIDA
              </TableCell>
              <TableCell align="center" sx={{ color: "green", padding: "6px" }}>
                Status
              </TableCell>
              <TableCell align="center" sx={{ color: "green", padding: "6px" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplicants
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((applicant) => (
                <TableRow
                  key={applicant.id}
                  onClick={() => onApplicantDetailsOpen(applicant)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ padding: "6px" }}>
                    <Typography variant="body2">
                      {applicant.user.username}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ padding: "6px" }}>
                    <Tooltip title={applicant.user.phone}>
                      <IconButton size="small">
                        <PhoneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" sx={{ padding: "6px" }}>
                    <Tooltip title={applicant.user.national_id}>
                      <IconButton size="small">
                        <BadgeIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" sx={{ padding: "6px" }}>
                    <Typography variant="body2">
                      {`Tsh. ${applicant.loan_amount}`}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ padding: "6px" }}>
                    <Tooltip title="View Passport Picture">
                      <CardMedia
                        component="img"
                        sx={{
                          width: 30,
                          height: 30,
                          objectFit: "cover",
                          borderRadius: "50%",
                          mx: "auto",
                          cursor: "pointer",
                        }}
                        image={`${API_BASE_URL}${applicant.passport_picture}`}
                        alt="Passport"
                        onClick={(e) => {
                          e.stopPropagation();
                          onImageOpen(
                            `${API_BASE_URL}${applicant.passport_picture}`
                          );
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" sx={{ padding: "6px" }}>
                    <Tooltip title="View NIDA Card">
                      <CardMedia
                        component="img"
                        sx={{
                          width: 40,
                          height: 30,
                          objectFit: "cover",
                          mx: "auto",
                          cursor: "pointer",
                        }}
                        image={`${API_BASE_URL}${applicant.nida_front}`}
                        alt="NIDA"
                        onClick={(e) => {
                          e.stopPropagation();
                          onImageOpen(`${API_BASE_URL}${applicant.nida_front}`);
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" sx={{ padding: "6px" }}>
                    <Chip
                      label={applicant.status}
                      color={
                        applicant.status === "accepted"
                          ? "success"
                          : applicant.status === "rejected"
                          ? "error"
                          : "warning"
                      }
                      size="small"
                      sx={{ fontSize: "0.7rem" }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ padding: "6px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                    >
                      <Tooltip title="Accept">
                        <IconButton
                          color="success"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmStatusUpdate(
                              applicant.id,
                              "accepted",
                              "Accept",
                              applicant
                            );
                          }}
                        >
                          <CheckCircleOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmStatusUpdate(
                              applicant.id,
                              "rejected",
                              "Reject",
                              applicant
                            );
                          }}
                        >
                          <CancelOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(applicant.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredApplicants.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ApplicantsTable;
