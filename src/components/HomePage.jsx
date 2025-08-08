import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [user] = useState("Credit Officer");
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

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setIsUnauthorized(true);
      setIsLoading(false);
      return;
    }

    const fetchApplicants = async () => {
      try {
        const response = await fetch(
          "http://192.168.100.142:8000/api/admin/loan-applications/",
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

    fetchApplicants();
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

  const handleStatusUpdate = (id, newStatus) => {
    setApplicants((prevApplicants) =>
      prevApplicants.map((applicant) => {
        if (applicant.id === id) {
          const newApplicant = { ...applicant, status: newStatus };
          const existingNotificationIndex = notifications.findIndex(
            (note) => note.applicantId === newApplicant.id
          );

          if (existingNotificationIndex !== -1) {
            setNotifications((prevNotes) =>
              prevNotes.map((note, index) =>
                index === existingNotificationIndex
                  ? {
                      ...note,
                      message: `${newApplicant.user.username}'s application was ${newStatus}.`,
                    }
                  : note
              )
            );
          } else {
            setNotifications((prevNotes) => [
              ...prevNotes,
              {
                id: Date.now(),
                message: `${newApplicant.user.username}'s application was ${newStatus}.`,
                applicantId: newApplicant.id,
                username: newApplicant.user.username,
                sender: "system",
              },
            ]);
          }

          return newApplicant;
        }
        return applicant;
      })
    );
  };

  const handleDeleteApplicant = (id) => {
    setApplicants((prevApplicants) =>
      prevApplicants.filter((applicant) => applicant.id !== id)
    );
    setNotifications((prevNotes) => [
      ...prevNotes,
      {
        id: Date.now(),
        message: `An application was deleted.`,
        applicantId: id,
        sender: "system",
      },
    ]);
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
        navigate("/login");
      }
      setLogoutProgress(progress);
    }, 100);
  };

  const handleNotificationClick = (notification) => {
    setConversationHistory([
      { sender: notification.username || "System", text: notification.message },
      { sender: "You", text: "Hello, I received your notification." },
    ]);
    setCurrentReplyUser(notification.username);
    setReplyDialogOpen(true);
  };

  const handleReplySend = () => {
    if (replyMessage.trim()) {
      const newConversation = [
        ...conversationHistory,
        { sender: "You", text: replyMessage },
      ];
      setConversationHistory(newConversation);
      console.log(`Replying to ${currentReplyUser}: ${replyMessage}`);
      setReplyMessage("");
    }
  };

  const handleReplyDialogClose = () => {
    setReplyDialogOpen(false);
    setReplyMessage("");
    setCurrentReplyUser(null);
    setConversationHistory([]);
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
    setConversationHistory([
      {
        sender: applicant.user.username,
        text: "A user-sent message or chart data.",
      },
    ]);
    setReplyDialogOpen(true);
    handleChartsDialogUsersClose();
  };

  const handleDeleteChart = (applicantId) => {
    const applicantToDelete = applicants.find((app) => app.id === applicantId);
    if (
      window.confirm(
        `Are you sure you want to delete the chart for ${applicantToDelete.user.username}?`
      )
    ) {
      setNotifications((prevNotes) =>
        prevNotes.filter((note) => note.applicantId !== applicantId)
      );
      alert(`Chart for ${applicantToDelete.user.username} has been deleted.`);
    }
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
    notifications.some((note) => note.username === applicant.user.username)
  );

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
                <Badge badgeContent={notifications.length} color="error">
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
          }}
        >
          {leftDrawerOpen && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  mb: 4,
                  mt: 10,
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    width: "100%",
                  }}
                >
                  <AccountCircleIcon
                    sx={{ fontSize: 40, mr: 2, color: "green" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: currentTheme.palette.text.primary }}
                  >
                    {user || "User Name"}
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
                  startIcon={<BarChartIcon />}
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
              <Box sx={{ p: 2 }}>
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
                Welcome{user ? `, ${user}` : ""}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This page displays a list of loan applicants awaiting your
                review.
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
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
                        <TableCell sx={{ color: "green", padding: "4px" }}>
                          Username
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "4px" }}
                        >
                          Phone
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "4px" }}
                        >
                          NIDA ID
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "4px" }}
                        >
                          Loan Amount
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "4px" }}
                        >
                          Passport
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "4px" }}
                        >
                          NIDA
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "4px" }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "green", padding: "4px" }}
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
                          <TableRow key={applicant.id}>
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{ padding: "4px" }}
                            >
                              <Typography variant="body2">
                                {applicant.user.username}
                              </Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "4px" }}>
                              <Tooltip title={applicant.user.phone}>
                                <IconButton size="small">
                                  <PhoneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "4px" }}>
                              <Tooltip title={applicant.user.national_id}>
                                <IconButton size="small">
                                  <BadgeIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "4px" }}>
                              <Typography variant="body2">{`Tsh. ${applicant.loan_amount}`}</Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "4px" }}>
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
                                  image={`http://192.168.100.142:8000${applicant.passport_picture}`}
                                  alt={`${applicant.user.username} Passport`}
                                  onClick={() =>
                                    handleImageClick(
                                      `http://192.168.100.142:8000${applicant.passport_picture}`
                                    )
                                  }
                                />
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "4px" }}>
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
                                  image={`http://192.168.100.142:8000${applicant.nida_front}`}
                                  alt={`${applicant.user.username} NIDA`}
                                  onClick={() =>
                                    handleImageClick(
                                      `http://192.168.100.142:8000${applicant.nida_front}`
                                    )
                                  }
                                />
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "4px" }}>
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
                            <TableCell align="center" sx={{ padding: "4px" }}>
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
                                    onClick={() =>
                                      handleStatusUpdate(
                                        applicant.id,
                                        "accepted"
                                      )
                                    }
                                    disabled={applicant.status === "accepted"}
                                    size="small"
                                  >
                                    <CheckCircleOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton
                                    color="error"
                                    onClick={() =>
                                      handleStatusUpdate(
                                        applicant.id,
                                        "rejected"
                                      )
                                    }
                                    disabled={applicant.status === "rejected"}
                                    size="small"
                                  >
                                    <CancelOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    color="secondary"
                                    onClick={() =>
                                      handleDeleteApplicant(applicant.id)
                                    }
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
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: currentTheme.palette.text.primary }}
                >
                  Notifications
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {notifications.length > 0 ? (
                  notifications.map((note) => (
                    <Box
                      key={note.id}
                      sx={{
                        mb: 1,
                        p: 1,
                        bgcolor: "action.hover",
                        borderRadius: 1,
                        cursor: "pointer",
                      }}
                      onClick={() => handleNotificationClick(note)}
                    >
                      <Typography variant="body2">{note.message}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No new notifications.
                  </Typography>
                )}
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
          open={replyDialogOpen}
          onClose={handleReplyDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleReplyDialogClose} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            Conversation with {currentReplyUser || "Applicant"}
          </DialogTitle>
          <DialogContent dividers sx={{ height: 400 }}>
            <List>
              {conversationHistory.map((msg, index) => (
                <ListItem
                  key={index}
                  sx={{
                    justifyContent:
                      msg.sender === "You" ? "flex-end" : "flex-start",
                    padding: 0,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      p: 1,
                      mb: 1,
                      borderRadius: "10px",
                      bgcolor:
                        msg.sender === "You" ? "primary.main" : "grey.300",
                      color: msg.sender === "You" ? "white" : "black",
                      textAlign: msg.sender === "You" ? "right" : "left",
                    }}
                  >
                    <Typography variant="caption" display="block">
                      {msg.sender === "You" ? "You" : currentReplyUser}
                    </Typography>
                    <ListItemText primary={msg.text} />
                  </Box>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <TextField
              autoFocus
              margin="dense"
              id="reply-message"
              label="Type your message..."
              type="text"
              fullWidth
              variant="outlined"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleReplySend();
                }
              }}
            />
            <Button onClick={handleReplySend} disabled={!replyMessage.trim()}>
              Send
            </Button>
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

        <Dialog
          open={chartsDialogUsers}
          onClose={handleChartsDialogUsersClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleChartsDialogUsersClose} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            Select an Applicant with Charts
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Choose an applicant to view their charts and continue the
              conversation.
            </Typography>
            <List>
              {applicantsWithNotifications.map((applicant) => (
                <ListItem
                  key={applicant.id}
                  button
                  onClick={() => handleSelectApplicant(applicant)}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteChart(applicant.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={applicant.user.username} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleChartsDialogUsersClose}>Close</Button>
          </DialogActions>
        </Dialog>

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
      </Box>
    </ThemeProvider>
  );
};

export default DashboardPage;
