import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Avatar,
  Box,
  Divider,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

const EventViewDialog = ({ open, onClose, event }) => {
  const mapUrl =
    event?.latitude && event?.longitude
      ? `https://www.google.com/maps?q=${event.latitude},${event.longitude}&z=15&output=embed`
      : "";

  const attendees = event?.attendees_list || [
    { id: 1, name: "John Doe", status: "Present" },
    { id: 2, name: "Jane Smith", status: "Present" },
    { id: 3, name: "Alex Cruz", status: "Absent" },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      {/* Top Header */}
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          backgroundColor: "#1976d2",
          color: "#fff",
          textAlign: "center",
          py: 2,
        }}
      >
        📋 {event?.title || "Event Details"}
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Banner */}
        <Box
          sx={{
            height: 180,
            background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <Avatar sx={{ bgcolor: "#fff", color: "#1976d2", mb: 1, width: 64, height: 64 }}>
            <EventNoteIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            {event?.startDate} - {event?.endDate} • {event?.time}
          </Typography>
        </Box>

        {/* Middle Content */}
        <Grid container spacing={2} p={1}>
          {/* Left - Info */}
          <Grid size={{md:6}}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📌 Event Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Organizer
                    </Typography>
                    <Typography>{event?.organizer}</Typography>

                    <Typography variant="subtitle2" color="text.secondary" mt={2}>
                      Contact
                    </Typography>
                    <Typography>{event?.contact}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography>{event?.category}</Typography>

                    <Typography variant="subtitle2" color="text.secondary" mt={2}>
                      Attendees
                    </Typography>
                    <Typography>{event?.attendees}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary">
                  Venue
                </Typography>
                <Typography>{event?.venue}</Typography>

                <Typography variant="subtitle2" color="text.secondary" mt={2}>
                  Address
                </Typography>
                <Typography>{event?.address}</Typography>

                {event?.description && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" mt={2}>
                      Description
                    </Typography>
                    <Typography>{event?.description}</Typography>
                  </>
                )}
              </CardContent>
               <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: "100%",  }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🗺️ Event Location
                </Typography>
                {mapUrl ? (
                  <Box
                    sx={{
                      mt: 1,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #ccc",
                      height: 300,
                    }}
                  >
                    <iframe
                      src={mapUrl}
                      title="Event Map"
                      style={{ border: 0, width: "100%", height: "100%" }}
                      loading="lazy"
                    />
                  </Box>
                ) : (
                  <Typography color="text.secondary">Map not available.</Typography>
                )}
                {event?.latitude && event?.longitude && (
                  <Typography mt={1} fontSize="0.875rem" color="text.secondary">
                    📍 {event.latitude}, {event.longitude}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
            </Card>
          </Grid>
 <Grid sx={{ md:6}} sx={{ height: "100%" ,width:'48%',}} fullWidth>
            <Card variant="outlined" sx={{ height: "100%" ,width:'100%',p:1}} fullWidth>
              <CardContent>
                </CardContent>
                 
          <Typography variant="h6" gutterBottom display="flex" alignItems="center">
            <PeopleAltIcon fontSize="small" sx={{ mr: 1 }} />
            Attendees List
          </Typography>
          <Paper variant="outlined" >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendees.map((attendee, index) => (
                  <TableRow key={attendee.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{attendee.name}</TableCell>
                    <TableCell>{attendee.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Card></Grid>
          {/* Right - Map */}
         
        </Grid>

        {/* Bottom - Attendees */}
      
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary" size="large" fullWidth={isMobile}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventViewDialog;
