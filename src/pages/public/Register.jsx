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
  Container,
  Avatar,
  Chip,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  EventAvailable,
} from "@mui/icons-material";
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
    location: "",
    accountGroupId: null,
    account_type_id: [],
  });

  const [formErrors, setFormErrors] = useState({});
  
  const [accountGroups, setAccountGroups] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [locations, setLocations] = useState([]);
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
      "location",
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
        location: formData.location,
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

    const fetchLocation = async () => {
      try {
        const res = await UseMethod("get", "get-church-locations");
        if (res?.data) setLocations(res.data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchAccountGroups();
    fetchLocation();
  }, []);

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

        }}
      >
        <Container maxWidth="xl" sx={{ height: "90h", display: "flex", alignItems: "center", py: 4 }}>
          <Grid container spacing={5} sx={{ height: "100%", alignItems: "" }}>
            {/* Left Side - Welcome Content */}
            <Grid size={{ md: 6 }} item xs={12} md={6} sx={{ pr: { md: 8 }, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
              <Box sx={{ textAlign: "center", color: "white", pt: 4 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mb: 3,
                    mx: "auto",
                    background: "linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
                    backdropFilter: "blur(10px)",
                    border: "2px solid rgba(255,255,255,0.3)",
                    animation: "gradientRotate 8s linear infinite",
                  }}
                >
                  <PersonAddIcon sx={{ fontSize: 40, color: "white" }} />
                </Avatar>

                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    background: "linear-gradient(45deg, #ffffff, #f0f8ff, #e6f3ff)",
                    backgroundSize: "200% 200%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    animation: "textGradient 3s ease infinite",
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                  }}
                >
                  Join UCCP
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    lineHeight: 1.6,
                  }}
                >
                  Create your account and become part of our community
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 5, justifyContent: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <EventAvailable sx={{ fontSize: 24, opacity: 0.8 }} />
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>Manage your Events</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <GroupIcon sx={{ fontSize: 24, opacity: 0.8 }} />
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>Connect with community members</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <SecurityIcon sx={{ fontSize: 24, opacity: 0.8 }} />
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>Secure and verified accounts</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                  <Chip label="Event Portal" variant="outlined" sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }} />
                  <Chip label="Church Activities" variant="outlined" sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }} />
                  <Chip label="Building Faith" variant="outlined" sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }} />
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Registration Form */}
            <Grid size={{ md: 6 }} item xs={12} md={6} sx={{ pl: { md: 8 } }}>
              <Card
                sx={{
                  maxWidth: 850,

                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                  position: "relative",
                  overflow: "hidden",

                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                  <Box textAlign="center" mb={1}>


                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        mb: 1,
                        background: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
                        backgroundSize: "200% 200%",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        animation: "textGradient 3s ease infinite",
                      }}
                    >
                      Create Account
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary" sx={{ opacity: 0.8 }}>
                      Join our community and get started
                    </Typography>
                  </Box>

                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={1}>
                      {/* Name Fields */}
                      <Grid size={{ md: 6, sm: 12 }} item xs={12} sm={6}>
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
                      <Grid size={{ md: 6, sm: 12 }} item xs={12} sm={6}>
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
                      <Grid size={{ md: 6, sm: 12 }} item xs={12} sm={6}>
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
                      <Grid size={{ md: 6, sm: 12 }} item xs={12} sm={6}>
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
                      <Grid size={{ md: 6, sm: 12 }} item xs={12} sm={6}>
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
                      <Grid size={{ md: 6, sm: 12 }} item xs={12} sm={6}>
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
                      <Grid size={{ md: 6, sm: 12 }} item xs={12} sm={6}>
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
                      <Grid size={{ md: 6, sm: 12 }} item xs={12} sm={6}>
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

                      {/* Location & Group */}
                      <Grid size={{ md: 6, sm: 12 }} item xs={12} sm={6}>
                        <TextField
                          select
                          label="Location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          fullWidth
                          size="small"
                          required
                          error={!!formErrors.location}
                          helperText={formErrors.location}
                          sx={inputStyle}
                        >
                          {locations.map((location) => (
                            <MenuItem key={location.id} value={location.id}>
                              {location.slug}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={{ md: 6, sm: 12 }} item xs={12} sm={6}>
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
                      <Grid size={{ md: 12, sm: 12 }} item xs={12}>
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
                      <Grid size={{ md: 12, sm: 12 }} item xs={12} mt={3}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          sx={{
                            py: 1,
                            borderRadius: "16px",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            textTransform: "none",
                            background: "linear-gradient(45deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                            backgroundSize: "200% 200%",
                            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                            position: "relative",
                            overflow: "hidden",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: "-100%",
                              width: "100%",
                              height: "100%",
                              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                              transition: "left 0.5s",
                            },
                            "&:hover": {
                              backgroundPosition: "100% 0",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 35px rgba(102, 126, 234, 0.5)",
                              "&::before": {
                                left: "100%",
                              },
                            },
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          Request New Account
                        </Button>
                      </Grid>

                      {/* Login Link */}
                      <Grid size={{ md: 12, sm: 12 }} item xs={12} mt={3}>
                        <Box
                          sx={{
                            textAlign: "center",
                            borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                            pt: 3,
                          }}
                        >
                          <Button
                            component={Link}
                            to="/"
                            variant="text"
                            sx={{
                              borderRadius: "12px",
                              py: 1,
                              px: 4,
                              fontWeight: 600,
                              fontSize: "0.95rem",
                              textTransform: "none",
                              color: "#667eea",
                              position: "relative",
                              overflow: "hidden",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: "linear-gradient(45deg, #667eea, #764ba2)",
                                opacity: 0,
                                transition: "opacity 0.3s ease",
                              },
                              "&:hover": {
                                color: "white",
                                "&::before": {
                                  opacity: 1,
                                },
                              },
                              "& .MuiButton-label": {
                                position: "relative",
                                zIndex: 1,
                              },
                            }}
                          >
                            <span style={{ position: "relative", zIndex: 1 }}>
                              Already have an account? Sign In
                            </span>
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

// Enhanced modern input styles
const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    "&:hover": {
      borderColor: "#667eea",
    },
    "&.Mui-focused": {
      borderColor: "#667eea",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#667eea",
    },
  },
};