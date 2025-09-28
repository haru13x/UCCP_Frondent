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
  Card,
  CardContent,
  Chip,
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
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const InfoItem = ({ icon, label, value }) => (
  <Card 
    elevation={1} 
    sx={{ 
      p: 1, 
      height: '100%',
      transition: 'all 0.2s ease',
      '&:hover': {
        elevation: 2,
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }
    }}
  >
    <CardContent sx={{ p: '8px !important', '&:last-child': { pb: '8px !important' } }}>
      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
        {React.cloneElement(icon, { sx: { fontSize: '1rem' } })}
        <Typography variant="caption" color="text.secondary" fontWeight="medium" sx={{ textTransform: 'uppercase', letterSpacing: 0.3, fontSize: '0.7rem' }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ wordBreak: 'break-word', fontSize: '0.85rem' }}>
        {value || 'N/A'}
      </Typography>
    </CardContent>
  </Card>
);

const UserViewDialog = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle 
        sx={{ 
          fontWeight: "bold", 
          fontSize: "1.2rem", 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 2
        }}
      >
        <AccountCircleIcon sx={{ fontSize: "1.5rem" }} />
        User Details
      </DialogTitle>

      <DialogContent sx={{ p: 2, mt:1 }}>
        {user && (
          <Box>
            {/* Profile Header Card */}
            <Card 
              elevation={2} 
              sx={{ 
                mb: 2, 
                borderRadius: 2,
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: 2
                    }}
                  >
                    <PersonIcon fontSize="medium" />
                  </Avatar>
                  <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      @{user.username}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" } }}>
                      <Chip 
                        icon={<BadgeIcon sx={{ fontSize: '0.9rem' }} />} 
                        label={user.role?.name || "No Role"} 
                        color="primary" 
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                      <Chip 
                        icon={<LocationOnIcon sx={{ fontSize: '0.9rem' }} />} 
                        label={user.location || "No Location"} 
                        color="secondary" 
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 1, color: "primary.main", fontSize: "1rem" }}>
              📞 Contact
            </Typography>
            <Grid container spacing={2} mb={3}>
              <Grid size={{md:6}} item xs={12} sm={6}>
                <InfoItem icon={<EmailIcon color="primary" />} label="Email" value={user.email} />
              </Grid>
              <Grid size={{md:6}} item xs={12} sm={6}>
                <InfoItem icon={<PhoneIcon color="primary" />} label="Phone" value={user.phone} />
              </Grid>
            </Grid>

            {/* Personal Information */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 1, color: "secondary.main", fontSize: "1rem" }}>
              👤 Personal
            </Typography>
            <Grid container spacing={2} mb={3}>
              <Grid size={{md:4}} item xs={12} sm={4}>
                <InfoItem icon={<CakeIcon color="secondary" />} label="Birth Date" value={user.details?.birthdate} />
              </Grid>
              <Grid size={{md:4}} item xs={12} sm={4}>
                <InfoItem icon={<WcIcon color="secondary" />} label="Gender" value={user.details?.sex?.name} />
              </Grid>
              <Grid size={{md:4}} item xs={12} sm={4}>
                <InfoItem icon={<PublicIcon color="secondary" />} label="Nationality" value={user.details?.nationality} />
              </Grid>
            </Grid>

            {/* Address & Family */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 1, color: "success.main", fontSize: "1rem" }}>
              🏠 Address & Family
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{md:6}} item xs={12}>
                <InfoItem icon={<HomeIcon color="success" />} label="Address" value={user.details?.address} />
              </Grid>
              <Grid size={{md:3}} item xs={12} sm={6}>
                <InfoItem icon={<GroupsIcon color="success" />} label="Father" value={user.details?.fatherName} />
              </Grid>
              <Grid size={{md:3}} item xs={12} sm={6}>
                <InfoItem icon={<GroupsIcon color="success" />} label="Mother" value={user.details?.motherName} />
              </Grid>
            </Grid>
          </Box>
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
