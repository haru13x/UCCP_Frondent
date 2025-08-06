    // src/pages/ForgotPassword.jsx
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../component/TopBar";
import { UseMethod } from "../../composables/UseMethod";
import { useSnackbar } from "../../component/event/SnackbarProvider ";

export default function ForgotPassword() {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Set new password

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await UseMethod("post", "forgot-password", { email });

      if (res.status === 200) {
        showSnackbar({ message: res.data.message, type: "success" });
        setStep(2);
      } else {
        showSnackbar({ message: res.data.message || "Failed to send OTP", type: "error" });
      }
    } catch (err) {
      showSnackbar({ message: "Error: " + (err.response?.data?.message || err.message), type: "error" });
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await UseMethod("post", "verify-otp", { email, otp });

      if (res.status === 200) {
        showSnackbar({ message: "OTP verified! Set new password.", type: "success" });
        setStep(3);
      } else {
        showSnackbar({ message: res.data.message || "Invalid OTP", type: "error" });
      }
    } catch (err) {
      showSnackbar({ message: "Verification failed", type: "error" });
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showSnackbar({ message: "Password must be at least 6 characters", type: "error" });
      return;
    }

    try {
      const res = await UseMethod("post", "reset-password", { email, otp, new_password: newPassword });

      if (res.status === 200) {
        showSnackbar({ message: "Password reset successful!", type: "success" });
        navigate("/");
      } else {
        showSnackbar({ message: res.data.message || "Failed to reset password", type: "error" });
      }
    } catch (err) {
      showSnackbar({ message: "Error resetting password", type: "error" });
    }
  };

  return (
    <>
      <TopBar />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="85vh"
        sx={{
          backgroundImage: `url('/login1.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: 2,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 4,
            boxShadow: 5,
            padding: 3,
            background: "linear-gradient(to bottom right, #e3f2fd, #ffffff)",
          }}
        >
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom fontWeight="bold" color="#1976d2">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Enter OTP"}
              {step === 3 && "Set New Password"}
            </Typography>

            {step === 1 && (
              <Box component="form" onSubmit={handleSendOtp} mt={2}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: "#1976d2" }}>
                  Send OTP
                </Button>
                <Box mt={2} textAlign="center">
                  <Link to="/" style={{ fontSize: 14, color: "#1976d2" }}>
                    Back to Login
                  </Link>
                </Box>
              </Box>
            )}

            {step === 2 && (
              <Box component="form" onSubmit={handleVerifyOtp} mt={2}>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Enter the 6-digit OTP sent to {email}
                </Typography>
                <TextField
                  label="OTP"
                  type="text"
                  inputProps={{ maxLength: 6 }}
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  required
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: "#1976d2" }}>
                  Verify OTP
                </Button>
                <Box mt={2} textAlign="center">
                  <Link to="#" onClick={handleSendOtp} style={{ fontSize: 14, color: "#1976d2" }}>
                    Resend OTP
                  </Link>
                </Box>
              </Box>
            )}

            {step === 3 && (
              <Box component="form" onSubmit={handleResetPassword} mt={2}>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: "#1976d2" }}>
                  Reset Password
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}