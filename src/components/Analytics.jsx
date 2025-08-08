import React, { useState, useEffect, useRef } from "react";
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

const drawerWidthLeft = 200;
const drawerWidthRight = 300;

const getStoredValue = (key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error("Error parsing localStorage value:", error);
    return defaultValue;
  }
};

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);
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
    nidaId: "123456789",
    passportPicture: "/media/profile_images/credit_officer.jpg",
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutProgress, setLogoutProgress] = useState(100);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [currentReplyUser, setCurrentReplyUser] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [chartsDialogUsers, setChartsDialogUsers] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [applicantDetailsDialogOpen, setApplicantDetailsDialogOpen] =
    useState(false);
  const [selectedApplicantDetails, setSelectedApplicantDetails] =
    useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const messagesEndRef = useRef(null);

  const API_BASE_URL = "http://192.168.100.142:8000";

  const openAlertDialog = (title, message) => {
    setAlertDialog({ open: true, title, message });
  };

  const closeAlertDialog = () => {
    setAlertDialog({ ...alertDialog, open: false });
  };

  const openConfirmDialog = (title, message, onConfirm) => {
    setConfirmDialog({ open: true, title, message, onConfirm });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, open: false, onConfirm: () => {} });
  };

  const fetchApplicants = async (token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/loan-applications/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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

  const fetchNotifications = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markNotificationAsRead = async (notificationId, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}/read/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to mark notification as read: ${response.status}`
        );
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
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
    fetchNotifications(token);
  }, []);

  useEffect(() => {
    setTotalApplicants(applicants.length);
    setPendingApplicants(
      applicants.filter((app) => app.status === "pending").length
    );
    setAcceptedApplicants(
      applicants.filter((app) => app.status === "accepted").length
    );
    setRejectedApplicants(
      applicants.filter((app) => app.status === "rejected").length
    );
  }, [applicants]);

  useEffect(() => {
    localStorage.setItem("tablePage", JSON.stringify(page));
  }, [page]);

  useEffect(() => {
    localStorage.setItem("tableRowsPerPage", JSON.stringify(rowsPerPage));
  }, [rowsPerPage]);

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem("access");
    const csrftoken = getCookie("csrftoken");

    if (!token || !csrftoken) {
      console.error("Missing authentication or CSRF token.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/loan-applications/${id}/status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      const updatedApplicant = await response.json();

      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) =>
          applicant.id === id ? updatedApplicant : applicant
        )
      );
      if (selectedApplicantDetails && selectedApplicantDetails.id === id) {
        setSelectedApplicantDetails(updatedApplicant);
      }
      fetchNotifications(token);
    } catch (error) {
      console.error("Error updating status:", error);
      openAlertDialog(
        "Update Failed",
        "Failed to update status. Please try again."
      );
    }
  };

  const handleDeleteApplicant = async (id) => {
    const token = localStorage.getItem("access");
    const csrftoken = getCookie("csrftoken");

    if (!token || !csrftoken) {
      console.error("Missing authentication or CSRF token.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/loan-applications/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRFToken": csrftoken,
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
    } catch (error) {
      console.error("Error deleting applicant:", error);
      openAlertDialog(
        "Deletion Failed",
        "Failed to delete applicant. Please try again."
      );
    }
  };

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

  const handleEditProfile = () => {
    openAlertDialog(
      "Feature Under Development",
      "Profile editing feature is under development."
    );
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
    setSelectedNotification(notification);
    const token = localStorage.getItem("access");

    // Mark the clicked notification as read
    if (!notification.is_read) {
      markNotificationAsRead(notification.id, token);
    }

    // Filter all messages related to this conversation
    const conversation = notifications
      .filter(
        (note) =>
          note.sender_username === notification.sender_username ||
          note.receiver_username === notification.sender_username
      )
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    setConversationHistory(conversation);
    setCurrentReplyUser(notification.sender_username);
    setReplyDialogOpen(true);
  };

  const handleReplySend = async () => {
    if (replyMessage.trim() && selectedNotification) {
      const token = localStorage.getItem("access");
      if (!token) return;

      const messageData = {
        sender: user.id,
        receiver: selectedNotification.sender,
        message: replyMessage,
        is_read: false,
      };

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
          throw new Error(`Failed to send message: ${response.status}`);
        }

        const newMessage = await response.json();
        setConversationHistory((prev) => [...prev, newMessage]);
        setReplyMessage("");
        fetchNotifications(token);
      } catch (error) {
        console.error("Error sending message:", error);
        openAlertDialog(
          "Send Failed",
          "Failed to send message. Please try again."
        );
      }
    }
  };

  const handleReplyDialogClose = () => {
    setReplyDialogOpen(false);
    setReplyMessage("");
    setCurrentReplyUser(null);
    setConversationHistory([]);
    setSelectedNotification(null);
  };

  const handleChartsDialogUsersOpen = () => {
    setChartsDialogUsers(true);
  };

  const handleChartsDialogUsersClose = () => {
    setChartsDialogUsers(false);
  };

  const handleSelectApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setCurrentReplyUser(applicant.user.username);
    const conversation = notifications
      .filter(
        (note) =>
          note.sender_username === applicant.user.username ||
          note.receiver_username === applicant.user.username
      )
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    setConversationHistory(conversation);
    setReplyDialogOpen(true);
    handleChartsDialogUsersClose();
  };

  const handleDeleteChart = (applicantId) => {
    const applicantToDelete = applicants.find((app) => app.id === applicantId);
    openConfirmDialog(
      "Confirm Deletion",
      `Are you sure you want to delete the chart for ${applicantToDelete.user.username}?`,
      () => {
        setNotifications((prevNotes) =>
          prevNotes.filter((note) => note.applicantId !== applicantId)
        );
        openAlertDialog(
          "Deletion Successful",
          `Chart for ${applicantToDelete.user.username} has been deleted.`
        );
        closeConfirmDialog();
      }
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

  const currentTheme = mode === "dark" ? darkTheme : lightTheme;

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

  const applicantsWithNotifications = applicants.filter((applicant) =>
    notifications.some(
      (note) => note.sender_username === applicant.user.username
    )
  );

  const unreadNotificationsCount = notifications.filter(
    (n) => !n.is_read
  ).length;

  useEffect(() => {
    if (replyDialogOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory, replyDialogOpen]);

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
                <Badge badgeContent={unreadNotificationsCount} color="error">
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
            p: leftDrawerOpen ? 2 : 0,
            borderRight: leftDrawerOpen ? "1px solid #333" : "none",
            position: "fixed",
            top: 0,
            height: "100vh",
            overflow: "auto",
            zIndex: 1200,
            transition: "width 0.3s, padding 0.3s",
            whiteSpace: "nowrap",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
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
                  onClick={handleProfileOpen}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    mb: 2,
                    p: 1,
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: "50%",
                      mb: 1,
                    }}
                    image={`${API_BASE_URL}${user.passport_picture}`}
                    alt="Profile"
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: currentTheme.palette.text.primary,
                      textAlign: "center",
                    }}
                  >
                    {user.username}
                  </Typography>
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
                  onClick={handleChartsDialogUsersOpen}
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

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: leftDrawerOpen ? `${drawerWidthLeft}px` : "0",
            mr: rightDrawerOpen ? `${drawerWidthRight}px` : "0",
            p: 3,
            mt: 8,
            transition: "margin-left 0.3s, margin-right 0.3s",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              borderRadius: 2,
              maxWidth: "lg",
              width: "100%",
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
              <Grid item xs={12}>
                <Card sx={{ bgcolor: "background.default" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <GroupIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" component="div">
                      {totalApplicants}
                    </Typography>
                    <Typography color="text.secondary">
                      Total Applicants
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ bgcolor: "background.default" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <PendingActionsIcon
                      color="warning"
                      sx={{ fontSize: 40, mb: 1 }}
                    />
                    <Typography variant="h5" component="div">
                      {pendingApplicants}
                    </Typography>
                    <Typography color="text.secondary">
                      Pending Applications
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ bgcolor: "background.default" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <CheckCircleIcon
                      color="success"
                      sx={{ fontSize: 40, mb: 1 }}
                    />
                    <Typography variant="h5" component="div">
                      {acceptedApplicants}
                    </Typography>
                    <Typography color="text.secondary">
                      Accepted Applications
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ bgcolor: "background.default" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <CancelIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" component="div">
                      {rejectedApplicants}
                    </Typography>
                    <Typography color="text.secondary">
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

            <Box sx={{ mb: 3, display: "flex", gap: 1, alignItems: "center" }}>
              <Typography variant="subtitle1" sx={{ mr: 1 }}>
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
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: "100%", tableLayout: "fixed" }}
                    aria-label="loan applicants table"
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
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <PhoneIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6" }}>
                              <Tooltip title={applicant.user.nida_id}>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <BadgeIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6" }}>
                              <Typography variant="body2">
                                TZS {applicant.loan_amount}
                              </Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6" }}>
                              {applicant.user.passport_picture && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageClick(
                                      `${API_BASE_URL}${applicant.user.passport_picture}`
                                    );
                                  }}
                                >
                                  <img
                                    src={`${API_BASE_URL}${applicant.user.passport_picture}`}
                                    alt="Passport"
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                    }}
                                  />
                                </IconButton>
                              )}
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6" }}>
                              {applicant.user.nida_picture && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageClick(
                                      `${API_BASE_URL}${applicant.user.nida_picture}`
                                    );
                                  }}
                                >
                                  <img
                                    src={`${API_BASE_URL}${applicant.user.nida_picture}`}
                                    alt="NIDA"
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                    }}
                                  />
                                </IconButton>
                              )}
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6" }}>
                              <Chip
                                label={applicant.status}
                                color={
                                  applicant.status === "pending"
                                    ? "warning"
                                    : applicant.status === "accepted"
                                    ? "success"
                                    : "error"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6" }}>
                              <Tooltip title="Accept">
                                <IconButton
                                  color="success"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openConfirmDialog(
                                      "Confirm Acceptance",
                                      `Are you sure you want to accept the loan application from ${applicant.user.username}?`,
                                      () => {
                                        handleStatusUpdate(
                                          applicant.id,
                                          "accepted"
                                        );
                                        closeConfirmDialog();
                                      }
                                    );
                                  }}
                                  disabled={applicant.status !== "pending"}
                                >
                                  <CheckCircleOutlineIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openConfirmDialog(
                                      "Confirm Rejection",
                                      `Are you sure you want to reject the loan application from ${applicant.user.username}?`,
                                      () => {
                                        handleStatusUpdate(
                                          applicant.id,
                                          "rejected"
                                        );
                                        closeConfirmDialog();
                                      }
                                    );
                                  }}
                                  disabled={applicant.status !== "pending"}
                                >
                                  <CancelOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  color="inherit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openConfirmDialog(
                                      "Confirm Deletion",
                                      `Are you sure you want to permanently delete the application from ${applicant.user.username}? This action cannot be undone.`,
                                      () => {
                                        handleDeleteApplicant(applicant.id);
                                        closeConfirmDialog();
                                      }
                                    );
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
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

        {/* Right Drawer for Notifications */}
        <Box
          sx={{
            width: rightDrawerOpen ? drawerWidthRight : 0,
            bgcolor: "background.paper",
            p: rightDrawerOpen ? 2 : 0,
            borderLeft: rightDrawerOpen ? "1px solid #333" : "none",
            position: "fixed",
            top: 0,
            right: 0,
            height: "100vh",
            overflow: "auto",
            zIndex: 1200,
            transition: "width 0.3s, padding 0.3s",
          }}
        >
          {rightDrawerOpen && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1,
                  mt: 8,
                }}
              >
                <Typography variant="h6">Notifications</Typography>
                <IconButton onClick={toggleRightDrawer}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Divider />
              <List>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <ListItem
                      button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        "&:hover": { bgcolor: "action.hover" },
                        bgcolor: notification.is_read
                          ? "inherit"
                          : "action.selected",
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: notification.is_read
                                  ? "normal"
                                  : "bold",
                              }}
                            >
                              {notification.sender_username}
                            </Typography>
                            <Chip
                              label={
                                notification.status_change ||
                                (notification.is_read ? "Read" : "Unread")
                              }
                              size="small"
                              color={
                                notification.is_read ? "default" : "primary"
                              }
                            />
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{
                              color: notification.is_read
                                ? "text.secondary"
                                : "text.primary",
                              fontWeight: notification.is_read
                                ? "normal"
                                : "bold",
                            }}
                          >
                            {notification.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ p: 2 }}
                  >
                    No notifications.
                  </Typography>
                )}
              </List>
            </>
          )}
        </Box>

        {/* Dialog for About page */}
        <Dialog open={aboutDialogOpen} onClose={handleAboutClose}>
          <DialogTitle>About This Application</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This is a credit officer dashboard application.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAboutClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Image View */}
        <Dialog
          open={Boolean(selectedImage)}
          onClose={handleImageModalClose}
          maxWidth="lg"
        >
          <DialogTitle>
            Image View
            <IconButton
              aria-label="close"
              onClick={handleImageModalClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box
              component="img"
              src={selectedImage}
              sx={{ maxWidth: "100%", maxHeight: "80vh" }}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog for Logout Confirmation */}
        <Dialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
        >
          <DialogTitle>Logging Out</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You are being securely logged out. Please wait.
            </DialogContentText>
            <LinearProgress
              variant="determinate"
              value={logoutProgress}
              color="primary"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          {isLoggingOut && (
            <DialogActions>
              <Button onClick={() => setLogoutDialogOpen(false)} disabled>
                Cancel
              </Button>
            </DialogActions>
          )}
        </Dialog>

        {/* Dialog for Profile Details */}
        <Dialog open={profileDialogOpen} onClose={handleProfileClose}>
          <DialogTitle>
            My Profile
            <IconButton
              aria-label="close"
              onClick={handleProfileClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: "50%",
                  mb: 2,
                }}
                image={`${API_BASE_URL}${user.passport_picture}`}
                alt="Profile"
              />
              <Typography variant="h6">{user.username}</Typography>
              <Typography variant="body2" color="text.secondary">
                NIDA ID: {user.nidaId}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditProfile} color="primary">
              <EditIcon sx={{ mr: 1 }} /> Edit Profile
            </Button>
            <Button onClick={handleProfileClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Applicant Details */}
        <Dialog
          open={applicantDetailsDialogOpen}
          onClose={handleApplicantDetailsClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Applicant Details
            <IconButton
              aria-label="close"
              onClick={handleApplicantDetailsClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedApplicantDetails && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Username:
                    </Typography>
                    <Typography variant="h6">
                      {selectedApplicantDetails.user.username}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Loan Amount:
                    </Typography>
                    <Typography variant="h6">
                      TZS {selectedApplicantDetails.loan_amount}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Status:
                    </Typography>
                    <Chip
                      label={selectedApplicantDetails.status}
                      color={
                        selectedApplicantDetails.status === "pending"
                          ? "warning"
                          : selectedApplicantDetails.status === "accepted"
                          ? "success"
                          : "error"
                      }
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Application Date:
                    </Typography>
                    <Typography variant="body1">
                      {new Date(
                        selectedApplicantDetails.application_date
                      ).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      NIDA ID:
                    </Typography>
                    <Typography variant="body1">
                      {selectedApplicantDetails.user.nida_id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Phone:
                    </Typography>
                    <Typography variant="body1">
                      {selectedApplicantDetails.user.phone}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Passport Picture:
                    </Typography>
                    {selectedApplicantDetails.user.passport_picture ? (
                      <IconButton
                        onClick={() =>
                          handleImageClick(
                            `${API_BASE_URL}${selectedApplicantDetails.user.passport_picture}`
                          )
                        }
                      >
                        <img
                          src={`${API_BASE_URL}${selectedApplicantDetails.user.passport_picture}`}
                          alt="Passport"
                          style={{
                            width: 150,
                            height: 150,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      </IconButton>
                    ) : (
                      <Typography>N/A</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      NIDA Picture:
                    </Typography>
                    {selectedApplicantDetails.user.nida_picture ? (
                      <IconButton
                        onClick={() =>
                          handleImageClick(
                            `${API_BASE_URL}${selectedApplicantDetails.user.nida_picture}`
                          )
                        }
                      >
                        <img
                          src={`${API_BASE_URL}${selectedApplicantDetails.user.nida_picture}`}
                          alt="NIDA"
                          style={{
                            width: 150,
                            height: 150,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      </IconButton>
                    ) : (
                      <Typography>N/A</Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleSelectApplicant(selectedApplicantDetails)}
              color="primary"
            >
              Reply
            </Button>
            <Button onClick={handleApplicantDetailsClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Reply/Conversation */}
        <Dialog
          open={replyDialogOpen}
          onClose={handleReplyDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Conversation with {currentReplyUser}
            <IconButton
              aria-label="close"
              onClick={handleReplyDialogClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: 400,
                overflowY: "auto",
              }}
            >
              {conversationHistory.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 1,
                    display: "flex",
                    justifyContent:
                      message.sender_username === user.username
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <Paper
                    sx={{
                      p: 1,
                      backgroundColor:
                        message.sender_username === user.username
                          ? "primary.light"
                          : "grey.200",
                      color:
                        message.sender_username === user.username
                          ? "white"
                          : "black",
                      borderRadius:
                        message.sender_username === user.username
                          ? "10px 10px 0 10px"
                          : "10px 10px 10px 0",
                      maxWidth: "75%",
                    }}
                  >
                    <Typography variant="caption" display="block" gutterBottom>
                      {message.sender_username}
                    </Typography>
                    <Typography variant="body2">{message.message}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", textAlign: "right", mt: 0.5 }}
                    >
                      {new Date(message.created_at).toLocaleString()}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
          </DialogContent>
          <DialogActions>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleReplySend();
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleReplySend}
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Charts */}
        <Dialog open={chartsDialogUsers} onClose={handleChartsDialogUsersClose}>
          <DialogTitle>
            Applicants with Charts
            <IconButton
              aria-label="close"
              onClick={handleChartsDialogUsersClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <List>
              {applicantsWithNotifications.length > 0 ? (
                applicantsWithNotifications.map((applicant) => (
                  <ListItem
                    key={applicant.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteChart(applicant.id)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={applicant.user.username}
                      onClick={() => handleSelectApplicant(applicant)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No applicants with charts." />
                </ListItem>
              )}
            </List>
          </DialogContent>
        </Dialog>

        {/* Dialogs for Alert and Confirm */}
        <Dialog open={alertDialog.open} onClose={closeAlertDialog}>
          <DialogTitle>{alertDialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{alertDialog.message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAlertDialog} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
          <DialogTitle>{confirmDialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{confirmDialog.message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDialog.onConfirm} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardPage;
