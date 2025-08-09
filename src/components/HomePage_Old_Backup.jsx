import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  CardMedia,
  CssBaseline,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  AppBar,
  Toolbar,
  Tooltip,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TablePagination,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Badge,
  LinearProgress,
  TextField,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InfoIcon from "@mui/icons-material/Info";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PieChartIcon from "@mui/icons-material/PieChart";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";
import RefreshIcon from "@mui/icons-material/Refresh";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    primary: {
      main: "#4caf50",
    },
    secondary: {
      main: "#81c784",
    },
    headerGreen: {
      main: "#388e3c",
    },
    red: {
      main: "#ff1744",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#81c784",
    },
    secondary: {
      main: "#66bb6a",
    },
    headerGreen: {
      main: "#388e3c",
    },
    red: {
      main: "#d32f2f",
    },
  },
});

// Responsive drawer widths
const getDrawerWidthLeft = (isMobile, isTablet) => {
  if (isMobile) return 280; // Full width on mobile
  if (isTablet) return 220; // Smaller on tablet
  return 200; // Standard on desktop
};

const getDrawerWidthRight = (isMobile, isTablet) => {
  if (isMobile) return 320; // Slightly wider on mobile for better readability
  if (isTablet) return 300; // Medium on tablet
  return 300; // Standard on desktop
};

