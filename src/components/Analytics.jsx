import React, { useState, useEffect } from "react";
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
import Brightness2Icon from "@mui/icons-material/Brightness2";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InfoIcon from "@mui/icons-material/Info";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// Import Recharts components
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

// --- Theme Definitions ---
const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    primary: {
      main: "#4caf50", // A standard green
    },
    secondary: {
      main: "#81c784", // A lighter green
    },
    headerGreen: {
      main: "#388e3c", // A darker green for the header
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
      main: "#81c784", // A lighter green for dark mode
    },
    secondary: {
      main: "#66bb6a", // A medium green
    },
    headerGreen: {
      main: "#388e3c", // Dark green for dark mode header
    },
  },
});

const drawerWidthLeft = 200;
const drawerWidthRight = 300;

const COLORS = {
  accepted: "#4CAF50",
  pending: "#FFC107",
  rejected: "#F44336",
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

  const [page, setPage] = useState(() => getStoredValue("tablePage", 0));
  const [rowsPerPage, setRowsPerPage] = useState(() =>
    getStoredValue("tableRowsPerPage", 10)
  );

  const [selectedImage, setSelectedImage] = useState(null);

  const [statusCounts, setStatusCounts] = useState([]);
  const [totalLoanAmount, setTotalLoanAmount] = useState(0);

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
    if (applicants.length > 0) {
      const counts = applicants.reduce((acc, applicant) => {
        acc[applicant.status] = (acc[applicant.status] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.keys(counts).map((status) => ({
        name: status,
        value: counts[status],
      }));
      setStatusCounts(chartData);

      const totalAmount = applicants.reduce(
        (sum, applicant) => sum + applicant.loan_amount,
        0
      );
      setTotalLoanAmount(totalAmount);
    } else {
      setStatusCounts([]);
      setTotalLoanAmount(0);
    }
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
          setNotifications((prevNotes) => [
            ...prevNotes,
            {
              id: Date.now(),
              message: `${newApplicant.user.username}'s application was ${newStatus}.`,
              applicantId: newApplicant.id,
            },
          ]);
          return newApplicant;
        }
        return applicant;
      })
    );
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

  const currentTheme = mode === "dark" ? darkTheme : lightTheme;

  const filteredApplicants = applicants.filter((applicant) =>
    applicant.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(num);
  };

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
                <NotificationsIcon />
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
                >
                  Analytics
                </Button>
                <Button
                  startIcon={<SettingsIcon />}
                  fullWidth
                  sx={{ justifyContent: "flex-start", color: "text.primary" }}
                >
                  Settings
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
          }}
        >
          <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                Welcome{user ? `, ${user}` : ""}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This page displays a list of loan applicants awaiting your
                review.
              </Typography>
            </Box>

            {/* Enhanced Analytics Section */}
            {!isLoading && !isError && !isUnauthorized && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ color: "primary.main", mb: 3, fontWeight: "bold" }}
                >
                  📊 Analytics Overview
                </Typography>

                {/* KPI Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        background:
                          "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
                        color: "white",
                        height: "140px",
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: "-50%",
                          right: "-50%",
                          width: "200%",
                          height: "200%",
                          background:
                            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                          animation: "pulse 3s ease-in-out infinite",
                        },
                        "@keyframes pulse": {
                          "0%": { transform: "scale(0.8)", opacity: 0.5 },
                          "50%": { transform: "scale(1.2)", opacity: 0.8 },
                          "100%": { transform: "scale(0.8)", opacity: 0.5 },
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          zIndex: 1,
                        }}
                      >
                        <AttachMoneyIcon sx={{ fontSize: 48, mr: 2 }} />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Total Loan Amount
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                            {formatNumber(totalLoanAmount)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        background:
                          "linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)",
                        color: "white",
                        height: "140px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CardContent
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <PeopleIcon sx={{ fontSize: 48, mr: 2 }} />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Total Applications
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                            {applicants.length}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        background:
                          "linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)",
                        color: "white",
                        height: "140px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CardContent
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <TrendingUpIcon sx={{ fontSize: 48, mr: 2 }} />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Approval Rate
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                            {applicants.length > 0
                              ? `${Math.round(
                                  ((statusCounts.find(
                                    (s) => s.name === "accepted"
                                  )?.value || 0) /
                                    applicants.length) *
                                    100
                                )}%`
                              : "0%"}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Charts Section */}
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background:
                          mode === "dark"
                            ? "linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)"
                            : "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                        border: `2px solid ${currentTheme.palette.primary.main}20`,
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ mb: 3, fontWeight: "bold" }}
                      >
                        🎯 Application Status Distribution
                      </Typography>
                      {statusCounts.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={statusCounts}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              innerRadius={40}
                              fill="#8884d8"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                              labelLine={false}
                            >
                              {statusCounts.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[entry.name]}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No data available
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background:
                          mode === "dark"
                            ? "linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)"
                            : "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                        border: `2px solid ${currentTheme.palette.secondary.main}20`,
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ mb: 3, fontWeight: "bold" }}
                      >
                        📈 Status Overview
                      </Typography>
                      {statusCounts.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart
                            data={statusCounts}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke={mode === "dark" ? "#444" : "#e0e0e0"}
                            />
                            <XAxis
                              dataKey="name"
                              stroke={currentTheme.palette.text.primary}
                              fontSize={12}
                            />
                            <YAxis
                              stroke={currentTheme.palette.text.primary}
                              fontSize={12}
                            />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor:
                                  currentTheme.palette.background.paper,
                                border: `1px solid ${currentTheme.palette.divider}`,
                                borderRadius: "8px",
                              }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {statusCounts.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[entry.name]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No data available
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            <Typography
              variant="h5"
              gutterBottom
              sx={{ mb: 3, color: "primary" }}
            >
              Loan Applicants
            </Typography>

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
                    sx={{ minWidth: 650 }}
                    aria-label="loan applicants table"
                  >
                    <TableHead
                      sx={{ bgcolor: currentTheme.palette.headerGreen.main }}
                    >
                      <TableRow>
                        <TableCell sx={{ color: "white" }}>Username</TableCell>
                        <TableCell align="right" sx={{ color: "white" }}>
                          Phone Number
                        </TableCell>
                        <TableCell align="right" sx={{ color: "white" }}>
                          National ID
                        </TableCell>
                        <TableCell align="right" sx={{ color: "white" }}>
                          Loan Amount
                        </TableCell>
                        <TableCell align="center" sx={{ color: "white" }}>
                          Passport Image
                        </TableCell>
                        <TableCell align="center" sx={{ color: "white" }}>
                          NIDA Front
                        </TableCell>
                        <TableCell align="center" sx={{ color: "white" }}>
                          NIDA Back
                        </TableCell>
                        <TableCell align="center" sx={{ color: "white" }}>
                          Status
                        </TableCell>
                        <TableCell align="center" sx={{ color: "white" }}>
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
                            <TableCell component="th" scope="row">
                              {applicant.user.username}
                            </TableCell>
                            <TableCell align="right">
                              {applicant.user.phone}
                            </TableCell>
                            <TableCell align="right">
                              {applicant.user.national_id}
                            </TableCell>
                            <TableCell align="right">
                              {formatNumber(applicant.loan_amount)}
                            </TableCell>
                            <TableCell align="center">
                              <CardMedia
                                component="img"
                                sx={{
                                  width: 50,
                                  height: 50,
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
                            </TableCell>
                            <TableCell align="center">
                              <CardMedia
                                component="img"
                                sx={{
                                  width: 100,
                                  height: 50,
                                  objectFit: "contain",
                                  mx: "auto",
                                  cursor: "pointer",
                                }}
                                image={`http://192.168.100.142:8000${applicant.nida_front}`}
                                alt={`${applicant.user.username} NIDA Front`}
                                onClick={() =>
                                  handleImageClick(
                                    `http://192.168.100.142:8000${applicant.nida_front}`
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell align="center">
                              <CardMedia
                                component="img"
                                sx={{
                                  width: 100,
                                  height: 50,
                                  objectFit: "contain",
                                  mx: "auto",
                                  cursor: "pointer",
                                }}
                                image={`http://192.168.100.142:8000${applicant.nida_back}`}
                                alt={`${applicant.user.username} NIDA Back`}
                                onClick={() =>
                                  handleImageClick(
                                    `http://192.168.100.142:8000${applicant.nida_back}`
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="body2"
                                sx={{
                                  color:
                                    applicant.status === "accepted"
                                      ? "primary.main"
                                      : applicant.status === "rejected"
                                      ? "red"
                                      : "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                {applicant.status}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: 1,
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
                                  >
                                    <CheckCircleOutlineIcon />
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
                                  >
                                    <CancelOutlinedIcon />
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
              <Box sx={{ mt: 10 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Notifications
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {notifications.length > 0 ? (
                  <List>
                    {notifications.map((notification) => (
                      <ListItem key={notification.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={notification.message}
                          secondary={new Date().toLocaleString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No new notifications
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>

        {/* Image Modal */}
        <Dialog
          open={selectedImage !== null}
          onClose={handleImageModalClose}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ textAlign: "center", p: 2 }}>
            {selectedImage && (
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "70vh",
                  objectFit: "contain",
                }}
                image={selectedImage}
                alt="Document"
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleImageModalClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* About Dialog */}
        <Dialog open={aboutDialogOpen} onClose={handleAboutClose}>
          <DialogTitle>About Credit Officer Dashboard</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This dashboard allows credit officers to review and manage loan
              applications. You can view applicant details, check submitted
              documents, and approve or reject applications.
            </DialogContentText>
            <DialogContentText sx={{ mt: 2 }}>
              Features:
              <br />• View all loan applications • Search applicants by username
              • Review passport and NIDA documents • Approve or reject
              applications • View analytics and statistics • Dark/Light mode
              toggle
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAboutClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardPage;
