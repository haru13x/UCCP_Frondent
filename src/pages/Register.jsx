// src/pages/Register.jsx
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import TopBar from "../component/TopBar";

const Register = () => {
  return (
    <>
    <TopBar />
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      px={2}
    >
      <Card sx={{ width: '100%', maxWidth: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Register
          </Typography>
          <Box component="form" display="flex" flexDirection="column" gap={2}>
            <TextField label="Username" fullWidth />
            <TextField label="Email" type="email" fullWidth />
            <TextField label="Password" type="password" fullWidth />
            <Button variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </Box>
          <Typography variant="body2" align="center" mt={2}>
            Already have an account?{" "}
            <Link to="/" style={{ color: "#1976d2", textDecoration: "none" }}>
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
    </>
  );
};

export default Register;
