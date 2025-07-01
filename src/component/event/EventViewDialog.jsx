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
} from "@mui/material";
import { UseMethod } from "../../composables/UseMethod";
import QRCodeIcon from "@mui/icons-material/QrCode";
import { ViewList } from "@mui/icons-material";
import EventRegisteredDialog from "./EventRegisteredDialog";

const EventViewDialog = ({ open, onClose, event }) => {
  const [qrPath, setQrPath] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [qrModal, setQrModal] = useState(false);
  const [openRegistered, setOpenRegistered] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      <Dialog open={open} onClose={onClose} fullScreen>
        <DialogContent sx={{ p: 0 }}>
          {/* Header */}
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
            <DialogTitle
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                textAlign: "center",
                py: 2,
              }}
            >
              📋 {event?.title || "Event Details"}
            </DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              {formatDateTime(event?.startDate, event?.startTime)} –{" "}
              {formatDateTime(event?.endDate, event?.endTime)}
            </Typography>

            {/* QR View / Generate */}
         
          </Box>

          {/* Main Content */}
          <Grid container spacing={2} p={1}>
            <Grid item size={{md:6}}>
              <Card variant="outlined">
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
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        mt={2}
                      >
                        Contact
                      </Typography>
                      <Typography>{event?.contact}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography>{event?.category}</Typography>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        mt={2}
                      >
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
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    mt={2}
                  >
                    Address
                  </Typography>
                  <Typography>{event?.address}</Typography>
                  {event?.description && (
                    <>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        mt={2}
                      >
                        Description
                      </Typography>
                      <Typography>{event?.description}</Typography>
                    </>
                  )}
                  
                </CardContent>

              </Card>
            </Grid>

            {/* Map Side */}
            <Grid item xs={12} size={{md: 6}}>
                 
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box m={1}>
              {qrPath ? (
                <Button
                  startIcon={<QRCodeIcon />}
                  variant="contained"
                  size="small"
                  color="success"
                  onClick={() => setQrModal(true)}
                >
                  View QR Code
                </Button>
              ) : (
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
              )}
              <Button
              startIcon={<ViewList/>}
              size="small"
              color="primary"
              variant="contained"
              sx={{ml:1}}
              onClick={()=> setOpenRegistered(true)}
              >View Registered</Button>
            </Box>
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
                    <Typography color="text.secondary">
                      Map not available.
                    </Typography>
                  )}
                  {event?.latitude && event?.longitude && (
                    <Typography mt={1} fontSize="0.875rem" color="text.secondary">
                      📍 {event.latitude}, {event.longitude}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            size="large"
            fullWidth={isMobile}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog
        open={qrModal}
        onClose={() => setQrModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>QR Code for {event?.title}</DialogTitle>
        <DialogContent dividers>
          {qrPath ? (
            <Box textAlign="center">
              <img
                src={qrPath}
                alt="QR Code"
                style={{ maxWidth: "100%" }}
              />
              <Button
                onClick={() => printImage(qrPath)}
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
              >
                Print QR
              </Button>
            </Box>
          ) : (
            <Typography>No QR code available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <EventRegisteredDialog 
      open={openRegistered}
      onClose={()=>setOpenRegistered(false)}/>
    </>
  );
};

export default EventViewDialog;
