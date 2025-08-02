import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  Grid,
  Autocomplete
} from "@mui/material";
import { UseMethod } from "../../composables/UseMethod";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "../../component/TopBar";
import { useState, useEffect } from "react";
import { useSnackbar } from "../../component/event/SnackbarProvider ";

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
    role: "",
    accountGroupId: null,
    account_type_id: [],
  });
 const { showSnackbar } = useSnackbar();
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [accountGroups, setAccountGroups] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  useEffect(() => {
    const fetchAccountGroups = async () => {
      const res = await UseMethod("get", "account-groups");
      if (res?.data) setAccountGroups(res.data);
    };
     const fetchRoles = async () => {
          try {
            const response = await UseMethod('get', 'get-roles') // Adjust URL if needed
            setRoles(response.data);
          } catch (error) {
            console.error("Failed to fetch roles:", error);
          }
        };
    

    fetchAccountGroups();
    fetchRoles();
  }, []);

  const handleCategoryChange = async (event, value) => {
    if (!value?.id) return;
    setFormData((prev) => ({
      ...prev,
      accountGroupId: value.id,
    }));
    const res = await UseMethod("get", `account-types/${value.id}`);
    setAccountTypes(res?.data || []);
  };

  const validateFields = () => {
    const errors = {};
    for (const [key, value] of Object.entries(formData)) {
      if (
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0) ||
        value === null
      ) {
        errors[key] = "This field is required";
      }
    }
    if (formData.password !== formData.confirmPassword) {
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

      if (res && res.status === 201) {
       showSnackbar({
        message: "Registration request submitted successfully! Please wait for approval.",  
        type: "success",
      }); 
      navigate("/");
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
      <Box display="flex" justifyContent="right" alignItems="center" minHeight="90vh" px={2}>
        <Card sx={{ width: "100%", maxWidth: 550, p: 5, boxShadow: 5, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
              Request New Account
            </Typography>

            <Box component="form" onSubmit={handleSubmit} mt={3}>
              <Grid container spacing={2}>
                {/* Names */}
                <Grid size={{md:6}} item xs={12} md={6}>
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
                <Grid size={{md:6}} item xs={12} md={6}>
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
                <Grid size={{md:6}} item xs={12} md={6}>
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
                <Grid size={{md:6}} item xs={12} md={6}>
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
                    <MenuItem value="1">Male</MenuItem>
                    <MenuItem value="2">Female</MenuItem>
                  </TextField>
                </Grid>

                {/* Username & Email */}
                <Grid size={{md:6}} item xs={12} md={6}>
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
                <Grid size={{md:6}} item xs={12} md={6}>
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

                {/* Password */}
                <Grid size={{md:6}} item xs={12} md={6}>
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
                <Grid size={{md:6}} item xs={12} md={6}>
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

                {/* Role */}
                <Grid size={{md:6}} item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Role"
                    name="role"
                    size="small"
                    value={formData.role}
                    onChange={handleChange}
                    error={!!formErrors.role}
                    helperText={formErrors.role}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.slug}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Account Group */}
                <Grid size={{md:6}} item xs={12} md={12}>
                  <Autocomplete
                    options={accountGroups}
                    getOptionLabel={(option) => option.description}
                    value={accountGroups.find((g) => g.id === formData.accountGroupId) || null}
                    onChange={handleCategoryChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Account Group"
                        size="small"
                        fullWidth
                        error={!!formErrors.accountGroupId}
                        helperText={formErrors.accountGroupId}
                      />
                    )}
                  />
                </Grid>

                {/* Account Types */}
                <Grid size={{md:12}} item xs={12}>
                  <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={accountTypes}
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
                            width: 20,
                            height: 20,
                            mr: 1,
                            border: '1px solid gray',
                            borderRadius: '4px',
                            backgroundColor: selected ? '#1976d2' : '#fff',
                          }}
                        />
                        {option.description}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Users (Account Types)"
                        size="small"
                        fullWidth
                        error={!!formErrors.account_type_id}
                        helperText={formErrors.account_type_id}
                      />
                    )}
                  />
                </Grid>

                {/* Submit */}
                <Grid size={{md:12}}  item xs={12}>
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
                    Request User
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" align="center" mt={2}>
                    Already have an account?{" "}
                    <Link to="/" style={{ color: "#1976d2", textDecoration: "none" }}>
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
};

export default Register;
