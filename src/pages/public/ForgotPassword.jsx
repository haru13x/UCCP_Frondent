// src/pages/ForgotPassword.jsx
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TopBar from "../../component/TopBar";
import { UseMethod } from "../../composables/UseMethod";
import { useSnackbar } from "../../component/event/SnackbarProvider ";

export default function ForgotPassword() {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
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
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          '&::before': {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, padding: 0 }}>
          <Grid container sx={{ minHeight: "95vh", alignItems: "center", justifyContent: "center" }}>
            <Grid item xs={12} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 3, md: 4 } }}>
              <Card
                elevation={0}
                sx={{
                  width: "100%",
                  maxWidth: 720,
                  borderRadius: 5,
                  background: "rgba(255, 255, 255, 0.98)",
                  backdropFilter: "blur(25px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.1) inset",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-3px) scale(1.01)",
                    boxShadow: "0 35px 70px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2) inset",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 4, sm: 6, md: 7 } }}>
                  <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Typography
                      component="h1"
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        letterSpacing: "0.02em",
                        background: "linear-gradient(45deg, #1a202c 30%, #2d3748 90%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {step === 1 && "Forgot Password"}
                      {step === 2 && "Verify OTP"}
                      {step === 3 && "Reset Password"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Secure account recovery in three simple steps
                    </Typography>
                  </Box>

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
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          py: 1,
                          borderRadius: 4,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
                          backgroundSize: "200% 200%",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          textTransform: "none",
                          letterSpacing: "0.02em",
                          boxShadow: "0 12px 24px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          overflow: "hidden",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "-100%",
                            width: "100%",
                            height: "50%",
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                            transition: "left 0.6s ease",
                          },
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 18px 36px rgba(102, 126, 234, 0.45)",
                            backgroundPosition: "right center",
                            "&::before": {
                              left: "100%",
                            },
                          },
                        }}
                      >
                        Send OTP
                      </Button>
                      <Box mt={2} textAlign="center">
                        <Link to="/" style={{ fontSize: 14, color: "#667eea", fontWeight: 600 }}>
                          Back to Login
                        </Link>
                      </Box>
                    </Box>
                  )}

                  {step === 2 && (
                    <Box component="form" onSubmit={handleVerifyOtp} mt={2}>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
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
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          py: 1,
                          borderRadius: 4,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
                          backgroundSize: "200% 200%",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          textTransform: "none",
                          letterSpacing: "0.02em",
                          boxShadow: "0 12px 24px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          overflow: "hidden",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "-100%",
                            width: "100%",
                            height: "50%",
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                            transition: "left 0.6s ease",
                          },
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 18px 36px rgba(102, 126, 234, 0.45)",
                            backgroundPosition: "right center",
                            "&::before": {
                              left: "100%",
                            },
                          },
                        }}
                      >
                        Verify OTP
                      </Button>
                      <Box mt={2} textAlign="center">
                        <Typography
                          variant="body2"
                          sx={{ color: "#667eea", cursor: "pointer", fontWeight: 600 }}
                          onClick={handleSendOtp}
                        >
                          Resend OTP
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {step === 3 && (
                    <Box component="form" onSubmit={handleResetPassword} mt={2}>
                      <TextField
                        label="New Password"
                        type={showNewPassword ? "text" : "password"}
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                onMouseDown={(e) => e.preventDefault()}
                                edge="end"
                              >
                                {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          py: 1,
                          borderRadius: 4,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
                          backgroundSize: "200% 200%",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          textTransform: "none",
                          letterSpacing: "0.02em",
                          boxShadow: "0 12px 24px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          overflow: "hidden",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "-100%",
                            width: "100%",
                            height: "50%",
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                            transition: "left 0.6s ease",
                          },
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 18px 36px rgba(102, 126, 234, 0.45)",
                            backgroundPosition: "right center",
                            "&::before": {
                              left: "100%",
                            },
                          },
                        }}
                      >
                        Reset Password
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}