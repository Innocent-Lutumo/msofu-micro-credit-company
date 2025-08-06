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
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InfoIcon from "@mui/icons-material/Info";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f48fb1",
    },
    headerBlue: {
      main: "#1976d2",
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
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    headerBlue: {
      main: "#1976d2",
    },
  },
});

const initialApplicants = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Applicant ${i + 1}`,
  passportImage: `https://images.unsplash.com/photo-15${5000 + i}`,
  nationalIdImage: `https://images.unsplash.com/photo-15${6000 + i}`,
  nationalId: `ID${i + 1}`,
  phoneNumber: `+12345678${(i + 1).toString().padStart(2, "0")}`,
  status: "waiting for confirmation",
}));

const drawerWidthLeft = 200;
const drawerWidthRight = 300;

// Helper function to get value from localStorage or return a default
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
  const [applicants, setApplicants] = useState(initialApplicants);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(true);
  const [mode, setMode] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  // Initialize state from localStorage or use default values
  const [page, setPage] = useState(() => getStoredValue("tablePage", 0));
  const [rowsPerPage, setRowsPerPage] = useState(() =>
    getStoredValue("tableRowsPerPage", 10)
  );

  // Use useEffect to save state to localStorage whenever it changes
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
              message: `${newApplicant.name}'s application was ${newStatus}.`,
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentTheme = mode === "dark" ? darkTheme : lightTheme;

  const filteredApplicants = applicants.filter((applicant) =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            bgcolor: currentTheme.palette.headerBlue.main,
            zIndex: 1300,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="toggle left drawer"
              onClick={toggleLeftDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              {leftDrawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
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
                <SearchIcon />
              </Box>
              <InputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={handleSearch}
                sx={{
                  color: "inherit",
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
              >
                {mode === "dark" ? <Brightness2Icon /> : <WbSunnyIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                aria-label="show notifications"
                onClick={toggleRightDrawer}
              >
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="About this page">
              <IconButton
                color="inherit"
                aria-label="about"
                onClick={handleAboutOpen}
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
                  <AccountCircleIcon sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6">User Name</Typography>
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
              <Typography variant="h5" gutterBottom>
                Welcome!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This page displays a list of loan applicants awaiting your
                review.
              </Typography>
            </Box>

            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Loan Applicants
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="loan applicants table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Phone Number</TableCell>
                    <TableCell align="right">National ID</TableCell>
                    <TableCell align="center">Passport Image</TableCell>
                    <TableCell align="center">National ID Image</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApplicants
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell component="th" scope="row">
                          {applicant.name}
                        </TableCell>
                        <TableCell align="right">
                          {applicant.phoneNumber}
                        </TableCell>
                        <TableCell align="right">
                          {applicant.nationalId}
                        </TableCell>
                        <TableCell align="center">
                          <CardMedia
                            component="img"
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: "50%",
                              mx: "auto",
                            }}
                            image={applicant.passportImage}
                            alt={`${applicant.name} Passport`}
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
                            }}
                            image={applicant.nationalIdImage}
                            alt={`${applicant.name} National ID`}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            sx={{
                              color:
                                applicant.status === "accepted"
                                  ? "green"
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
                                  handleStatusUpdate(applicant.id, "accepted")
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
                                  handleStatusUpdate(applicant.id, "rejected")
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
                <Typography variant="h6" gutterBottom>
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
                      }}
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
      </Box>
    </ThemeProvider>
  );
};

export default DashboardPage;
