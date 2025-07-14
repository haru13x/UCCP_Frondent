import {
  Box,
  Avatar,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
    Grid,
} from "@mui/material";

import { useState, useEffect } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [userDetails, setUserDetails] = useState({});
  const [pastEvents, setPastEvents] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.details) {
      const fullData = { ...user.details, email: user.email };
      setUserDetails(fullData);
      setForm(fullData);
    }

    axios
      .get("/api/user-events/past", {
        headers: {
          Authorization: `Bearer ${user.api_token}`,
        },
      })
      .then((res) => setPastEvents(res.data))
      .catch((err) => console.error("Failed to fetch past events:", err));
  }, []);

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setUserDetails(form);
    handleEditClose();
  };

  return (
    <Box sx={{ bgcolor: "#e9eef6", minHeight: "100vh", p: 3 }}>
      {/* Header */}
      {/* Cover */}
      <Box
        sx={{
            mt:4,
          height: 200,
            background: "linear-gradient(to right,rgb(72, 137, 241),rgb(108, 134, 250), #6FB1FC)",

          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: -40,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 140,
              height: 140,
              border: "5px solid white",
              margin: "0 auto",
              background: "#ccc",
            }}
            src=""
          />
          <Typography variant="h5" mt={2} fontWeight="bold" color="white">
            {userDetails?.first_name} {userDetails?.last_name}
          </Typography>
          <Typography variant="body2" color="white">
            {userDetails?.email}
          </Typography>

          <Box mt={2} display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" color="secondary" onClick={handleEditOpen}>
              Edit Info
            </Button>
            <Button variant="outlined" color="inherit">
              Change Photo
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Tabs + Content */}
      <Box mt={12} maxWidth="960px" mx="auto" px={2}>
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="About" />
            <Tab label="Past Attending Events" />
          </Tabs>

          <Divider />

          {/* About Tab */}
          {tabIndex === 0 && (
            <Box p={3}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Personal Information
              </Typography>
              <Card elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                <Grid container spacing={3}>
                  <Grid item size={{ md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      First Name
                    </Typography>
                    <Typography>{userDetails?.first_name || "-"}</Typography>
                  </Grid>
                  <Grid item size={{ md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Name
                    </Typography>
                    <Typography>{userDetails?.last_name || "-"}</Typography>
                  </Grid>
                  <Grid item size={{ md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Middle Name
                    </Typography>
                    <Typography>{userDetails?.middle_name || "-"}</Typography>
                  </Grid>
                  <Grid item size={{ md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography>{userDetails?.email || "-"}</Typography>
                  </Grid>
                  <Grid item size={{ md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Mobile
                    </Typography>
                    <Typography>{userDetails?.mobile || "-"}</Typography>
                  </Grid>
                  <Grid item size={{ md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Birthdate
                    </Typography>
                    <Typography>{userDetails?.birthdate || "-"}</Typography>
                  </Grid>
                  <Grid item size={{ md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography>{userDetails?.address || "-"}</Typography>
                  </Grid>
                </Grid>
              </Card>
            </Box>
          )}

          {/* Past Events */}
          {tabIndex === 1 && (
            <Box p={3}>
              {pastEvents.length === 0 ? (
                <Typography>No past events attended.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {pastEvents.map((event) => (
                    <Grid item size={{ md: 6 }} key={event.id}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          boxShadow: 2,
                          bgcolor: "#f9f9f9",
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold">
                            {event.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {new Date(event.start_date).toLocaleDateString()} -{" "}
                            {new Date(event.end_date).toLocaleDateString()}
                          </Typography>
                          <Typography mt={1}>{event.description}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Personal Information</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {[
              { label: "First Name", key: "first_name" },
              { label: "Last Name", key: "last_name" },
              { label: "Middle Name", key: "middle_name" },
              { label: "Mobile", key: "mobile" },
              { label: "Email", key: "email" },
              { label: "Birthdate", key: "birthdate" },
              { label: "Address", key: "address" },
            ].map(({ label, key }) => (
              <Grid item size={{ md: 6 }} key={key}>
                <TextField
                  label={label}
                  fullWidth
                  value={form[key] || ""}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
