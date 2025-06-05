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

const InfoItem = ({ icon, label }) => (
  <Box display="flex" alignItems="center" gap={1}>
    {icon}
    <Typography>{label || "N/A"}</Typography>
  </Box>
);

const UserViewDialog = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>👁️ View User</DialogTitle>
      <DialogContent>
        {user && (
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3,  }}>
              <Avatar sx={{ width: 80, height: 80, mb: 1 }}>
                <PersonIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6" fontWeight="bold">
                {user.firstName} {user.middleName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{user.username}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Contact + Role Info */}
            <Grid container spacing={2}>
              <Grid size={{md:5}}>
                <InfoItem icon={<EmailIcon fontSize="small" color="action" />} label={user.email} />
              </Grid>
              <Grid size={{md:4}}>
                <InfoItem icon={<PhoneIcon fontSize="small" color="action" />} label={user.phone} />
              </Grid>
              <Grid size={{md:3}}>
                <InfoItem icon={<BadgeIcon fontSize="small" color="action" />} label={user.role} />
              </Grid>
            </Grid>

            {/* Personal Details */}
            <Box mt={4}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Personal Details
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{md:4}}>
                  <InfoItem icon={<CakeIcon fontSize="small" color="action" />} label={user.birthdate} />
                </Grid>
                <Grid size={{md:4}}>
                  <InfoItem icon={<WcIcon fontSize="small" color="action" />} label={user.gender} />
                </Grid>
                <Grid size={{md:4}}>
                  <InfoItem icon={<PublicIcon fontSize="small" color="action" />} label={user.nationality} />
                </Grid>
                <Grid size={{md:4}}>
                  <InfoItem icon={<HomeIcon fontSize="small" color="action" />} label={user.address} />
                </Grid>
                <Grid size={{md:4}}>
                  <InfoItem icon={<GroupsIcon fontSize="small" color="action" />} label={`Father: ${user.fatherName}`} />
                </Grid>
                <Grid size={{md:4}}>
                  <InfoItem icon={<GroupsIcon fontSize="small" color="action" />} label={`Mother: ${user.motherName}`} />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary" size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserViewDialog;
