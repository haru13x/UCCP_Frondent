// src/pages/Login.jsx
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChurchIcon from "@mui/icons-material/Church";
import TopBar from "../../component/TopBar";
import { UseMethod } from "../../composables/UseMethod";
import { useSnackbar } from "../../component/event/SnackbarProvider ";
export default function Login() {
  const { showSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  // Load saved email if "remember me" was used
  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const payload = { email, password };
      const res = await UseMethod("post", "login", payload);

      if (res && res.status === 200) {
        const { api_token, user } = res.data;
        localStorage.setItem("api_token", api_token);
        localStorage.setItem("user", JSON.stringify(user));

        if (remember) {
          localStorage.setItem("remember_email", email);
        } else {
          localStorage.removeItem("remember_email");
        }

        showSnackbar({ message: "Login successful!", type: "success" });
        navigate("/list");
      } else {
        showSnackbar({
          message: res.data?.msg || "Invalid credentials.",
          type: "error",
        });
      }
    } catch (err) {
      showSnackbar({
        message: err.response?.data?.msg || "Login failed. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <>
      <TopBar />
      <Box
      sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f1f1f9ff, #e4f0f8ff, #666768ff)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 12s ease infinite",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
       
          position: "relative",
        }}
      >
           {/* Animated Background */}
        <style jsx>{`
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
        {/* Login Card */}
        <Card
          sx={{
            width: "100%",
            maxWidth: 440,
            borderRadius: 4,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            {/* Logo & Header */}
            <Box textAlign="center" mb={3}>
              <Avatar
                sx={{
                  bgcolor: "#1976d2",
                  width: 64,
                  height: 64,
                  mb: 1.5,
                  margin: "0 auto",
                  boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
                }}
              >
                <ChurchIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
                sx={{ letterSpacing: 0.5 }}
              >
                UCCP Event System
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Sign in to manage events and services
              </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleLogin}>
              <TextField
                label="Email Address"
                
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@uccp.org"
                sx={inputStyle}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ ...inputStyle, mt: 2 }}
                required
              />

              {/* Remember & Forgot */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={1.5}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Remember me
                    </Typography>
                  }
                />
                <Link to="/forgot-password" style={linkStyle}>
                  Forgot Password?
                </Link>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "16px",
                  background: "linear-gradient(45deg, #1976d2, #2196f3)",
                  boxShadow: "0 4px 15px rgba(33, 150, 243, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565c0, #1976d2)",
                    transform: "scale(1.02)",
                  },
                  transition: "all 0.2s ease",
                  borderRadius: 2,
                }}
              >
                Sign In
              </Button>

              {/* Register Link */}
              <Box textAlign="center" mt={3}>
                <Typography variant="body2" color="text.secondary">
                  Don’t have an account?{" "}
                  <Link to="/register" style={linkStyle}>
                    Request New Account
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

// Reusable input styles
const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    transition: "all 0.2s",
    "&:hover": {
      borderColor: "primary.main",
      boxShadow: "0 0 0 1px #1976d2",
    },
    "&.Mui-focused": {
      borderColor: "primary.main",
      boxShadow: "0 0 0 2px #1976d240",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    color: "text.secondary",
  },
};

// Consistent link style
const linkStyle = {
  color: "#1976d2",
  fontWeight: 500,
  textDecoration: "none",
  fontSize: "0.875rem",
};