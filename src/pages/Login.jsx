// src/pages/Login.jsx
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChurchIcon from "@mui/icons-material/Church"; // or use your logo
import TopBar from "../component/TopBar";
const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <> <TopBar />
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
          <Box component="form" display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField label="Password" type="password" fullWidth />
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
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