const getStoredValue = (key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error("Error parsing localStorage value:", error);
    return defaultValue;
  }
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [applicants, setApplicants] = useState([]);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(!isMobile); // Auto-close on mobile
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [mode, setMode] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [user, setUser] = useState({
    id: 1,
    username: "Credit Officer",
    phone: "",
    national_id: "",
    total_applications: 0,
    total_approved: 0,
    total_rejected: 0,
    money_approved: "0.00",
    money_pending: "0.00",
    money_rejected: "0.00",
    passportPicture: "https://via.placeholder.com/150/4CAF50/FFFFFF?text=CO", // Example profile picture
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(() => getStoredValue("tablePage", 0));
  const [rowsPerPage, setRowsPerPage] = useState(() =>
    getStoredValue("tableRowsPerPage", 10)
  );
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [pendingApplicants, setPendingApplicants] = useState(0);
  const [acceptedApplicants, setAcceptedApplicants] = useState(0);
  const [rejectedApplicants, setRejectedApplicants] = useState(0);
  const [statsData, setStatsData] = useState({
    total_applications: 0,
    total_accepted: 0,
    total_pending: 0,
    total_rejected: 0,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutProgress, setLogoutProgress] = useState(100);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [currentReplyUser, setCurrentReplyUser] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [chartsDrawerOpen, setChartsDrawerOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [applicantDetailsDialogOpen, setApplicantDetailsDialogOpen] =
    useState(false);
  const [selectedApplicantDetails, setSelectedApplicantDetails] =
    useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [readNotifications, setReadNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem("readNotifications");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
      console.error("Error loading read notifications:", error);
      return new Set();
    }
  });
  const [conversationParticipants, setConversationParticipants] = useState({
    currentUser: null,
    otherUser: null,
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("Alert");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("Confirm");
  const [confirmAction, setConfirmAction] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(new Set());

  // Responsive values
  const drawerWidthLeft = getDrawerWidthLeft(isMobile, isTablet);
  const drawerWidthRight = getDrawerWidthRight(isMobile, isTablet);

  const API_BASE_URL = "http://192.168.100.142:8000";

  const fetchApplicants = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/loan-applications/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        setIsUnauthorized(true);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setApplicants(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        setIsUnauthorized(true);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const profileData = await response.json();
      console.log("Fetched user profile data:", profileData);

      // Update user state with fetched data
      setUser((prevUser) => ({
        ...prevUser,
        username: profileData.username || prevUser.username,
        phone: profileData.phone || "",
        national_id: profileData.national_id || "",
        total_applications: profileData.total_applications || 0,
        total_approved: profileData.total_approved || 0,
        total_rejected: profileData.total_rejected || 0,
        money_approved: profileData.money_approved || "0.00",
        money_pending: profileData.money_pending || "0.00",
        money_rejected: profileData.money_rejected || "0.00",
        // Keep the example profile picture
        passportPicture:
          "https://via.placeholder.com/150/4CAF50/FFFFFF?text=CO",
      }));
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        setIsUnauthorized(true);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Ensure data is an array and normalize it
      if (!Array.isArray(data)) {
        console.error("Expected array but got:", typeof data, data);
        setNotifications([]);
        return;
      }

      // Normalize notification data to match backend fields exactly
      const normalizedNotifications = data.map((notification) => ({
        ...notification,
        // Ensure IDs are consistently handled as numbers for comparison
        id: Number(notification.id),
        sender: Number(notification.sender),
        receiver: Number(notification.receiver),
        // Backend provides these fields automatically
        sender_username: notification.sender_username || "Unknown User",
        receiver_username: notification.receiver_username || "Unknown User",
        // Use created_at as the timestamp (backend field)
        timestamp: notification.created_at,
        // Keep original fields
        created_at: notification.created_at,
        is_read: notification.is_read || false,
      }));

      setNotifications(normalizedNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setIsUnauthorized(true);
      setIsLoading(false);
      return;
    }

    fetchApplicants(token);
    fetchNotifications();
    fetchUserProfile(token);

    // Set up automatic notification polling every 30 seconds
    const notificationInterval = setInterval(() => {
      console.log("Auto-fetching notifications...");
      fetchNotifications();
    }, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => {
      clearInterval(notificationInterval);
    };
  }, []);

  // Function to save stats data to API
  const saveStatsData = async (statsData) => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.warn("No authentication token found, skipping stats save");
      return;
    }

    try {
      console.log("Saving stats data:", statsData);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/loan-applications/stats/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(statsData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to save stats: ${response.status}`);
      }

      const result = await response.json();
      console.log("Stats saved successfully:", result);
    } catch (error) {
      console.error("Error saving stats data:", error);
      // Don't show user error for stats saving as it's background operation
    }
  };

  useEffect(() => {
    const total = applicants.length;
    const pending = applicants.filter((app) => app.status === "pending").length;
    const accepted = applicants.filter(
      (app) => app.status === "accepted"
    ).length;
    const rejected = applicants.filter(
      (app) => app.status === "rejected"
    ).length;

    // Update individual state variables (for backward compatibility)
    setTotalApplicants(total);
    setPendingApplicants(pending);
    setAcceptedApplicants(accepted);
    setRejectedApplicants(rejected);

    // Create stats data object
    const newStatsData = {
      total_applications: total,
      total_accepted: accepted,
      total_pending: pending,
      total_rejected: rejected,
    };

    // Update stats data state
    setStatsData(newStatsData);

    // Save stats data to API
    saveStatsData(newStatsData);
  }, [applicants]);

  useEffect(() => {
    localStorage.setItem("tablePage", JSON.stringify(page));
  }, [page]);

  useEffect(() => {
    localStorage.setItem("tableRowsPerPage", JSON.stringify(rowsPerPage));
  }, [rowsPerPage]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "readNotifications",
        JSON.stringify([...readNotifications])
      );
    } catch (error) {
      console.error("Error saving read notifications:", error);
    }
  }, [readNotifications]);

  // Auto-scroll to bottom when conversation history changes
  useEffect(() => {
    if (replyDialogOpen && conversationHistory.length > 0) {
      setTimeout(() => {
        const conversationContent = document.getElementById(
          "conversation-content"
        );
        if (conversationContent) {
          conversationContent.scrollTop = conversationContent.scrollHeight;
        }
      }, 100);
    }
  }, [conversationHistory, replyDialogOpen]);

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem("access");
    if (!token) {
      showAlert(
        "Authentication required. Please log in again.",
        "Authentication Error"
      );
      return;
    }

    // Find the applicant to get their details
    const applicant = applicants.find((app) => app.id === id);
    if (!applicant) {
      showAlert("Applicant not found.", "Error");
      return;
    }

    // Show confirmation dialog
    const actionText = newStatus === "accepted" ? "accept" : "reject";
    const confirmMessage = `Are you sure you want to ${actionText} the loan application from ${applicant.user.username}?`;

    showConfirm(
      confirmMessage,
      `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Application`,
      () => performStatusUpdate(id, newStatus, actionText, applicant)
    );
  };

  const performStatusUpdate = async (id, newStatus, actionText) => {
    // Check if this applicant is already being updated
    if (updatingStatus.has(id)) {
      console.log(`Update already in progress for applicant ${id}`);
      return;
    }

    // Add to updating set
    setUpdatingStatus((prev) => new Set([...prev, id]));

    try {
      console.log(`=== STATUS UPDATE DEBUG ===`);
      console.log(`Updating status for applicant ${id} to "${newStatus}"`);
      console.log(
        `Request URL: ${API_BASE_URL}/api/admin/loan-applications/${id}/status/`
      );
      console.log(`Request body:`, { status: newStatus });

      const response = await fetch(
        `${API_BASE_URL}/api/admin/loan-applications/${id}/status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.log("Full error response:", errorData);
          errorMessage =
            errorData.detail ||
            errorData.message ||
            errorData.status?.[0] ||
            errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const updatedApplicant = await response.json();
      console.log("Status updated successfully:", updatedApplicant);

      // Simple state update - just update the status of the specific applicant
      console.log("Updating local state with new status...");

      setApplicants((prevApplicants) => {
        return prevApplicants.map((applicant) => {
          if (applicant.id === id) {
            // Update only the status, keep all other data the same
            return {
              ...applicant,
              status: newStatus,
            };
          }
          return applicant;
        });
      });

      // Update selected applicant details if it's the same one
      if (selectedApplicantDetails && selectedApplicantDetails.id === id) {
        console.log("Updating selected applicant details");
        setSelectedApplicantDetails({
          ...selectedApplicantDetails,
          status: newStatus,
        });
      }

      console.log("State updates completed successfully");

      // Refresh notifications (in a try-catch to prevent crashes)
      try {
        fetchNotifications();
      } catch (notificationError) {
        console.error("Error refreshing notifications:", notificationError);
      }

      // Show success message
      showAlert(`Application ${actionText}ed successfully!`, "Success");

      console.log(
        "Status update completed successfully - no page refresh needed"
      );
    } catch (error) {
      console.error("Error updating status:", error);

      // Provide specific error messages
      let userMessage = "Failed to update status. Please try again.";
      let title = "Error";
      if (error.message.includes("403")) {
        userMessage = "You don't have permission to update this application.";
        title = "Permission Error";
      } else if (error.message.includes("404")) {
        userMessage = "Application not found. It may have been deleted.";
        title = "Not Found";
      } else if (error.message.includes("401")) {
        userMessage = "Your session has expired. Please log in again.";
        title = "Session Expired";
      } else if (error.message.includes("already")) {
        userMessage = `Application is already ${newStatus}.`;
        title = "Status Already Set";
      }

      showAlert(userMessage, title);
    } finally {
      // Remove from updating set
      setUpdatingStatus((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDeleteApplicant = (id) => {
    // Find the applicant to get their details for confirmation
    const applicant = applicants.find((app) => app.id === id);
    if (!applicant) {
      showAlert("Applicant not found.", "Error");
      return;
    }

    // Show confirmation dialog
    const confirmMessage = `Are you sure you want to delete the loan application from ${applicant.user.username}? This action cannot be undone.`;

    showConfirm(confirmMessage, "Delete Application", () =>
      performDeleteApplicant(id)
    );
  };

  const performDeleteApplicant = async (id) => {
    const token = localStorage.getItem("access");
    if (!token) {
      showAlert(
        "Authentication required. Please log in again.",
        "Authentication Error"
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/loan-applications/${id}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete applicant: ${response.status}`);
      }

      setApplicants((prevApplicants) =>
        prevApplicants.filter((applicant) => applicant.id !== id)
      );
      if (selectedApplicantDetails && selectedApplicantDetails.id === id) {
        handleApplicantDetailsClose();
      }
      fetchNotifications(token);

      // Show success message
      showAlert("Application deleted successfully!", "Success");

      // Automatically refresh the page after successful delete
      setTimeout(() => {
        console.log("Auto-refreshing page after delete...");
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error deleting applicant:", error);
      showAlert(
        "Failed to delete applicant. Please try again.",
        "Delete Error"
      );
    }
  };

  const toggleLeftDrawer = () => {
    setLeftDrawerOpen(!leftDrawerOpen);
  };

  // Close drawer when clicking outside on mobile
  const handleBackdropClick = () => {
    if (isMobile && leftDrawerOpen) {
      setLeftDrawerOpen(false);
    }
  };

  const toggleRightDrawer = () => {
    setRightDrawerOpen(!rightDrawerOpen);
  };

  const toggleDarkMode = () => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleAboutOpen = () => {
    setAboutDialogOpen(true);
  };

  const handleAboutClose = () => {
    setAboutDialogOpen(false);
  };

  const handleProfileOpen = () => {
    setProfileDialogOpen(true);
  };

  const handleProfileClose = () => {
    setProfileDialogOpen(false);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleImageModalClose = () => {
    setSelectedImage(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setPage(0);
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
    setIsLoggingOut(true);
    let progress = 100;
    const interval = setInterval(() => {
      progress -= 5;
      if (progress <= 0) {
        progress = 0;
        clearInterval(interval);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/");
      }
      setLogoutProgress(progress);
    }, 100);
  };

  const handleNotificationClick = (notification) => {
    if (!notification || !notification.id) {
      console.error("Invalid notification:", notification);
      return;
    }

    setSelectedNotification(notification);

    // Mark this notification as read
    setReadNotifications((prev) => new Set([...prev, notification.id]));

    // Determine the other participant in the conversation
    // If the notification sender is the current user, then the receiver is the other participant
    // If the notification sender is not the current user, then the sender is the other participant
    let otherUserId, otherUserName;

    if (String(notification.sender) === String(user.id)) {
      // Current user sent this message, so the other participant is the receiver
      otherUserId = notification.receiver;
      otherUserName = notification.receiver_username || "Unknown User";
    } else {
      // Someone else sent this message, so they are the other participant
      otherUserId = notification.sender;
      otherUserName = notification.sender_username || "Unknown User";
    }

    setConversationParticipants({
      currentUser: {
        id: user.id,
        username: user.username,
      },
      otherUser: {
        id: otherUserId,
        username: otherUserName,
      },
    });

    // Get conversation between current user and the other participant
    const conversation = notifications.filter(
      (note) =>
        (String(note.sender) === String(otherUserId) &&
          String(note.receiver) === String(user.id)) ||
        (String(note.sender) === String(user.id) &&
          String(note.receiver) === String(otherUserId))
    );

    // Sort conversation by timestamp if available, or by id
    const sortedConversation = conversation.sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      if (a.created_at && b.created_at) {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return a.id - b.id;
    });

    setConversationHistory(sortedConversation);

    // Mark all messages in this conversation as read when opening the dialog
    const conversationMessageIds = conversation.map((msg) => msg.id);
    setReadNotifications(
      (prev) => new Set([...prev, ...conversationMessageIds])
    );

    console.log(
      "Marked conversation messages as read on click:",
      conversationMessageIds
    );

    setCurrentReplyUser(otherUserName);
    setReplyDialogOpen(true);
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

    const token = localStorage.getItem("access");
    if (!token) {
      showAlert(
        "Authentication required. Please log in again.",
        "Authentication Error"
      );
      return;
    }

    // First, let's try to get the current user's actual data from the API
    let currentUserId = user.id;
    try {
      const userResponse = await fetch(`${API_BASE_URL}/api/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        currentUserId = userData.id;
        console.log("Got actual user data from API:", userData);
      }
    } catch (error) {
      console.log("Could not fetch user data, using default:", error);
    }

    // Determine the receiver - always use the selected notification as source of truth
    let receiverId;

    if (String(selectedNotification.sender) === String(currentUserId)) {
      // If current user (admin) sent the original notification, reply to the receiver
      receiverId = selectedNotification.receiver;
    } else {
      // If someone else sent the notification to admin, reply to the sender
      receiverId = selectedNotification.sender;
    }

    // Validate that we have a valid receiver
    if (!receiverId || String(receiverId) === String(currentUserId)) {
      showAlert("Cannot send message: Invalid recipient.", "Invalid Recipient");
      return;
    }

    // FIXED: Correct sender and receiver assignment
    const messageData = {
      sender: currentUserId, // Current user (admin) is the sender
      receiver: receiverId, // Other user is the receiver
      message: replyMessage,
      sender_username: user.username,
    };

    // Debug logging to help identify the issue
    console.log("=== MESSAGE SENDING DEBUG ===");
    console.log("Current user (hardcoded):", user);
    console.log("Current user ID (from API):", currentUserId);
    console.log("Selected notification:", selectedNotification);
    console.log("Conversation participants:", conversationParticipants);
    console.log("Message data being sent:", messageData);
    console.log("Receiver ID:", receiverId, "Type:", typeof receiverId);
    console.log("Sender ID:", currentUserId, "Type:", typeof currentUserId);

    // Get CSRF token using centralized function

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        let errorData = {};
        let errorMessage = `HTTP ${response.status}`;

        try {
          errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
        }

        console.log("Error response data:", errorData);

        // If it's a receiver not found error, try alternative approaches
        if (
          errorMessage.includes("Receiver user not found") ||
          errorMessage.includes("not a regular user")
        ) {
          console.log(
            "Receiver error detected, trying alternative approach..."
          );

          // Try with string conversion of IDs
          const alternativeMessageData = {
            sender: String(receiverId),
            receiver: String(currentUserId),
            message: replyMessage,
            sender_username: user.username,
          };

          console.log(
            "Trying alternative message data:",
            alternativeMessageData
          );

          const alternativeResponse = await fetch(
            `${API_BASE_URL}/api/notifications/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(alternativeMessageData),
            }
          );

          if (alternativeResponse.ok) {
            const newMessage = await alternativeResponse.json();
            setConversationHistory((prev) => [...prev, newMessage]);
            setReplyMessage("");

            // Mark all messages in this conversation as read (alternative path)
            const conversationMessageIds = conversationHistory
              .filter(
                (msg) =>
                  (msg.sender === conversationParticipants.otherUser?.id &&
                    msg.receiver ===
                      conversationParticipants.currentUser?.id) ||
                  (msg.sender === conversationParticipants.currentUser?.id &&
                    msg.receiver === conversationParticipants.otherUser?.id)
              )
              .map((msg) => msg.id);

            // Add these conversation messages to read notifications
            setReadNotifications(
              (prev) => new Set([...prev, ...conversationMessageIds])
            );

            console.log(
              "Marked conversation messages as read (alternative):",
              conversationMessageIds
            );

            setTimeout(() => {
              const conversationContent = document.getElementById(
                "conversation-content"
              );
              if (conversationContent) {
                conversationContent.scrollTop =
                  conversationContent.scrollHeight;
              }
            }, 100);

            fetchNotifications(token);
            return; // Success with alternative approach
          } else {
            let altErrorData = {};
            try {
              altErrorData = await alternativeResponse.json();
            } catch (parseError) {
              console.error("Error parsing alternative response:", parseError);
            }
            console.log("Alternative approach also failed:", altErrorData);
          }
        }

        throw new Error(errorMessage);
      }

      const newMessage = await response.json();

      // Add the new message to conversation history with proper sender info
      const messageWithSenderInfo = {
        ...newMessage,
        sender_username: user.username,
      };

      setConversationHistory((prev) => [...prev, messageWithSenderInfo]);
      setReplyMessage("");

      // Mark all messages in this conversation as read (except the new one we just sent)
      const conversationMessageIds = conversationHistory
        .filter(
          (msg) =>
            (msg.sender === conversationParticipants.otherUser?.id &&
              msg.receiver === conversationParticipants.currentUser?.id) ||
            (msg.sender === conversationParticipants.currentUser?.id &&
              msg.receiver === conversationParticipants.otherUser?.id)
        )
        .map((msg) => msg.id);

      // Add these conversation messages to read notifications
      setReadNotifications(
        (prev) => new Set([...prev, ...conversationMessageIds])
      );

      console.log(
        "Marked conversation messages as read:",
        conversationMessageIds
      );

      // Auto-scroll to bottom after sending message
      setTimeout(() => {
        const conversationContent = document.getElementById(
          "conversation-content"
        );
        if (conversationContent) {
          conversationContent.scrollTop = conversationContent.scrollHeight;
        }
      }, 100);

      // Refresh notifications to get any new messages (but don't reset conversation state)
      fetchNotifications(token);

      console.log("Message sent successfully, conversation remains open");
      console.log(
        "Current conversation participants:",
        conversationParticipants
      );
      console.log("Selected notification still:", selectedNotification);
    } catch (error) {
      console.error("Error sending message:", error);

      // Provide more specific error messages
      let userMessage = "Failed to send message. Please try again.";
      if (error.message.includes("Receiver user not found")) {
        userMessage =
          "Cannot send message: The recipient user was not found. They may have been deleted or deactivated.";
      } else if (error.message.includes("not a regular user")) {
        userMessage =
          "Cannot send message: The recipient is not a regular user account.";
      } else if (error.message.includes("HTTP 403")) {
        userMessage =
          "You don't have permission to send messages to this user.";
      } else if (error.message.includes("HTTP 401")) {
        userMessage = "Your session has expired. Please log in again.";
      }

      showAlert(userMessage, "Message Error");
    }
  };

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

    // Refresh notifications to get any new messages
    const token = localStorage.getItem("access");
    if (token) {
      fetchNotifications(token);
    }
  };

  const handleChartsDrawerOpen = () => {
    setChartsDrawerOpen(true);
    // Close notifications drawer if open
    setRightDrawerOpen(false);
  };

  const handleChartsDrawerClose = () => {
    setChartsDrawerOpen(false);
  };

  // Get ALL applicants with their notification data for charts
  const applicantsWithNotifications = applicants
    .map((applicant) => {
      const applicantNotifications = notifications.filter(
        (note) =>
          note.sender === applicant.user.id ||
          note.receiver === applicant.user.id
      );

      return {
        ...applicant,
        notificationCount: applicantNotifications.length,
        notifications: applicantNotifications,
        hasNotifications: applicantNotifications.length > 0,
        // Include recent notification info
        latestNotification:
          applicantNotifications.length > 0
            ? applicantNotifications.sort(
                (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
              )[0]
            : null,
      };
    })
    .sort((a, b) => {
      // Sort by: 1) Has notifications, 2) Notification count, 3) Latest notification time
      if (a.hasNotifications && !b.hasNotifications) return -1;
      if (!a.hasNotifications && b.hasNotifications) return 1;
      if (a.notificationCount !== b.notificationCount) {
        return b.notificationCount - a.notificationCount;
      }
      if (a.latestNotification && b.latestNotification) {
        return (
          new Date(b.latestNotification.timestamp) -
          new Date(a.latestNotification.timestamp)
        );
      }
      return 0;
    });

  const handleSelectApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setCurrentReplyUser(applicant.user.username);

    // Set up conversation participants
    setConversationParticipants({
      currentUser: {
        id: user.id,
        username: user.username,
      },
      otherUser: {
        id: applicant.user.id,
        username: applicant.user.username,
      },
    });

    // Get existing conversation with this applicant
    const existingConversation = notifications.filter(
      (note) =>
        (String(note.sender) === String(applicant.user.id) &&
          String(note.receiver) === String(user.id)) ||
        (String(note.sender) === String(user.id) &&
          String(note.receiver) === String(applicant.user.id))
    );

    // Sort conversation by timestamp
    const sortedConversation = existingConversation.sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      if (a.created_at && b.created_at) {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return a.id - b.id;
    });

    // If no existing conversation, create a welcome message
    if (sortedConversation.length === 0) {
      setConversationHistory([
        {
          id: "welcome-" + Date.now(),
          sender: applicant.user.id,
          sender_username: applicant.user.username,
          message: `Hello! I'm ${applicant.user.username}. You can view my loan application charts and details here.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } else {
      setConversationHistory(sortedConversation);
    }

    setReplyDialogOpen(true);
    handleChartsDrawerClose();
  };

  const handleDeleteChart = (applicantId) => {
    const applicantToDelete = applicants.find((app) => app.id === applicantId);

    showConfirm(
      `Are you sure you want to delete the chart for ${applicantToDelete.user.username}?`,
      "Delete Chart",
      () => performDeleteChart(applicantId, applicantToDelete)
    );
  };

  const performDeleteChart = (applicantId, applicantToDelete) => {
    setNotifications((prevNotes) =>
      prevNotes.filter((note) => note.applicantId !== applicantId)
    );
    showAlert(
      `Chart for ${applicantToDelete.user.username} has been deleted.`,
      "Chart Deleted"
    );
  };

  const handleApplicantDetailsOpen = (applicant) => {
    setSelectedApplicantDetails(applicant);
    setApplicantDetailsDialogOpen(true);
  };

  const handleApplicantDetailsClose = () => {
    setApplicantDetailsDialogOpen(false);
    setSelectedApplicantDetails(null);
  };

  const handleMarkAllAsRead = () => {
    const allNotificationIds = notifications.map((note) => note.id);
    setReadNotifications(new Set(allNotificationIds));
  };

  const handleDeleteNotification = (notificationId, event) => {
    // Prevent triggering the notification click when deleting
    event.stopPropagation();

    // Find the notification to show in confirmation dialog
    const notification = notifications.find(
      (note) => note.id === notificationId
    );
    setNotificationToDelete(notification);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteNotification = async () => {
    if (!notificationToDelete) return;

    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      console.log(`Deleting notification with ID: ${notificationToDelete.id}`);

      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationToDelete.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to delete notification: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      console.log("Notification deleted successfully from server");

      // Remove the notification from local state
      setNotifications((prevNotifications) =>
        prevNotifications.filter((note) => note.id !== notificationToDelete.id)
      );

      // Remove from read notifications set if it was there
      setReadNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationToDelete.id);
        return newSet;
      });

      // If this was the selected notification in the dialog, close the dialog
      if (
        selectedNotification &&
        selectedNotification.id === notificationToDelete.id
      ) {
        handleReplyDialogClose();
      }

      // Show success message
      showAlert("Message deleted successfully!", "Success");

      // Close confirmation dialog
      setDeleteConfirmOpen(false);
      setNotificationToDelete(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
      showAlert(
        error.message || "Failed to delete message. Please try again.",
        "Delete Error"
      );
      setDeleteConfirmOpen(false);
      setNotificationToDelete(null);
    }
  };

  const cancelDeleteNotification = () => {
    setDeleteConfirmOpen(false);
    setNotificationToDelete(null);
  };

  // Helper function to show alert dialog
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

  // Helper function to show confirmation dialog
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

  // Theme configuration
  const currentTheme = mode === "dark" ? darkTheme : lightTheme;

  // Filter applicants based on status and search term
  const filteredApplicants = applicants
    .filter((applicant) => {
      if (filterStatus === "all") {
        return true;
      }
      return applicant.status === filterStatus;
    })
    .filter((applicant) =>
      applicant.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Main component render
  return (
    <ThemeProvider theme={currentTheme}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: "100%",
            bgcolor: currentTheme.palette.headerGreen.main,
            zIndex: 1300,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="toggle left drawer"
              onClick={toggleLeftDrawer}
              edge="start"
              sx={{ mr: 2, color: "white" }}
            >
              {leftDrawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, color: "white" }}
            >
              Credit Officer Dashboard
            </Typography>

            <Box
              sx={{
                position: "relative",
                borderRadius: currentTheme.shape.borderRadius,
                bgcolor: "rgba(255, 255, 255, 0.15)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.25)",
                },
                marginRight: 2,
                marginLeft: 0,
                width: "auto",
              }}
            >
              <Box
                sx={{
                  padding: currentTheme.spacing(0, 2),
                  height: "100%",
                  position: "absolute",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SearchIcon sx={{ color: "white" }} />
              </Box>
              <InputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={handleSearch}
                sx={{
                  color: "white",
                  "& .MuiInputBase-input": {
                    padding: currentTheme.spacing(
                      1,
                      1,
                      1,
                      `calc(1em + ${currentTheme.spacing(4)})`
                    ),
                    transition: currentTheme.transitions.create("width"),
                    width: "12ch",
                    "&:focus": {
                      width: "20ch",
                    },
                  },
                }}
              />
            </Box>

            <Tooltip title="Toggle Dark/Light Mode">
              <IconButton
                color="inherit"
                aria-label="toggle mode"
                onClick={toggleDarkMode}
                sx={{ color: "white" }}
              >
                {mode === "dark" ? <Brightness2Icon /> : <WbSunnyIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                aria-label="show notifications"
                onClick={toggleRightDrawer}
                sx={{ color: "white" }}
              >
                <Badge
                  badgeContent={
                    notifications.filter(
                      (note) => !readNotifications.has(note.id)
                    ).length
                  }
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="About this page">
              <IconButton
                color="inherit"
                aria-label="about"
                onClick={handleAboutOpen}
                sx={{ color: "white" }}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            width: leftDrawerOpen ? drawerWidthLeft : 0,
            bgcolor: "background.paper",
            p: leftDrawerOpen ? (isMobile ? 1 : 2) : 0,
            borderRight: leftDrawerOpen ? "1px solid #333" : "none",
            position: "fixed",
            top: 0,
            height: "100vh",
            overflow: "auto",
            zIndex: isMobile ? 1300 : 1200, // Higher z-index on mobile to overlay content
            transition: "width 0.3s, padding 0.3s",
            whiteSpace: "nowrap",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            // Add backdrop on mobile when drawer is open
            ...(isMobile &&
              leftDrawerOpen && {
                "&::before": {
                  content: '""',
                  position: "fixed",
                  top: 0,
                  left: drawerWidthLeft,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: -1,
                },
              }),
          }}
        >
          {leftDrawerOpen && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 4,
                  mt: 10,
                  gap: 1,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    p: 1,
                    borderRadius: 2,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                  onClick={handleProfileOpen}
                >
                  <AccountCircleIcon
                    sx={{
                      width: 50,
                      height: 50,
                      mr: 2,
                      color: "primary.main",
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: currentTheme.palette.text.primary,
                        fontWeight: "medium",
                      }}
                    >
                      {user.username}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: currentTheme.palette.text.secondary,
                        fontSize: "0.75rem",
                      }}
                    >
                      Credit Officer
                    </Typography>
                  </Box>
                  <EditIcon
                    fontSize="small"
                    sx={{
                      color: "text.secondary",
                      ml: 1,
                    }}
                  />
                </Box>
                <Divider sx={{ mb: 2, width: "100%" }} />
                <Button
                  startIcon={<HomeIcon />}
                  fullWidth
                  sx={{ justifyContent: "flex-start", color: "primary.main" }}
                >
                  Dashboard
                </Button>
                <Button
                  startIcon={<PieChartIcon />}
                  fullWidth
                  sx={{ justifyContent: "flex-start", color: "text.primary" }}
                  onClick={handleChartsDrawerOpen}
                >
                  Charts
                </Button>
                <Button
                  startIcon={<SettingsIcon />}
                  fullWidth
                  sx={{ justifyContent: "flex-start", color: "text.primary" }}
                >
                  Settings
                </Button>
              </Box>
              <Box sx={{ p: 2, width: "100%" }}>
                <Button
                  startIcon={<LogoutIcon />}
                  fullWidth
                  onClick={handleLogout}
                  sx={{
                    color: currentTheme.palette.red.main,
                    "&:hover": {
                      bgcolor: "rgba(255, 23, 68, 0.1)",
                    },
                    justifyContent: "flex-start",
                  }}
                >
                  Logout
                </Button>
              </Box>
            </>
          )}
        </Box>

        {/* Mobile backdrop overlay */}
        {isMobile && leftDrawerOpen && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1250,
            }}
            onClick={handleBackdropClick}
          />
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: leftDrawerOpen && !isMobile ? `${drawerWidthLeft}px` : "0",
            mr:
              (rightDrawerOpen || chartsDrawerOpen) && !isMobile
                ? `${drawerWidthRight}px`
                : "0",
            p: isMobile ? 1 : isTablet ? 2 : 3,
            mt: isMobile ? 7 : 8,
            transition: "margin-left 0.3s, margin-right 0.3s",
            display: "flex",
            justifyContent: "center",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Paper
            elevation={isMobile ? 1 : 3}
            sx={{
              padding: isMobile ? 1 : isTablet ? 2 : 4,
              borderRadius: isMobile ? 1 : 2,
              maxWidth: "lg",
              width: "100%",
              overflow: "hidden", // Prevent horizontal scroll
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                Welcome{user ? `, ${user.username}` : ""}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This page displays a list of loan applicants awaiting your
                review.
              </Typography>
            </Box>

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
                      {statsData.total_applications}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Applications
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
                      {statsData.total_pending}
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
                      {statsData.total_accepted}
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
                      {statsData.total_rejected}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rejected Applications
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography
              variant="h5"
              gutterBottom
              sx={{ mb: 3, color: "primary" }}
            >
              Loan Applicants
            </Typography>

            <Box
              sx={{
                mb: 3,
                display: "flex",
                gap: 1,
                alignItems: isMobile ? "flex-start" : "center",
                flexDirection: isMobile ? "column" : "row",
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant={isMobile ? "body1" : "subtitle1"}
                sx={{ mr: isMobile ? 0 : 1, mb: isMobile ? 1 : 0 }}
              >
                Filter by Status:
              </Typography>
              <Chip
                label="All"
                onClick={() => handleFilterChange("all")}
                color={filterStatus === "all" ? "primary" : "default"}
                variant={filterStatus === "all" ? "filled" : "outlined"}
              />
              <Chip
                label="Pending"
                onClick={() => handleFilterChange("pending")}
                color={filterStatus === "pending" ? "warning" : "default"}
                variant={filterStatus === "pending" ? "filled" : "outlined"}
              />
              <Chip
                label="Accepted"
                onClick={() => handleFilterChange("accepted")}
                color={filterStatus === "accepted" ? "success" : "default"}
                variant={filterStatus === "accepted" ? "filled" : "outlined"}
              />
              <Chip
                label="Rejected"
                onClick={() => handleFilterChange("rejected")}
                color={filterStatus === "rejected" ? "error" : "default"}
                variant={filterStatus === "rejected" ? "filled" : "outlined"}
              />
            </Box>

            {isUnauthorized ? (
              <Box sx={{ mt: 4 }}>
                <Alert severity="warning">
                  You are not authorized. Please log in to view this page.
                </Alert>
              </Box>
            ) : isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress color="primary" />
                <Typography variant="h6" sx={{ ml: 2, color: "primary" }}>
                  Loading applicants...
                </Typography>
              </Box>
            ) : isError ? (
              <Box sx={{ mt: 4 }}>
                <Alert severity="error">
                  Failed to load applicants. Please try again later.
                </Alert>
              </Box>
            ) : (
              <>
                <TableContainer
                  component={Paper}
                  sx={{
                    overflowX: "auto",
                    maxWidth: "100%",
                    "& .MuiTable-root": {
                      minWidth: isMobile ? 800 : "100%", // Allow horizontal scroll on mobile
                    },
                  }}
                >
                  <Table
                    sx={{
                      minWidth: isMobile ? 800 : "100%",
                      tableLayout: isMobile ? "auto" : "fixed",
                    }}
                    aria-label="loan applicants table"
                    size={isMobile ? "small" : "medium"}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "green", padding: "6" }}>
                          Username
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "6" }}
                        >
                          Phone
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "6" }}
                        >
                          NIDA ID
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "6" }}
                        >
                          Loan Amount
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "6" }}
                        >
                          Passport
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "6" }}
                        >
                          NIDA
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "6" }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "6" }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredApplicants
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((applicant) => (
                          <TableRow
                            key={applicant.id}
                            onClick={() =>
                              handleApplicantDetailsOpen(applicant)
                            }
                            sx={{
                              cursor: "pointer",
                              "&:hover": { bgcolor: "action.hover" },
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{ padding: "6" }}
                            >
                              <Typography variant="body2">
                                {applicant.user.username}
                              </Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6" }}>
                              <Tooltip title={applicant.user.phone}>
                                <IconButton size="small">
                                  <PhoneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6" }}>
                              <Tooltip title={applicant.user.national_id}>
                                <IconButton size="small">
                                  <BadgeIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6" }}>
                              <Typography variant="body2">{`Tsh. ${applicant.loan_amount}`}</Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6" }}>
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageClick(
                                      `${API_BASE_URL}${applicant.passport_picture}`
                                    );
                                  }}
                                />
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6" }}>
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageClick(
                                      `${API_BASE_URL}${applicant.nida_front}`
                                    );
                                  }}
                                />
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6" }}>
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
                            <TableCell align="center" sx={{ padding: "6" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Tooltip
                                  title={
                                    applicant.status !== "pending"
                                      ? "Status Already Set - Cannot Change"
                                      : updatingStatus.has(applicant.id)
                                      ? "Updating..."
                                      : "Accept"
                                  }
                                >
                                  <span>
                                    <IconButton
                                      color="success"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusUpdate(
                                          applicant.id,
                                          "accepted"
                                        );
                                      }}
                                      disabled={
                                        applicant.status !== "pending" ||
                                        updatingStatus.has(applicant.id)
                                      }
                                      size="small"
                                    >
                                      <CheckCircleOutlineIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip
                                  title={
                                    applicant.status !== "pending"
                                      ? "Status Already Set - Cannot Change"
                                      : updatingStatus.has(applicant.id)
                                      ? "Updating..."
                                      : "Reject"
                                  }
                                >
                                  <span>
                                    <IconButton
                                      color="error"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusUpdate(
                                          applicant.id,
                                          "rejected"
                                        );
                                      }}
                                      disabled={
                                        applicant.status !== "pending" ||
                                        updatingStatus.has(applicant.id)
                                      }
                                      size="small"
                                    >
                                      <CancelOutlinedIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    color="secondary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteApplicant(applicant.id);
                                    }}
                                    size="small"
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
              </>
            )}
          </Paper>
        </Box>

        <Box
          sx={{
            width: rightDrawerOpen ? drawerWidthRight : 0,
            bgcolor: "background.paper",
            p: rightDrawerOpen ? 2 : 0,
            borderLeft: rightDrawerOpen ? "1px solid #333" : "none",
            position: "fixed",
            right: 0,
            top: 0,
            height: "100vh",
            overflow: "auto",
            zIndex: 1200,
            transition: "width 0.3s, padding 0.3s",
            whiteSpace: "nowrap",
          }}
        >
          {rightDrawerOpen && (
            <>
              <Box sx={{ mt: 10 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: currentTheme.palette.text.primary }}
                  >
                    Notifications
                  </Typography>
                  <Tooltip title="Refresh Notifications">
                    <IconButton
                      onClick={() => {
                        console.log("Manual refresh notifications...");
                        fetchNotifications();
                      }}
                      size="small"
                      sx={{ color: currentTheme.palette.text.primary }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                  {notifications.filter(
                    (note) => !readNotifications.has(note.id)
                  ).length > 0 && (
                    <Button
                      size="small"
                      onClick={handleMarkAllAsRead}
                      sx={{
                        fontSize: "0.7rem",
                        minWidth: "auto",
                        px: 1,
                        py: 0.5,
                      }}
                    >
                      Mark All Read
                    </Button>
                  )}
                </Box>
                <Divider sx={{ mb: 2 }} />
                {notifications.length > 0 ? (
                  notifications.map((note) => {
                    // Determine if this message was sent by the current user - handle both string and number IDs
                    const isFromCurrentUser =
                      String(note.sender) === String(user.id);
                    const senderDisplayName = isFromCurrentUser
                      ? "You"
                      : note.sender_username || "Unknown";

                    return (
                      <Box
                        key={note.id}
                        sx={{
                          mb: 1,
                          p: 1,
                          bgcolor: readNotifications.has(note.id)
                            ? "action.hover"
                            : "primary.light",
                          borderRadius: 1,
                          cursor: "pointer",
                          border: readNotifications.has(note.id)
                            ? "none"
                            : "2px solid",
                          borderColor: readNotifications.has(note.id)
                            ? "transparent"
                            : "primary.main",
                          opacity: readNotifications.has(note.id) ? 0.7 : 1,
                          position: "relative",
                          "&:hover .delete-button": {
                            opacity: 1,
                          },
                        }}
                        onClick={() => handleNotificationClick(note)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 1,
                          }}
                        >
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: readNotifications.has(note.id)
                                  ? "normal"
                                  : "bold",
                                color: readNotifications.has(note.id)
                                  ? "text.secondary"
                                  : "text.primary",
                                wordBreak: "break-word",
                                mb: 0.5,
                              }}
                            >
                              {note.message}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {isFromCurrentUser
                                  ? "You sent this message"
                                  : `From: ${senderDisplayName}`}
                              </Typography>
                              {note.timestamp && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontSize: "0.65rem" }}
                                >
                                  {new Date(note.timestamp).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            {!readNotifications.has(note.id) && (
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor: "primary.main",
                                }}
                              />
                            )}
                            <IconButton
                              className="delete-button"
                              size="small"
                              onClick={(e) =>
                                handleDeleteNotification(note.id, e)
                              }
                              sx={{
                                opacity: 0,
                                transition: "opacity 0.2s",
                                color: "error.main",
                                "&:hover": {
                                  bgcolor: "error.light",
                                  color: "error.dark",
                                },
                                width: 24,
                                height: 24,
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No new notifications.
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>

        {/* Charts Drawer - Similar to Notifications Drawer */}
        <Box
          sx={{
            width: chartsDrawerOpen ? drawerWidthRight : 0,
            bgcolor: "background.paper",
            p: chartsDrawerOpen ? 2 : 0,
            borderLeft: chartsDrawerOpen ? "1px solid #333" : "none",
            position: "fixed",
            right: 0,
            top: 0,
            height: "100vh",
            overflow: "auto",
            zIndex: 1200,
            transition: "width 0.3s, padding 0.3s",
            whiteSpace: "nowrap",
          }}
        >
          {chartsDrawerOpen && (
            <>
              <Box sx={{ mt: 10 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: currentTheme.palette.text.primary }}
                  >
                    Charts & Conversations
                  </Typography>
                  <IconButton
                    onClick={handleChartsDrawerClose}
                    size="small"
                    sx={{ color: currentTheme.palette.text.primary }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: currentTheme.palette.text.secondary,
                    display: "block",
                    mb: 1,
                  }}
                >
                  Select an applicant to view their data and start a
                  conversation
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "primary.main",
                    display: "block",
                    mb: 2,
                    fontWeight: "bold",
                  }}
                >
                  📊 Total: {applicantsWithNotifications.length} applicants | 💬{" "}
                  {
                    applicantsWithNotifications.filter(
                      (app) => app.hasNotifications
                    ).length
                  }{" "}
                  with messages | 📝{" "}
                  {applicantsWithNotifications.reduce(
                    (sum, app) => sum + app.notificationCount,
                    0
                  )}{" "}
                  total messages
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {applicantsWithNotifications.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <PieChartIcon
                      sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No Applicants Available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No applicants with notifications or pending applications
                      found.
                    </Typography>
                  </Box>
                ) : (
                  applicantsWithNotifications.map((applicant) => {
                    return (
                      <Box
                        key={applicant.id}
                        sx={{
                          mb: 1,
                          p: 1.5,
                          bgcolor: "action.hover",
                          borderRadius: 1,
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: "divider",
                          position: "relative",
                          "&:hover": {
                            bgcolor: "primary.light",
                            borderColor: "primary.main",
                          },
                          "&:hover .delete-button": {
                            opacity: 1,
                          },
                        }}
                        onClick={() => handleSelectApplicant(applicant)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 1,
                          }}
                        >
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: "bold",
                                  color: currentTheme.palette.text.primary,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {applicant.user.username}
                              </Typography>
                              <Chip
                                label={applicant.status}
                                size="small"
                                color={
                                  applicant.status === "accepted"
                                    ? "success"
                                    : applicant.status === "rejected"
                                    ? "error"
                                    : "warning"
                                }
                                sx={{ ml: 1, fontSize: "0.7rem" }}
                              />
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: currentTheme.palette.text.secondary,
                                display: "block",
                                mb: 0.5,
                              }}
                            >
                              📞 {applicant.user.phone} | 💰 Loan: Tsh.{" "}
                              {applicant.loan_amount}
                            </Typography>

                            {/* Always show notification status */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                mb: 0.5,
                              }}
                            >
                              <ChatIcon
                                sx={{
                                  fontSize: "0.8rem",
                                  color: applicant.hasNotifications
                                    ? "primary.main"
                                    : "text.disabled",
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: applicant.hasNotifications
                                    ? "primary.main"
                                    : "text.disabled",
                                  fontSize: "0.7rem",
                                  fontWeight: applicant.hasNotifications
                                    ? "medium"
                                    : "normal",
                                }}
                              >
                                {applicant.hasNotifications
                                  ? `${applicant.notificationCount} message${
                                      applicant.notificationCount !== 1
                                        ? "s"
                                        : ""
                                    }`
                                  : "No messages"}
                              </Typography>
                            </Box>

                            {/* Show latest notification preview if available */}
                            {applicant.latestNotification && (
                              <Box
                                sx={{
                                  bgcolor: "primary.light",
                                  p: 0.5,
                                  borderRadius: 0.5,
                                  mb: 0.5,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "primary.dark",
                                    fontSize: "0.65rem",
                                    fontStyle: "italic",
                                    display: "block",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  💬 Latest: "
                                  {applicant.latestNotification.message.substring(
                                    0,
                                    40
                                  )}
                                  ..."
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    fontSize: "0.6rem",
                                  }}
                                >
                                  {new Date(
                                    applicant.latestNotification.timestamp
                                  ).toLocaleString()}
                                </Typography>
                              </Box>
                            )}

                            {/* Show notification summary */}
                            {applicant.hasNotifications && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "success.main",
                                  fontSize: "0.65rem",
                                  fontWeight: "bold",
                                  display: "block",
                                }}
                              >
                                ✅ Click to view all{" "}
                                {applicant.notificationCount} message
                                {applicant.notificationCount !== 1 ? "s" : ""}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            className="delete-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChart(applicant.id);
                            }}
                            size="small"
                            sx={{
                              opacity: 0,
                              transition: "opacity 0.2s",
                              color: "error.main",
                              "&:hover": {
                                bgcolor: "error.light",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  })
                )}

                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", textAlign: "center" }}
                  >
                    {applicantsWithNotifications.length} applicant
                    {applicantsWithNotifications.length !== 1 ? "s" : ""}{" "}
                    available
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>

        <Dialog open={aboutDialogOpen} onClose={handleAboutClose}>
          <DialogTitle>About This Dashboard</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This is a simple dashboard designed to manage and review loan
              applications. You can filter the list of applicants by name using
              the search bar, and approve or reject applications with the
              corresponding buttons. Notifications are generated when an
              applicant's status is updated.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAboutClose}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={profileDialogOpen}
          onClose={handleProfileClose}
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
              <IconButton size="small" onClick={handleProfileClose}>
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
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AccountCircleIcon
                  sx={{
                    width: 100,
                    height: 100,
                    color: "primary.main",
                    border: "3px solid",
                    borderColor: "primary.main",
                    borderRadius: "50%",
                    backgroundColor: "background.paper",
                  }}
                />
              </Box>

              <Box sx={{ width: "100%", textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {user.username}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    fontWeight: "medium",
                    mb: 3,
                  }}
                >
                  Credit Officer
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
            <Button onClick={handleProfileClose} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={applicantDetailsDialogOpen}
          onClose={handleApplicantDetailsClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Applicant Details
              {selectedApplicantDetails && (
                <Chip
                  label={selectedApplicantDetails.status}
                  color={
                    selectedApplicantDetails.status === "accepted"
                      ? "success"
                      : selectedApplicantDetails.status === "rejected"
                      ? "error"
                      : "warning"
                  }
                  size="small"
                />
              )}
            </Box>
            <IconButton onClick={handleApplicantDetailsClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedApplicantDetails && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Username:</Typography>
                  <Typography variant="body1">
                    <strong>{selectedApplicantDetails.user.username}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Phone:</Typography>
                  <Typography variant="body1">
                    <strong>{selectedApplicantDetails.user.phone}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">NIDA ID:</Typography>
                  <Typography variant="body1">
                    <strong>{selectedApplicantDetails.user.national_id}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Loan Amount:</Typography>
                  <Typography variant="body1">
                    <strong>Tsh. {selectedApplicantDetails.loan_amount}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Passport Picture
                  </Typography>
                  <CardMedia
                    component="img"
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 1,
                      cursor: "pointer",
                    }}
                    image={`${API_BASE_URL}${selectedApplicantDetails.passport_picture}`}
                    onClick={() =>
                      handleImageClick(
                        `${API_BASE_URL}${selectedApplicantDetails.passport_picture}`
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    NIDA Card
                  </Typography>
                  <CardMedia
                    component="img"
                    sx={{
                      width: 150,
                      height: 100,
                      borderRadius: 1,
                      cursor: "pointer",
                    }}
                    image={`${API_BASE_URL}${selectedApplicantDetails.nida_front}`}
                    onClick={() =>
                      handleImageClick(
                        `${API_BASE_URL}${selectedApplicantDetails.nida_front}`
                      )
                    }
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Tooltip
              title={
                selectedApplicantDetails?.status !== "pending"
                  ? "Status Already Set - Cannot Change"
                  : updatingStatus.has(selectedApplicantDetails?.id)
                  ? "Updating..."
                  : "Accept Application"
              }
            >
              <span>
                <IconButton
                  onClick={() =>
                    handleStatusUpdate(selectedApplicantDetails.id, "accepted")
                  }
                  color="success"
                  disabled={
                    selectedApplicantDetails?.status !== "pending" ||
                    updatingStatus.has(selectedApplicantDetails?.id)
                  }
                >
                  <CheckCircleOutlineIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              title={
                selectedApplicantDetails?.status !== "pending"
                  ? "Status Already Set - Cannot Change"
                  : updatingStatus.has(selectedApplicantDetails?.id)
                  ? "Updating..."
                  : "Reject Application"
              }
            >
              <span>
                <IconButton
                  onClick={() =>
                    handleStatusUpdate(selectedApplicantDetails.id, "rejected")
                  }
                  color="error"
                  disabled={
                    selectedApplicantDetails?.status !== "pending" ||
                    updatingStatus.has(selectedApplicantDetails?.id)
                  }
                >
                  <CancelOutlinedIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Delete Application">
              <IconButton
                onClick={() =>
                  handleDeleteApplicant(selectedApplicantDetails.id)
                }
                color="secondary"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </DialogActions>
        </Dialog>

        <Dialog
          open={replyDialogOpen}
          onClose={handleReplyDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "primary.main",
              color: "white",
              py: 1.5,
            }}
          >
            <IconButton
              onClick={handleReplyDialogClose}
              sx={{ mr: 1, color: "white" }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {conversationParticipants.otherUser?.username ||
                  currentReplyUser ||
                  "Applicant"}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Conversation between you and{" "}
                {conversationParticipants.otherUser?.username ||
                  currentReplyUser}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              height: 400,
              overflow: "auto",
              bgcolor:
                currentTheme.palette.mode === "dark" ? "grey.900" : "grey.50",
              p: 1,
            }}
            id="conversation-content"
          >
            {conversationHistory.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  flexDirection: "column",
                  opacity: 0.6,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No messages yet
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Start a conversation by sending a message
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {conversationHistory.map((msg, index) => {
                  // Ensure proper sender identification - handle both string and number IDs
                  const isCurrentUser = String(msg.sender) === String(user.id);

                  // Get the correct sender name based on who sent the message
                  let senderName;
                  if (isCurrentUser) {
                    senderName = "You";
                  } else {
                    // For messages from others, use their username
                    senderName =
                      msg.sender_username ||
                      conversationParticipants.otherUser?.username ||
                      currentReplyUser ||
                      "Unknown User";
                  }

                  // Determine if we should show the sender name (if different from previous message)
                  const prevMsg =
                    index > 0 ? conversationHistory[index - 1] : null;
                  const showSenderName =
                    !prevMsg || prevMsg.sender !== msg.sender;

                  return (
                    <ListItem
                      key={msg.id || index}
                      sx={{
                        display: "flex",
                        justifyContent: isCurrentUser
                          ? "flex-start"
                          : "flex-end",
                        padding: "2px 8px",
                        mb: showSenderName ? 1 : 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "80%",
                          minWidth: "10%",
                          position: "relative",
                        }}
                      >
                        {showSenderName && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              mb: 0.5,
                              ml: isCurrentUser ? 1 : 0,
                              mr: isCurrentUser ? 0 : 1,
                              textAlign: isCurrentUser ? "left" : "right",
                              fontWeight: "bold",
                              color: isCurrentUser
                                ? "primary.main"
                                : "text.secondary",
                              fontSize: "0.75rem",
                            }}
                          >
                            {senderName}
                          </Typography>
                        )}
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: isCurrentUser
                              ? "20px 20px 20px 6px"
                              : "20px 20px 6px 20px",
                            bgcolor: isCurrentUser
                              ? currentTheme.palette.mode === "dark"
                                ? "grey.700"
                                : "white"
                              : "primary.main",
                            color: isCurrentUser ? "text.primary" : "white",
                            boxShadow:
                              currentTheme.palette.mode === "dark" ? 1 : 2,
                            border: isCurrentUser
                              ? `1px solid ${currentTheme.palette.divider}`
                              : "none",
                            position: "relative",
                            "&::before": isCurrentUser
                              ? {
                                  content: '""',
                                  position: "absolute",
                                  bottom: 0,
                                  left: -6,
                                  width: 0,
                                  height: 0,
                                  borderRight: "6px solid",
                                  borderRightColor:
                                    currentTheme.palette.mode === "dark"
                                      ? "grey.700"
                                      : "white",
                                  borderBottom: "6px solid transparent",
                                }
                              : {
                                  content: '""',
                                  position: "absolute",
                                  bottom: 0,
                                  right: -6,
                                  width: 0,
                                  height: 0,
                                  borderLeft: "6px solid",
                                  borderLeftColor: "primary.main",
                                  borderBottom: "6px solid transparent",
                                },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              wordBreak: "break-word",
                              lineHeight: 1.4,
                            }}
                          >
                            {msg.message}
                          </Typography>
                          {(msg.timestamp || msg.created_at) && (
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                mt: 0.5,
                                opacity: 0.7,
                                fontSize: "0.65rem",
                                textAlign: isCurrentUser ? "right" : "left",
                              }}
                            >
                              {new Date(
                                msg.timestamp || msg.created_at
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              p: 2,
              bgcolor:
                currentTheme.palette.mode === "dark" ? "grey.800" : "grey.100",
              borderTop: `1px solid ${currentTheme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                gap: 1,
                alignItems: "flex-end",
              }}
            >
              <TextField
                autoFocus
                multiline
                maxRows={4}
                id="reply-message"
                placeholder={`Message ${
                  conversationParticipants.otherUser?.username ||
                  currentReplyUser ||
                  "user"
                }...`}
                variant="outlined"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleReplySend();
                  }
                }}
                sx={{
                  flexGrow: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    bgcolor: "background.paper",
                    "& fieldset": {
                      borderColor: currentTheme.palette.divider,
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                  "& .MuiInputBase-input": {
                    py: 1,
                  },
                }}
              />
              <IconButton
                onClick={handleReplySend}
                disabled={!replyMessage.trim()}
                sx={{
                  bgcolor: replyMessage.trim() ? "primary.main" : "grey.300",
                  color: replyMessage.trim() ? "white" : "grey.500",
                  "&:hover": {
                    bgcolor: replyMessage.trim() ? "primary.dark" : "grey.400",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "grey.300",
                    color: "grey.500",
                  },
                  width: 48,
                  height: 48,
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </DialogActions>
        </Dialog>

        <Dialog
          open={logoutDialogOpen}
          onClose={() => {}}
          disableEscapeKeyDown
          maxWidth="xs"
        >
          <DialogContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Logging you out...
            </Typography>
            <Box sx={{ width: "100%", mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={logoutProgress}
                color="primary"
                sx={{
                  height: 8,
                  borderRadius: 5,
                  bgcolor: currentTheme.palette.grey[300],
                  "& .MuiLinearProgress-bar": {
                    transition: "none",
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {Math.round(logoutProgress)}%
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Old Charts Dialog - Replaced with Drawer */}
        {false && (
          <Dialog open={false} onClose={() => {}} maxWidth="md" fullWidth>
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "primary.main",
                color: "white",
              }}
            >
              <IconButton
                onClick={handleChartsDialogUsersClose}
                sx={{ mr: 1, color: "white" }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h6">
                  Applicant Charts & Conversations
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Select an applicant to view their data and start a
                  conversation
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
              {applicantsWithNotifications.length === 0 ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <PieChartIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Applicants Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No applicants with notifications or pending applications
                    found.
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {applicantsWithNotifications.map((applicant) => {
                    const hasNotifications = notifications.some(
                      (note) =>
                        note.sender === applicant.user.id ||
                        note.receiver === applicant.user.id
                    );
                    const notificationCount = notifications.filter(
                      (note) =>
                        note.sender === applicant.user.id ||
                        note.receiver === applicant.user.id
                    ).length;

                    return (
                      <ListItem
                        key={applicant.id}
                        button
                        onClick={() => handleSelectApplicant(applicant)}
                        sx={{
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            {applicant.user.username.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight="bold">
                                {applicant.user.username}
                              </Typography>
                              <Chip
                                label={applicant.status}
                                size="small"
                                color={
                                  applicant.status === "accepted"
                                    ? "success"
                                    : applicant.status === "rejected"
                                    ? "error"
                                    : "warning"
                                }
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Loan Amount: Tsh. {applicant.loan_amount}
                              </Typography>
                              {hasNotifications && (
                                <Typography
                                  variant="caption"
                                  color="primary.main"
                                >
                                  {notificationCount} message
                                  {notificationCount !== 1 ? "s" : ""} available
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {hasNotifications && (
                            <Badge
                              badgeContent={notificationCount}
                              color="primary"
                            >
                              <ChatIcon color="action" />
                            </Badge>
                          )}
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChart(applicant.id);
                            }}
                            size="small"
                            sx={{ color: "error.main" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleChartsDialogUsersClose} variant="outlined">
                Close
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ flexGrow: 1 }}
              >
                {applicantsWithNotifications.length} applicant
                {applicantsWithNotifications.length !== 1 ? "s" : ""} available
              </Typography>
            </DialogActions>
          </Dialog>
        )}

        <Dialog
          open={!!selectedImage}
          onClose={handleImageModalClose}
          maxWidth="md"
        >
          <DialogContent>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Enlarged view"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleImageModalClose}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={cancelDeleteNotification}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DeleteIcon color="error" />
              Delete Message
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </DialogContentText>
            {notificationToDelete && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "grey.300",
                }}
              >
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  "{notificationToDelete.message}"
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  {String(notificationToDelete.sender) === String(user.id)
                    ? "You sent this message"
                    : `From: ${
                        notificationToDelete.sender_username || "Unknown"
                      }`}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDeleteNotification} color="primary">
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteNotification}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Alert Dialog */}
        <Dialog
          open={alertDialogOpen}
          onClose={handleAlertClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: alertTitle.includes("Success")
                ? "success.main"
                : alertTitle.includes("Error") || alertTitle.includes("Delete")
                ? "error.main"
                : alertTitle.includes("Warning")
                ? "warning.main"
                : "primary.main",
            }}
          >
            {alertTitle.includes("Success") && <CheckCircleOutlineIcon />}
            {(alertTitle.includes("Error") ||
              alertTitle.includes("Delete")) && <CancelOutlinedIcon />}
            {alertTitle.includes("Warning") && <PendingActionsIcon />}
            {alertTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: "1rem", color: "text.primary" }}>
              {alertMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleAlertClose}
              variant="contained"
              color={alertTitle.includes("Success") ? "success" : "primary"}
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={handleConfirmClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: confirmTitle.includes("Delete")
                ? "error.main"
                : "warning.main",
            }}
          >
            {confirmTitle.includes("Delete") && <CancelOutlinedIcon />}
            {!confirmTitle.includes("Delete") && <PendingActionsIcon />}
            {confirmTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: "1rem", color: "text.primary" }}>
              {confirmMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleConfirmClose}
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAccept}
              variant="contained"
              color={confirmTitle.includes("Delete") ? "error" : "warning"}
              autoFocus
            >
              {confirmTitle.includes("Delete") ? "Delete" : "Confirm"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardPage;
