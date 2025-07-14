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
import { Link, useNavigate } from "react-router-dom";
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

  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validateFields = () => {
    const errors = {};
    for (const [key, value] of Object.entries(formData)) {
      if (!value || value === "") {
        errors[key] = "This field is required";
      }
    }

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: formData.middleName,
        gender: formData.gender,
      };

      const res = await UseMethod("post", "register", payload);

      if (res && res.status === 201) {
        const { api_token, user } = res.data;
        localStorage.setItem("api_token", api_token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/list");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <>
      <TopBar />
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="85vh" px={2}>
        <Card sx={{ width: "100%", maxWidth: 650, p: 3, boxShadow: 5, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
              Create New Account
            </Typography>

            <Box component="form" onSubmit={handleSubmit} mt={3}>
              <Grid container spacing={2}>
                {/* Last, First, Middle Name */}
                <Grid item xs={12} size={{ md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                  />
                </Grid>
                <Grid item xs={12} size={{ md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                  />
                </Grid>
                <Grid item xs={12} size={{ md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Middle Name"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    error={!!formErrors.middleName}
                    helperText={formErrors.middleName}
                  />
                </Grid>

                {/* Gender */}
                <Grid item xs={12} size={{ md: 6 }}>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    error={!!formErrors.gender}
                    helperText={formErrors.gender}
                  >
                    <MenuItem value={1}>Male</MenuItem>
                    <MenuItem value={2}>Female</MenuItem>
                  </TextField>
                </Grid>

                {/* Username & Email */}
                <Grid item xs={12} size={{ md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!formErrors.username}
                    helperText={formErrors.username}
                  />
                </Grid>
                <Grid item xs={12} size={{ md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                  />
                </Grid>

                {/* Password & Confirm */}
                <Grid item xs={12} size={{ md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                  />
                </Grid>
                <Grid item xs={12} size={{ md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontWeight: "bold",
                      fontSize: "16px",
                      backgroundColor: "#1565c0",
                      "&:hover": {
                        backgroundColor: "#0d47a1",
                      },
                    }}
                  >
                    Register
                  </Button>
                </Grid>
              </Grid>

              <Typography variant="body2" align="center" mt={3}>
                Already have an account?{" "}
                <Link to="/" style={{ color: "#1976d2", textDecoration: "none" }}>
                  Login here
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
