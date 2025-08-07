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

const defaultTheme = createTheme();

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

const LoginForm = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
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
    <ThemeProvider theme={defaultTheme}>
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
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1, width: "100%", position: "relative" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              placeholder="+255..."
              id="phone-number"
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!!phoneError}
              helperText={phoneError}
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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
          <Button onClick={handleCloseDialog} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default LoginForm;
