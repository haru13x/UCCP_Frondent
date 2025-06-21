// src/pages/Register.jsx
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  Grid,
} from "@mui/material";

import { UseMethod } from "../composables/UseMethod";
import { Link } from "react-router-dom";
import TopBar from "../component/TopBar";
import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    gender: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword, // Make sure backend expects this
      first_name: formData.firstName,
      last_name: formData.lastName,
      middle_name: formData.middleName,
      gender: formData.gender,
    };

    const res = await UseMethod("post", "register", payload);

    if (res && res.status === 201) {
      const { api_token } = res.data;
      localStorage.setItem("api_token", api_token);
      alert("Registered Successfully!");
      console.log("Registered User:", res.data);
    } else {
    
    }
  } catch (err) {
    console.error("Registration error:", err);
   
  }
};


  return (
    <>
      <TopBar />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        px={2}
      >
        <Card sx={{ width: "100%", maxWidth: 600, p: 2 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Register
            </Typography>

            <Box component="form" onSubmit={handleSubmit} mt={2}>
              <Grid container spacing={2}>
                {/* Name Fields */}
                <Grid item size={{md:6}}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item size={{md:6}}>
                  <TextField
                    fullWidth
                    size="small"
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item size={{md:6}}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Middle Name"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item size={{md:6}}>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <MenuItem value={1}>Male</MenuItem>
                    <MenuItem value={2}>Female</MenuItem>
                  </TextField>
                </Grid>

                {/* Username & Email */}
                <Grid item size={{md:6}}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item size={{md:6}}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Passwords */}
                <Grid item size={{md:6}}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item size={{md:6}}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Submit */}
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Register
                  </Button>
                </Grid>
              </Grid>

              <Typography variant="body2" align="center" mt={2}>
                Already have an account?{" "}
                <Link to="/" style={{ color: "#1976d2", textDecoration: "none" }}>
                  Login
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Register;
