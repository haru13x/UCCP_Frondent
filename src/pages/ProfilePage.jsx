import {
  Box,
  Avatar,
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [form, setForm] = useState({});

  // Load user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.details) {
      const fullData = { ...user.details, email: user.email };
      setUserDetails(fullData);
      setForm(fullData);
    }
  }, []);

  const handleEditToggle = () => {
    if (editMode) {
      setForm(userDetails); // Reset form when cancel
    }
    setEditMode((prev) => !prev);
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setUserDetails(form);
    setEditMode(false);
    // Optionally update localStorage or send API request here
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    localStorage.setItem(
      "user",
      JSON.stringify({ ...storedUser, details: form })
    );
  };

  return (
    <Box
      sx={{
        bgcolor: "#f4f6f8",
        minHeight: "100vh",
        py: 2,
        px: { xs: 2, sm: 3, md: 6 },
        fontFamily: "'Poppins', 'Roboto', sans-serif",
      }}
    >
      {/* Header / Cover Section */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          height: { xs: 180, sm: 250 },
          background: "linear-gradient(135deg, #5C6BC0, #7986CB)",
          borderRadius: "16px",
          mb: 1,
          overflow: "hidden",
        }}
      >
        {/* Decorative Circle */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 20,
            borderRadius: "50%",
            bgcolor: "rgba(255, 255, 255, 0.1)",
          }}
        />

        {/* Avatar & User Info */}
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            width: "100%",
          }}
        >
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              src=""
              alt="User"
              sx={{
                width: 150,
                height: 130,
                border: "5px solid white",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                bgcolor: "#fff",
                color: "#5C6BC0",
                fontSize: "48px",
                fontWeight: "bold",
              }}
            >
              {userDetails.first_name?.charAt(0)?.toUpperCase() ||
                userDetails.last_name?.charAt(0)?.toUpperCase() ||
                "U"}
            </Avatar>
            {/* Avatar Edit Icon */}
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                bottom: 4,
                right: 4,
                bgcolor: "secondary.main",
                color: "white",
                "&:hover": { bgcolor: "secondary.dark" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography
            variant="h5"
            fontWeight="600"
            color="white"
            mt={2}
            sx={{ textShadow: "1px 1px 6px rgba(0,0,0,0.3)" }}
          >
            {userDetails.first_name} {userDetails.last_name}
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.9)">
            {userDetails.email}
          </Typography>

          
        </Box>
      </Paper>

      {/* Profile Card */}
      <Box maxWidth="1200px" mx="auto" mt={2 }>
        <Card
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            bgcolor: "white",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              py: 2,
              px: 4,
              display: "flex",
              justifyContent:'space-between',
              alignItems: "center",
              gap: 1,
            }}
          >
           
            <Typography variant="h6" fontWeight="600">
              <EditIcon fontSize="small" /> Personal Information
            </Typography>
            <Button
            variant="contained"
            color={editMode ? "error" : "secondary"}
            startIcon={editMode ? <CloseIcon /> : <EditIcon />}
            onClick={handleEditToggle}
            size="small"
            sx={{
             
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: 500,
              px: 3,
            }}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </Button>
          </Box>

          <Box p={4}>
            <Grid container spacing={3}>
              {[
                { label: "First Name", key: "first_name", md: 6 },
                { label: "Last Name", key: "last_name", md: 6 },
                { label: "Middle Name", key: "middle_name", md: 6 },
                { label: "Email Address", key: "email", md: 6 },
                { label: "Phone Number", key: "mobile", md: 6 },
                { label: "Date of Birth", key: "birthdate", md: 6 },
                { label: "Address", key: "address", md: 12 },
              ].map(({ label, key, md }) => (
                <Grid  size={{md:4, xs:12}} item xs={12} md={md} key={key}>
                  <Typography
                    variant="body2"
                    fontWeight="500"
                    color="textSecondary"
                    mb={1}
                  >
                    {label}
                  </Typography>

                  {editMode ? (
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={form[key] || ""}
                      onChange={(e) =>
                        handleInputChange(key, e.target.value)
                      }
                      InputProps={{
                        sx: {
                          borderRadius: "8px",
                          bgcolor: "#f8f9ff",
                          "&:hover": { bgcolor: "#f0f3ff" },
                        },
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        minHeight: 40,
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        py: 1,
                        borderRadius: "8px",
                        border: "1px solid #e0e4eb",
                        bgcolor: "#fbfcff",
                        fontSize: "0.95rem",
                        color: "#2d3748",
                      }}
                    >
                      {userDetails[key] || (
                        <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                        >
                          Not provided
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>

            {editMode && (
              <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CloseIcon />}
                  onClick={handleEditToggle}
                  sx={{ borderRadius: "8px", px: 3 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{
                    borderRadius: "8px",
                    px: 4,
                    fontWeight: 600,
                    boxShadow: "0 4px 10px rgba(92, 107, 192, 0.3)",
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default ProfilePage;
