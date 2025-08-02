import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Typography,
  Box,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";
import PublicIcon from "@mui/icons-material/Public";
import GroupsIcon from "@mui/icons-material/Groups";

const InfoItem = ({ icon, label, value }) => (
  <Box display="flex" alignItems="center" gap={1}>
    {icon}
    <Typography fontWeight={500} color="text.secondary">
      {label}:
    </Typography>
    <Typography>{value || "N/A"}</Typography>
  </Box>
);

const UserViewDialog = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: "bold", fontSize: 18, bgcolor: "#f5f5f5" }}>
        👁️ View User Details
      </DialogTitle>

      <DialogContent>
        {user && (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mt: 1 }}>
            {/* Profile */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  mb: 1,
                  background: "linear-gradient(to bottom right, #1976d2, #42a5f5)",
                }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6" fontWeight="bold">
                {user.firstName} {user.middleName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{user.username}
              </Typography>
            </Box>

            {/* Divider */}
            <Divider sx={{ mb: 3 }} />

            {/* Contact & Role */}
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Contact & Role
            </Typography>
            <Grid container spacing={2} mb={4}>
              <Grid size={{md:4}} item xs={12} sm={6} md={4}>
                <InfoItem icon={<EmailIcon color="primary" />} label="Email" value={user.email} />
              </Grid>
              <Grid size={{md:4}} item xs={12} sm={6} md={4}>
                <InfoItem icon={<PhoneIcon color="primary" />} label="Phone" value={user.phone} />
              </Grid>
              <Grid size={{md:4}} item xs={12} sm={6} md={4}>
                <InfoItem icon={<BadgeIcon color="primary" />} label="Role" value={user.role?.name} />
              </Grid>
            </Grid>

            {/* Personal Info */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Personal Details
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{md:4}} item xs={12} sm={6} md={4}>
                <InfoItem icon={<CakeIcon color="action" />} label="Birthdate" value={user.details.birthdate} />
              </Grid>
              <Grid size={{md:4}} item xs={12} sm={6} md={4}>
                <InfoItem icon={<WcIcon color="action" />} label="Gender" value={user.details.sex?.name} />
              </Grid>
              <Grid size={{md:4}} item xs={12} sm={6} md={4}>
                <InfoItem icon={<PublicIcon color="action" />} label="Nationality" value={user.details.nationality} />
              </Grid>
              <Grid size={{md:4}} item xs={12} sm={6} md={6}>
                <InfoItem icon={<HomeIcon color="action" />} label="Address" value={user.details.address} />
              </Grid>
              <Grid size={{md:4}} item xs={12} sm={6} md={6}>
                <InfoItem icon={<GroupsIcon color="action" />} label="Father" value={user.details.fatherName} />
              </Grid>
              <Grid size={{md:4}} item xs={12} sm={6} md={6}>
                <InfoItem icon={<GroupsIcon color="action" />} label="Mother" value={user.details.motherName} />
              </Grid>
            </Grid>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          size="small"
          sx={{ fontWeight: "bold" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserViewDialog;
