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
import ApplicantsTable from "./table/ApplicantsTable";
import TableFilters from "./table/TableFilters";
import ImageModal from "./dialogs/ImageModal";
import ApplicantDetailsDialog from "./dialogs/ApplicantDetailsDialog";
import RightSidebar from "./layout/RightSidebar";
import ConversationDialog from "./dialogs/ConversationDialog";

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

  // Table and modal states
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedApplicantDetails, setSelectedApplicantDetails] =
    useState(null);
  const [applicantDetailsOpen, setApplicantDetailsOpen] = useState(false);

  // Conversation and notification states
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [currentReplyUser, setCurrentReplyUser] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [conversationParticipants, setConversationParticipants] = useState({
    currentUser: null,
    otherUser: null,
  });

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
    applicants,
    setApplicants,
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
    navigate("/login");
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

  // Image modal handlers
  const handleImageOpen = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleImageClose = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  // Applicant details handlers
  const handleApplicantDetailsOpen = (applicant) => {
    setSelectedApplicantDetails(applicant);
    setApplicantDetailsOpen(true);
  };

  const handleApplicantDetailsClose = () => {
    setApplicantDetailsOpen(false);
    setSelectedApplicantDetails(null);
  };

  // Status update handler for details dialog
  const handleDetailsStatusUpdate = async (
    id,
    newStatus,
    actionText,
    applicant
  ) => {
    try {
      const { updateApplicationStatus } = await import("./services/apiService");
      const updatedApplicant = await updateApplicationStatus(id, newStatus);

      // Update the applicants list
      setApplicants((prevApplicants) =>
        prevApplicants.map((app) => (app.id === id ? updatedApplicant : app))
      );

      // Update selected applicant details if it's the same one
      if (selectedApplicantDetails && selectedApplicantDetails.id === id) {
        setSelectedApplicantDetails(updatedApplicant);
      }

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

  // Delete handler for details dialog
  const handleDetailsDelete = async (id) => {
    try {
      const { deleteApplication } = await import("./services/apiService");
      await deleteApplication(id);

      // Remove from applicants list
      setApplicants((prevApplicants) =>
        prevApplicants.filter((app) => app.id !== id)
      );

      // Close the dialog
      handleApplicantDetailsClose();

      showAlert("Application deleted successfully!", "Success");
    } catch (error) {
      console.error("Error deleting applicant:", error);
      showAlert(
        error.message || "Failed to delete application. Please try again.",
        "Error"
      );
    }
  };

  // Notification handlers
  const handleNotificationClick = (notification) => {
    // Mark as read
    setReadNotifications((prev) => {
      const newSet = new Set(prev);
      newSet.add(notification.id);
      try {
        localStorage.setItem("readNotifications", JSON.stringify([...newSet]));
      } catch (error) {
        console.error("Error saving read notifications:", error);
      }
      return newSet;
    });

    setSelectedNotification(notification);

    // Get conversation history for this notification
    const relatedNotifications = notifications.filter(
      (note) =>
        (note.sender === notification.sender &&
          note.receiver === notification.receiver) ||
        (note.sender === notification.receiver &&
          note.receiver === notification.sender)
    );

    const sortedConversation = relatedNotifications.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    setConversationHistory(sortedConversation);

    // Set conversation participants
    const otherUserId =
      notification.sender === user.id
        ? notification.receiver
        : notification.sender;
    const otherUserName =
      notification.sender === user.id
        ? notification.receiver_username
        : notification.sender_username;

    setConversationParticipants({
      currentUser: user,
      otherUser: {
        id: otherUserId,
        username: otherUserName,
        phone: "Phone not available", // You might want to fetch this
      },
    });

    setCurrentReplyUser(otherUserName);
    setReplyDialogOpen(true);
  };

  const handleMarkAllAsRead = () => {
    const allNotificationIds = notifications.map((note) => note.id);
    setReadNotifications(new Set(allNotificationIds));
    try {
      localStorage.setItem(
        "readNotifications",
        JSON.stringify(allNotificationIds)
      );
    } catch (error) {
      console.error("Error saving read notifications:", error);
    }
  };

  const handleDeleteNotification = (notification) => {
    showConfirm(
      "Are you sure you want to delete this message?",
      "Delete Message",
      () => {
        // Here you would call an API to delete the notification
        // For now, we'll just show a success message
        showAlert("Message deleted successfully!", "Success");
      }
    );
  };

  // Conversation handlers
  const handleReplyDialogClose = () => {
    setReplyDialogOpen(false);
    setReplyMessage("");
    setCurrentReplyUser(null);
    setConversationHistory([]);
    setSelectedNotification(null);
    setConversationParticipants({
      currentUser: null,
      otherUser: null,
    });
  };

  const handleReplySend = async () => {
    if (!replyMessage?.trim()) {
      showAlert("Please enter a message.", "Message Required");
      return;
    }

    if (!selectedNotification) {
      showAlert("No notification selected.", "Error");
      return;
    }

    try {
      // Here you would call an API to send the message
      // For now, we'll just show a success message and close the dialog
      showAlert("Message sent successfully!", "Success");
      setReplyMessage("");
      handleReplyDialogClose();
    } catch (error) {
      console.error("Error sending message:", error);
      showAlert("Failed to send message. Please try again.", "Error");
    }
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

          {/* Main Content Area - Table and other components */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 3, color: "primary.main" }}
          >
            Loan Applicants
          </Typography>

          {/* Table Filters */}
          <TableFilters
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            applicants={applicants}
          />

          {/* Applicants Table */}
          <ApplicantsTable
            applicants={applicants}
            setApplicants={setApplicants}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onApplicantDetailsOpen={handleApplicantDetailsOpen}
            onImageOpen={handleImageOpen}
            showAlert={showAlert}
            showConfirm={showConfirm}
          />
        </Box>

        {/* Right Sidebar - Notifications */}
        <RightSidebar
          rightDrawerOpen={rightDrawerOpen}
          notifications={notifications}
          readNotifications={readNotifications}
          user={user}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDeleteNotification={handleDeleteNotification}
          currentTheme={mode === "dark" ? darkTheme : lightTheme}
        />

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

        <ImageModal
          open={imageModalOpen}
          onClose={handleImageClose}
          imageUrl={selectedImage}
        />

        <ApplicantDetailsDialog
          open={applicantDetailsOpen}
          onClose={handleApplicantDetailsClose}
          applicant={selectedApplicantDetails}
          onImageOpen={handleImageOpen}
          onStatusUpdate={handleDetailsStatusUpdate}
          onDelete={handleDetailsDelete}
          showConfirm={showConfirm}
        />

        <ConversationDialog
          open={replyDialogOpen}
          onClose={handleReplyDialogClose}
          conversationHistory={conversationHistory}
          conversationParticipants={conversationParticipants}
          currentReplyUser={currentReplyUser}
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}
          onSendReply={handleReplySend}
          user={user}
          currentTheme={mode === "dark" ? darkTheme : lightTheme}
        />
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
