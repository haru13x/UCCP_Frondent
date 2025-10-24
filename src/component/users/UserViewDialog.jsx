import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  Slide,
} from "@mui/material";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";
import PublicIcon from "@mui/icons-material/Public";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SecurityIcon from "@mui/icons-material/Security";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          height: '100vh',
          maxHeight: '100vh',
          m: 0,
          position: 'fixed',
          right: 0,
        
          width: isMobile ? '100%' : '90%',
        }
      }}
    >
      <DialogTitle
        sx={{
          p: 2,
          background: theme.palette.background.paper,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          User Details
        </Typography>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<PersonIcon />} label="Profile" />
          <Tab icon={<SecurityIcon />} label="Access" />
          <Tab icon={<EventAvailableIcon />} label="Events" />
        </Tabs>
      </Box>

      <DialogContent
        sx={{
          background: theme.palette.background.default,
          p: 3,
        }}>
        {user && (
          <Box>
            {tabIndex === 0 && (
              <>
                {/* Profile Header Card */}
                <Card 
                  elevation={2} 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    background: theme.palette.background.paper,
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 20,
                      left: 24,
                      zIndex: 1
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        background: theme.palette.primary.main,
                        boxShadow: 3
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                  </Box>
                  <CardContent sx={{ pt: 7, pb: 2 }}>
                    <Box sx={{ ml: { xs: 0, sm: 12 } }}>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        @{user.username}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                        <Chip 
                          icon={<BadgeIcon />} 
                          label={user.role?.name || "No Role"} 
                          color="primary" 
                          variant="outlined"
                        />
                        <Chip 
                          icon={<LocationOnIcon />} 
                          label={user.location || "No Location"} 
                          color="secondary" 
                          variant="outlined"
                        />
                        <Chip 
                          icon={<WorkIcon />} 
                          label={user.groupName || "No Group"} 
                          color="info" 
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Contact & Personal Information */}
                <Grid container spacing={3}>
                  <Grid size={12} item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon color="primary" /> Contact Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid size={6} item xs={12}>
                            <InfoItem icon={<EmailIcon color="primary" />} label="Email" value={user.email} />
                          </Grid>
                          <Grid size={6} item xs={12}>
                            <InfoItem icon={<PhoneIcon color="primary" />} label="Phone" value={user.phone} />
                          </Grid>
                          <Grid size={12} item xs={12}>
                            <InfoItem icon={<HomeIcon color="primary" />} label="Address" value={user.details?.address} />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={6}item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon color="secondary" /> Personal Details
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid size={6} item xs={12}>
                            <InfoItem icon={<CakeIcon color="secondary" />} label="Birth Date" value={user.details?.birthdate} />
                          </Grid>
                          <Grid size={6} item xs={12}>
                            <InfoItem icon={<WcIcon color="secondary" />} label="Gender" value={user.details?.sex?.name} />
                          </Grid>
                          <Grid size={12} item xs={12}>
                            <InfoItem icon={<PublicIcon color="secondary" />} label="Nationality" value={user.details?.nationality} />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={6} item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <GroupsIcon color="success" /> Family Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid size={12} item xs={12} sm={6}>
                            <InfoItem icon={<GroupsIcon color="success" />} label="Father's Name" value={user.details?.fatherName} />
                          </Grid>
                          <Grid size={12} item xs={12} sm={6}>
                            <InfoItem icon={<GroupsIcon color="success" />} label="Mother's Name" value={user.details?.motherName} />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}

            {tabIndex === 1 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon color="primary" /> Access & Roles
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={12} item xs={12}>
                      <InfoItem icon={<BadgeIcon color="primary" />} label="Role" value={user.role?.name} />
                    </Grid>
                    <Grid size={12} item xs={12}>
                      <InfoItem icon={<WorkIcon color="primary" />} label="Group" value={user.groupName} />
                    </Grid>
                    <Grid size={12} item xs={12}>
                      <InfoItem icon={<LocationOnIcon color="primary" />} label="Church Location" value={user.location} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {tabIndex === 2 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventAvailableIcon color="primary" /> Event History
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Event history will be implemented here...
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserViewDialog;
