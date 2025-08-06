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
  Fade,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

const defaultTheme = createTheme();

const LoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInitialLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Simulate API call to send OTP
      console.log("Sending OTP to:", phoneNumber);
      // Replace with your actual API call
      // const response = await fetch('/api/login-with-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber, password }),
      // });
      // if (!response.ok) throw new Error('Login failed');

      // Simulate a successful response
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsOtpSent(true);
      alert("OTP sent to your phone!");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
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
      // Replace with your actual API call
      // const response = await fetch('/api/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber, otp }),
      // });
      // if (!response.ok) throw new Error('OTP verification failed');

      // Simulate a successful response
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("OTP verified successfully! You are now logged in.");
      // Redirect or store authentication token here
    } catch (error) {
      console.error("OTP error:", error);
      alert("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
            sx={{ mt: 1, width: "100%" }}
          >
            <Fade in={!isOtpSent} timeout={500} unmountOnExit>
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
            </Fade>

            <Fade in={isOtpSent} timeout={500} unmountOnExit>
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
            </Fade>

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
    </ThemeProvider>
  );
};

export default LoginForm;
