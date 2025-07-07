import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Slide,
  Tab,
  Tabs,
  Paper,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PhoneIcon from "@mui/icons-material/Phone";
import GroupIcon from "@mui/icons-material/Group";
import DescriptionIcon from "@mui/icons-material/Description"
import { UseMethod } from "../../composables/UseMethod";
import QRCodeIcon from "@mui/icons-material/QrCode";
import { ArrowBackSharp, ViewList } from "@mui/icons-material";
import EventRegisteredDialog from "./EventRegisteredDialog";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const EventViewDialog = ({ open, onClose, event }) => {
  const [qrPath, setQrPath] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [qrModal, setQrModal] = useState(false);
  const [openRegistered, setOpenRegistered] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const mapUrl =
    event?.latitude && event?.longitude
      ? `https://www.google.com/maps?q=${event.latitude},${event.longitude}&z=15&output=embed`
      : "";

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "";
    const date = new Date(`${dateStr}T${timeStr}`);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  useEffect(() => {
    if (!event?.id) return;
    const fetchQR = async () => {
      setLoadingQR(true);
      const res = await UseMethod("get", "qrcodes", null, event.id);
      if (res?.data?.qr_url) {
        setQrPath(res.data.qr_url);
      }
      setLoadingQR(false);
    };
    fetchQR();
  }, [event?.id]);

  const handleGenerateQR = async () => {
    setLoadingQR(true);
    const res = await UseMethod("post", `qrcodes/generate/${event.id}`);
    if (res?.data?.qr_url) {
      setQrPath(res.data.qr_url);
    }
    setLoadingQR(false);
  };

  const printImage = (src) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      `<img src="${src}" onload="window.print();window.close()" style="max-width:100%"/>`
    );
    printWindow.document.close();
  };


  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        fullScreen
        height="100vh"
        PaperProps={{
          sx: {
            height: "100vh",
            ml: "auto",

            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", sm: "90%", md:"55%" },
          },
        }}
      >
        <DialogTitle sx={{ pb: 0, mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Button
            onClick={onClose}
            variant="contained"
            color="error"
            size="large"
            fullWidth={isMobile}
          >
              <ArrowBackSharp fontSize="small" sx={{mr:1}} />  Back
          </Button>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Details" />
            <Tab label="QR CODE" />
            <Tab label="Attendance" />
            <Tab label="Comments & Reviews" />
          </Tabs>
        </DialogTitle>
        <DialogContent sx={{ overflowY: "auto", height: "100vh" }}>
          {tabIndex === 0 && (
            <Grid container sx={{ width: "100%" , display: "flex", flexDirection: "column", alignItems: "center"  }}>
              <Box
                sx={{
                  width: '68%',
                  height: 230,
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  overflow: "hidden",
                  backgroundColor: "#f9f9f9",
                }}

              >
                <Grid item xs={12} sm={6}>
                  {event?.image && (
                    <img
                      src={
                        typeof event?.image === "string"
                          ? `http://127.0.0.1:8000/storage/${event?.image}`
                          : URL.createObjectURL(event?.image)
                      }
                      alt="Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </Grid>
              </Box>

              <Paper

                elevation={1}
                sx={{
                  p: 4,
                  mt: 2,
                  borderRadius: 4,
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <Grid container spacing={3}>
                  {/* Title and Organizer */}
                  <Grid size={{ md: 12 }} xs={12}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      {event?.title}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      <EventAvailableIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                      Organized by <strong>{event?.organizer}</strong>
                    </Typography>
                  </Grid>

                  {/* Date */}
                  <Grid size={{ md: 6 }} xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <CalendarMonthIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                      <strong>Date:</strong> {event?.startDate} to {event?.endDate}
                    </Typography>
                  </Grid>

                  {/* Time */}
                  <Grid size={{ md: 6 }} xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <AccessTimeIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                      <strong>Time:</strong> {event?.startTime} – {event?.endTime}
                    </Typography>
                  </Grid>

                  {/* Venue */}
                  <Grid size={{ md: 12 }} xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <LocationOnIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                      <strong>Venue:</strong> {event?.venue}
                    </Typography>
                  </Grid>

                  {/* Address */}
                  <Grid size={{ md: 12 }} xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <LocationOnIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                      <strong>Address:</strong> {event?.address}
                    </Typography>
                  </Grid>

                  {/* Contact */}
                  <Grid size={{ md: 6 }} xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <PhoneIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                      <strong>Contact:</strong> {event?.contact}
                    </Typography>
                  </Grid>

                  {/* Attendees */}
                  <Grid size={{ md: 6 }} xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <GroupIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                      <strong>Expected Attendees:</strong> {event?.attendees}
                    </Typography>
                  </Grid>

                  {/* Description */}
                  <Grid size={{ md: 12 }} xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <DescriptionIcon sx={{ fontSize: 20, mr: 1, verticalAlign: "middle" }} />
                      <strong>Description</strong> {event?.description}

                    </Typography>

                  </Grid>
                </Grid>
              </Paper>

            </Grid>
          )}
          {tabIndex === 1 && (
            <Box p={2}>
              {qrPath ? (
                <Box textAlign="center" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <img
                    src={qrPath}
                    alt="QR Code"
                    style={{ maxWidth: "100%" ,height:"45vh"}}
                  />
                  <Button
                    onClick={() => printImage(qrPath)}
                    variant="contained"
                    color="success"
                    sx={{ mt: 2 }}
                  >
                    Print Event QR
                  </Button>
                </Box>
              ) : (
                <Box textAlign="center" sx={{ mt: 2 }}>
                  <Typography>No QR code available.</Typography>
                  <Button
                    startIcon={<QRCodeIcon />}
                    variant="contained"
                    size="small"
                    color="warning"
                    onClick={handleGenerateQR}
                    disabled={loadingQR}
                  >
                    {loadingQR ? "Generating..." : "Generate QR Code"}
                  </Button>
                </Box>

              )}
              {/* Add attendance info here */}
            </Box>
          )}
          {tabIndex === 2 && (
            <Box p={2}>
              <h3>Attendance</h3>
              {/* Add attendance info here */}
            </Box>
          )}
          {tabIndex === 3 && (
            <Box p={2}>
              <h3>Comments & Reviews</h3>
              {/* Add comments & reviews here */}
            </Box>
          )}



        </DialogContent>

      
      </Dialog>

      {/* QR Code Modal */}
     

      <EventRegisteredDialog
        open={openRegistered}
        onClose={() => setOpenRegistered(false)} />
    </>
  );
};

export default EventViewDialog;
