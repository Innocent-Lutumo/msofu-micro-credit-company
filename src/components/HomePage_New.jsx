import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CssBaseline,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

// Import modular components
import { lightTheme, darkTheme, drawerWidth } from "./common/themes";
import { useApplicationData } from "./hooks/useApplicationData";
import AppHeader from "./layout/AppHeader";
import LeftSidebar from "./layout/LeftSidebar";
import StatsCards from "./dashboard/StatsCards";
import ProfileDialog from "./dialogs/ProfileDialog";
import AlertDialog from "./dialogs/AlertDialog";
import ConfirmDialog from "./dialogs/ConfirmDialog";

// Import the existing table and other complex components (to be modularized later)
// For now, we'll keep the table inline until we can extract it

const HomePage = () => {
  const navigate = useNavigate();

  // UI State
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [mode, setMode] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("Alert");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("Confirm");
  const [confirmAction, setConfirmAction] = useState(null);

  // Note: Pagination and filtering will be added when table component is extracted

  // Read notifications tracking
  const [readNotifications, setReadNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem("readNotifications");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
      console.error("Error loading read notifications:", error);
      return new Set();
    }
  });

  // Use custom hook for data management
  const {
    notifications,
    user,
    isLoading,
    isError,
    isUnauthorized,
    totalApplicants,
    pendingApplicants,
    acceptedApplicants,
    rejectedApplicants,
    refreshData,
  } = useApplicationData();

  // Theme management
  const currentTheme = mode === "dark" ? darkTheme : lightTheme;

  // Event handlers
  const toggleLeftDrawer = () => {
    setLeftDrawerOpen(!leftDrawerOpen);
  };

  const toggleRightDrawer = () => {
    setRightDrawerOpen(!rightDrawerOpen);
  };

  const toggleDarkMode = () => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Note: Page reset will be handled when table component is extracted
  };

  const handleProfileOpen = () => {
    setProfileDialogOpen(true);
  };

  const handleProfileClose = () => {
    setProfileDialogOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  // Alert dialog helpers
  const showAlert = (message, title = "Alert") => {
    setAlertMessage(message);
    setAlertTitle(title);
    setAlertDialogOpen(true);
  };

  const handleAlertClose = () => {
    setAlertDialogOpen(false);
    setAlertMessage("");
    setAlertTitle("Alert");
  };

  // Confirm dialog helpers
  const showConfirm = (message, title = "Confirm", onConfirm) => {
    setConfirmMessage(message);
    setConfirmTitle(title);
    setConfirmAction(() => onConfirm);
    setConfirmDialogOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmDialogOpen(false);
    setConfirmMessage("");
    setConfirmTitle("Confirm");
    setConfirmAction(null);
  };

  const handleConfirmAccept = () => {
    if (confirmAction) {
      confirmAction();
    }
    handleConfirmClose();
  };

  // Handle unauthorized access
  if (isUnauthorized) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Alert severity="error">
          Your session has expired. Please log in again.
        </Alert>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go to Login
        </Button>
      </Box>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Alert severity="error">Failed to load data. Please try again.</Alert>
        <Button variant="contained" onClick={refreshData}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* Header */}
        <AppHeader
          leftDrawerOpen={leftDrawerOpen}
          toggleLeftDrawer={toggleLeftDrawer}
          toggleRightDrawer={toggleRightDrawer}
          toggleDarkMode={toggleDarkMode}
          mode={mode}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          notifications={notifications}
          readNotifications={readNotifications}
          currentTheme={currentTheme}
        />

        {/* Left Sidebar */}
        <LeftSidebar
          leftDrawerOpen={leftDrawerOpen}
          toggleLeftDrawer={toggleLeftDrawer}
          user={user}
          handleProfileOpen={handleProfileOpen}
          handleLogout={handleLogout}
          currentTheme={currentTheme}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            width: leftDrawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
            marginLeft: leftDrawerOpen ? `${drawerWidth}px` : 0,
            transition: "margin 0.3s, width 0.3s",
            ...currentTheme.mixins.toolbar,
          }}
        >
          {/* Stats Cards */}
          <StatsCards
            totalApplicants={totalApplicants}
            pendingApplicants={pendingApplicants}
            acceptedApplicants={acceptedApplicants}
            rejectedApplicants={rejectedApplicants}
          />

          {/* Main Content Area - Table and other components will go here */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 3, color: "primary" }}
          >
            Loan Applicants
          </Typography>

          {/* TODO: Extract table component and other complex UI elements */}
          <Typography variant="body1" color="text.secondary">
            Table and other components will be modularized next...
          </Typography>
        </Box>

        {/* Dialogs */}
        <ProfileDialog
          open={profileDialogOpen}
          onClose={handleProfileClose}
          user={user}
        />

        <AlertDialog
          open={alertDialogOpen}
          onClose={handleAlertClose}
          title={alertTitle}
          message={alertMessage}
        />

        <ConfirmDialog
          open={confirmDialogOpen}
          onClose={handleConfirmClose}
          onConfirm={handleConfirmAccept}
          title={confirmTitle}
          message={confirmMessage}
        />
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
