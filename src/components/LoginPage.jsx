import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Container,
  Paper,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { keyframes } from "@emotion/react";

const greenTheme = createTheme({
  palette: {
    primary: {
      main: "#4caf50", // Green primary color
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#81c784", // Light green secondary
      light: "#a5d6a7",
      dark: "#66bb6a",
      contrastText: "#ffffff",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
    },
    background: {
      default: "#f1f8e9", // Very light green background
      paper: "#ffffff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#4caf50",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#388e3c",
          },
          "&:disabled": {
            backgroundColor: "#a5d6a7",
            color: "#ffffff",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#4caf50",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#4caf50",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#4caf50",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#4caf50",
          "&.Mui-checked": {
            color: "#4caf50",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#388e3c",
          "&:hover": {
            color: "#2e7d32",
          },
        },
      },
    },
  },
});

// Define the animation keyframes
const checkmarkAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
`;

const flipInAnimation = keyframes`
  0% {
    transform: perspective(400px) rotateY(-90deg);
    opacity: 0;
  }
  40% {
    transform: perspective(400px) rotateY(-10deg);
  }
  70% {
    transform: perspective(400px) rotateY(10deg);
  }
  100% {
    transform: perspective(400px) rotateY(0deg);
    opacity: 1;
  }
`;

const slideInFromLeft = keyframes`
  0% {
    transform: translateX(-100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInFromRight = keyframes`
  0% {
    transform: translateX(100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeInUp = keyframes`
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.6), 0 0 30px rgba(76, 175, 80, 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
  }
`;

const LoginForm = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("+255");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSuccess, setDialogSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const BACKEND_URL = "http://192.168.100.142:8000";

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setPhoneError("");
    setPasswordError("");

    // --- Validation Logic ---
    let hasError = false;

    // Check if phone number is empty
    if (!phone) {
      setPhoneError("Phone number is required.");
      hasError = true;
    } else {
      // Validate phone number format: +255 and 13 digits total
      const phoneRegex = /^\+255\d{9}$/;
      if (!phoneRegex.test(phone)) {
        setPhoneError("Phone number is not correct.");
        hasError = true;
      }
    }

    // Check if password is empty
    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      // Make a POST request to your backend
      const response = await fetch(`${BACKEND_URL}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- Store both access and refresh tokens in local storage ---
        const { access, refresh } = data;
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);

        setDialogMessage("Login successful!");
        setDialogSuccess(true);
        setDialogOpen(true);

        // Navigate to the dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        // Handle unsuccessful login
        setDialogMessage(
          data.detail || "Login failed. Please check your credentials."
        );
        setDialogSuccess(false);
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setDialogMessage(
        "An error occurred during login. Please try again later."
      );
      setDialogSuccess(false);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogMessage("");
    setDialogSuccess(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={greenTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 50%, #ffffff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Paper
            elevation={12}
            sx={{
              marginTop: 8,
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 2,
              boxShadow: "0 8px 16px rgba(76, 175, 80, 0.3)",
              border: "1px solid rgba(76, 175, 80, 0.1)",
              background: "linear-gradient(145deg, #ffffff 0%, #f9fffe 100%)",
              animation: `${flipInAnimation} 1s ease-out`,
              "&:hover": {
                animation: `${pulseGlow} 2s infinite`,
              },
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{
                color: "#2e7d32",
                fontWeight: "bold",
                marginBottom: 2,
                textAlign: "center",
                animation: `${slideInFromLeft} 0.8s ease-out 0.3s both`,
              }}
            >
              Sign In
            </Typography>
            <Box
              component="form"
              onSubmit={handleLogin}
              noValidate
              sx={{
                mt: 1,
                width: "100%",
                position: "relative",
                animation: `${fadeInUp} 0.8s ease-out 0.5s both`,
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                placeholder="+255 Enter your phone number"
                id="phone-number"
                label="Phone Number (Tanzania)"
                name="phone"
                autoComplete="tel"
                autoFocus
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  // Ensure +255 prefix is always maintained
                  if (value.startsWith("+255")) {
                    setPhone(value);
                  } else if (value.length < 4) {
                    setPhone("+255");
                  }
                }}
                error={!!phoneError}
                helperText={
                  phoneError ||
                  "Tanzania country code (+255) is automatically included"
                }
                sx={{
                  animation: `${slideInFromLeft} 0.6s ease-out 0.7s both`,
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#4caf50",
                            fontWeight: "bold",
                            userSelect: "none",
                          }}
                        >
                          🇹🇿
                        </Typography>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                sx={{
                  animation: `${slideInFromRight} 0.6s ease-out 0.9s both`,
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{ color: "#4caf50" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Remember me"
                sx={{
                  animation: `${fadeInUp} 0.6s ease-out 1.1s both`,
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  animation: `${fadeInUp} 0.6s ease-out 1.3s both`,
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "transform 0.2s ease-in-out",
                  },
                }}
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  animation: `${fadeInUp} 0.6s ease-out 1.5s both`,
                }}
              >
                <Link
                  href="#"
                  variant="body2"
                  sx={{
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.2s ease-in-out",
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        slotProps={{
          paper: {
            sx: {
              animation: dialogOpen
                ? `${flipInAnimation} 0.6s ease-out`
                : "none",
              borderRadius: 3,
              border: "2px solid rgba(76, 175, 80, 0.2)",
            },
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {dialogSuccess && (
            <CheckCircleOutlineIcon
              sx={{
                color: "success.main",
                fontSize: 32,
                animation: `${checkmarkAnimation} 0.5s ease-out`,
              }}
            />
          )}
          {"Login Status"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            autoFocus
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": {
                backgroundColor: "#388e3c",
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default LoginForm;
