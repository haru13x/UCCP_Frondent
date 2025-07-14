import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

  Typography,
  Grid,
  IconButton,

  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Divider,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { UseMethod } from "../../composables/UseMethod";
const genders = [
  { label: "Male", value: 1 },
  { label: "Female", value: 2 },
  { label: "Other", value: 3 },
];

const UserFormDialog = ({ open, onClose, onSave, formData, setFormData, isEdit }) => {
  const [roles, setRoles] = useState([]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await UseMethod('get', 'get-roles') // Adjust URL if needed
        setRoles(response.data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" maxHeight="full" fullWidth >
      <DialogTitle sx={{ backgroundColor: 'green', display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5 }}>
        <Typography variant="subtitle1">{isEdit ? "Edit User" : "User Registration"}</Typography>
        {/* <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton> */}
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ p: 2 }}>
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent sx={{ pb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Personal Info </Typography>
            <Grid container spacing={1}>

              <Grid size={{ md: 6 }}>
                <TextField label="First Name" size="small" value={formData.firstName || ""} onChange={handleChange("firstName")} fullWidth />
              </Grid>
              <Grid size={{ md: 6 }}>
                <TextField label="Middle Name" size="small" value={formData.middleName || ""} onChange={handleChange("middleName")} fullWidth />
              </Grid>
              <Grid size={{ md: 6 }}>
                <TextField label="Last Name" size="small" value={formData.lastName || ""} onChange={handleChange("lastName")} fullWidth />
              </Grid>
              <Grid size={{ md: 6 }} item xs={12} md={6}>
                <TextField
                  label="Birthdate"
                  type="date"
                  size="small"
                  fullWidth
                  value={formData.birthdate || ""}
                  onChange={handleChange("birthdate")}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& input": {
                      padding: "10px 12px",
                    },
                  }}
                />
              </Grid>


              <Grid size={{ md: 12 }}>
                <TextField label="Address" size="small" value={formData.address || ""} onChange={handleChange("address")} fullWidth />
              </Grid>
              <Grid size={{ md: 6 }}>
                <TextField
                  select
                  label="Gender"
                  size="small"
                  value={formData.gender || ""}
                  onChange={handleChange("gender")}
                  fullWidth
                >
                  {genders.map((g) => (
                    <MenuItem key={g.value} value={g.value}>
                      {g.label}
                    </MenuItem>
                  ))}
                </TextField>


              </Grid>
              <Grid size={{ md: 6 }}>
                <TextField label="Phone" size="small" value={formData.phone || ""} onChange={handleChange("phone")} fullWidth />
              </Grid>


            </Grid>
          </CardContent>
        </Card>



        <Card variant="outlined">
          <CardContent sx={{ pb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Account</Typography>
            <Grid container spacing={1}>
              <Grid size={{ md: 6 }}>
                <TextField label="Email" size="small" value={formData.email || ""} onChange={handleChange("email")} fullWidth />
              </Grid>
              <Grid size={{ md: 6 }}>
                <TextField label="Username" size="small" value={formData.username || ""} onChange={handleChange("username")} fullWidth />
              </Grid>
              <Grid size={{ md: 6 }}>
                <TextField label="Password" type="password" size="small" value={formData.password || ""} onChange={handleChange("password")} fullWidth />
              </Grid>
              <Grid item size={{ md: 6 }}>
                <TextField
                  select
                  label="Role"
                  size="small"
                  value={formData.role || ""}
                  onChange={handleChange("role")}
                  fullWidth
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.slug}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

            </Grid>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1 }}>
        <Button onClick={onClose} startIcon={<CloseIcon fontSize="small" />} sx={{ backgroundColor: 'red' }} variant="contained" size="small">Close</Button>
        <Button onClick={onSave} startIcon={<SaveIcon fontSize="small" />} size="small" variant="contained">
          {isEdit ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;
