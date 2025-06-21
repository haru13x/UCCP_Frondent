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
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChurchIcon from "@mui/icons-material/Church";
import TopBar from "../component/TopBar";
import { UseMethod } from "../composables/UseMethod";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        email,
        password,
      };

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

        navigate("/dashboard");
      } else {
        alert("Invalid login credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please try again.");
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
            background: "linear-gradient(to bottom right,rgb(222, 239, 250),rgb(255, 255, 255))",
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar sx={{ bgcolor: "#64b5f6", width: 56, height: 56, mb: 1 }}>
              <ChurchIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
              UCCP Event Management
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "#555" }}>
              Login to manage events and services
            </Typography>
          </Box>

          <CardContent>
            <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={handleLogin}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <FormControlLabel
                  control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
                  label="Remember me"
                />
                <Link to="/forgot-password" style={{ fontSize: 14, color: "#1976d2", textDecoration: "none" }}>
                  Forgot Password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  bgcolor: "#64b5f6",
                  "&:hover": { bgcolor: "#42a5f5" },
                }}
              >
                Login
              </Button>
            </Box>

            <Typography variant="body2" align="center" mt={3}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#1976d2", textDecoration: "none" }}>
                Register
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Login;
