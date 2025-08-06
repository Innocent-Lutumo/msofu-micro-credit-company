import React, { useState } from "react";
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
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // Import the icon
import { keyframes } from "@emotion/react"; // For keyframe animation

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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSuccess, setDialogSuccess] = useState(false); // To track if the message is a success

  const handleInitialLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Simulate API call to send OTP
      console.log("Sending OTP to:", phoneNumber);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsOtpSent(true);
      setDialogMessage("OTP sent to your phone!");
      setDialogSuccess(true); // Set to true for a successful message
      setDialogOpen(true);
    } catch (error) {
      console.error("Login error:", error);
      setDialogMessage("Login failed. Please check your credentials.");
      setDialogSuccess(false); // Set to false for an error message
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Simulate API call to verify OTP
      console.log("Verifying OTP:", otp);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setDialogMessage("OTP verified successfully! You are now logged in.");
      setDialogSuccess(true);
      setDialogOpen(true);
    } catch (error) {
      console.error("OTP error:", error);
      setDialogMessage("OTP verification failed. Please try again.");
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
            onSubmit={isOtpSent ? handleOtpVerification : handleInitialLogin}
            noValidate
            sx={{ mt: 1, width: "100%", position: "relative" }}
          >
            {!isOtpSent ? (
              <Box>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="phone-number"
                  label="Phone Number"
                  name="phoneNumber"
                  autoComplete="tel"
                  autoFocus
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  {loading ? "Sending OTP..." : "Sign In"}
                </Button>
              </Box>
            ) : (
              <Box>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="otp"
                  label="OTP"
                  name="otp"
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  inputProps={{ maxLength: 6 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </Box>
            )}

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
