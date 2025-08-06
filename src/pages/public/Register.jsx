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
  Autocomplete,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "../../component/TopBar";
import { useState, useEffect } from "react";
import { UseMethod } from "../../composables/UseMethod";
import { useSnackbar } from "../../component/event/SnackbarProvider ";
export default function Register() {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    gender: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    accountGroupId: null,
    account_type_id: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [accountGroups, setAccountGroups] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategoryChange = async (event, value) => {
    if (!value?.id) return;
    setFormData((prev) => ({ ...prev, accountGroupId: value.id }));
    try {
      const res = await UseMethod("get", `account-types/${value.id}`);
      setAccountTypes(res?.data || []);
    } catch (error) {
      console.error("Failed to load account types:", error);
    }
  };

  const validateFields = () => {
    const errors = {};
    const requiredFields = [
      "lastName",
      "firstName",
      "gender",
      "username",
      "email",
      "password",
      "confirmPassword",
      "role",
      "accountGroupId",
    ];

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (!value || (typeof value === "string" && !value.trim())) {
        errors[field] = "Required";
      }
    });

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (formData.account_type_id.length === 0) {
      errors.account_type_id = "At least one type is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const payload = {
        is_request: 1,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: formData.middleName,
        gender: formData.gender,
        role: formData.role,
        account_group_id: formData.accountGroupId,
        account_type_id: formData.account_type_id,
      };

      const res = await UseMethod("post", "register", payload);

      if (res && (res.status === 200 || res.status === 201)) {
        showSnackbar({
          message: "Registration request submitted! Awaiting approval.",
          type: "success",
        });
        setTimeout(() => navigate("/"), 1500); // Redirect to home
      } else {
        showSnackbar({
          message: res?.data?.message || "Registration failed. Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      showSnackbar({
        message: "Something went wrong. Please check your connection.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const fetchAccountGroups = async () => {
      try {
        const res = await UseMethod("get", "account-groups");
        if (res?.data) setAccountGroups(res.data);
      } catch (error) {
        console.error("Failed to fetch account groups:", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await UseMethod("get", "get-roles");
        if (res?.data) setRoles(res.data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchAccountGroups();
    fetchRoles();
  }, []);

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

        {/* Form Card */}
        <Card
          sx={{
            width: "100%",
            maxWidth: 650,
            borderRadius: 4,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Box textAlign="center" mb={3}>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary"
                sx={{ letterSpacing: 1 }}
              >
                Join UCCP
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Request an account to get started
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Name Fields */}
                <Grid size={{md:6 , sm:12}} item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{md:6 , sm:12}} item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{md:6 , sm:12}} item xs={12} sm={6}>
                  <TextField
                    label="Middle Name (Optional)"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{md:6 , sm:12}} item xs={12} sm={6}>
                  <TextField
                    select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    error={!!formErrors.gender}
                    helperText={formErrors.gender}
                    sx={inputStyle}
                  >
                    <MenuItem value="1">Male</MenuItem>
                    <MenuItem value="2">Female</MenuItem>
                  </TextField>
                </Grid>

                {/* Login Info */}
                <Grid size={{md:6 , sm:12}} item xs={12} sm={6}>
                  <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    error={!!formErrors.username}
                    helperText={formErrors.username}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{md:6 , sm:12}} item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{md:6 , sm:12}} item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{md:6 , sm:12}} item xs={12} sm={6}>
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    sx={inputStyle}
                  />
                </Grid>

                {/* Role & Group */}
                <Grid size={{md:6 , sm:12}} item xs={12} sm={6}>
                  <TextField
                    select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    error={!!formErrors.role}
                    helperText={formErrors.role}
                    sx={inputStyle}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.slug}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{md:6 , sm:12}} item xs={12} sm={6}>
                  <Autocomplete
                    options={accountGroups}
                    getOptionLabel={(option) => option.description}
                    value={
                      accountGroups.find((g) => g.id === formData.accountGroupId) || null
                    }
                    onChange={handleCategoryChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Account Group"
                        size="small"
                        required
                        error={!!formErrors.accountGroupId}
                        helperText={formErrors.accountGroupId}
                        sx={inputStyle}
                      />
                    )}
                  />
                </Grid>

                {/* Account Types */}
                <Grid size={{md:12 , sm:12}} item xs={12}>
                  <Autocomplete
                    multiple
                    options={accountTypes}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.description}
                    value={accountTypes.filter((type) =>
                      formData.account_type_id.includes(type.id)
                    )}
                    onChange={(e, values) =>
                      setFormData({
                        ...formData,
                        account_type_id: values.map((v) => v.id),
                      })
                    }
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Box
                          component="span"
                          sx={{
                            width: 18,
                            height: 18,
                            mr: 1,
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: selected ? "#1976d2" : "#fff",
                          }}
                        />
                        {option.description}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Account Types"
                        size="small"

                        error={!!formErrors.account_type_id}
                        helperText={formErrors.account_type_id}
                        sx={inputStyle}
                      />
                    )}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid size={{md:12 , sm:12}} item xs={12} mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
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
                    Request Account
                  </Button>
                </Grid>

                {/* Login Link */}
                <Grid size={{md:12 , sm:12}} item xs={12} textAlign="center" mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{" "}
                    <Link
                      to="/"
                      style={{
                        color: "#1976d2",
                        fontWeight: 500,
                        textDecoration: "none",
                      }}
                    >
                      Login here
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
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