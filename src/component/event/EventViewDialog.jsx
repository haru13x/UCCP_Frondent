import React, { useState, useEffect, use } from "react";
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  CircularProgress,
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
import { ArrowBackSharp, CategorySharp, Event, Mode, ViewList } from "@mui/icons-material";
import EventRegisteredDialog from "./EventRegisteredDialog";
import { useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import RegisterUserSelectorModal from "./RegisterUserSelectorModal";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const EventViewDialog = ({ open, onClose, event }) => {
              const apiUrl = process.env.REACT_APP_API_URL;
  const [qrPath, setQrPath] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [qrModal, setQrModal] = useState(false);
  const [openRegistered, setOpenRegistered] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabIndex, setTabIndex] = useState(0);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!open) {
      setTabIndex(0);
      setQrPath(null);
      setRegisteredUsers([]);
    }
  }, [event, open]);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);

    if (newValue === 2) {


      // Fetch registered users
      fetchEventRegistered(); // Make sure this uses currentPage/searchTerm states internally
    }
    else {
      setSearchTerm("");

      setCurrentPage(1);
    }
  };
  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(search);

  };
  useEffect(() => {
    if (tabIndex === 2) {
      fetchEventRegistered();
    }
    else {
      setSearchTerm("");
      setCurrentPage(1);
    }
  }, [searchTerm, currentPage]);

  const fetchEventRegistered = async () => {
    setLoading(true);
    setRegisteredUsers([]);
    let payload = {
      'page': currentPage,
      'search': searchTerm,
      'itemsPerPage': itemsPerPage,
    }
    try {
      const res = await UseMethod(
        "post",
        `get-event-registered/${event.id}`,
        payload
      );
      const result = res?.data?.registered_users;

      setRegisteredUsers(result?.data || []);
      setTotalPages(result?.last_page || 1);
    } catch (err) {
      console.error("Error fetching registered users", err);
      setRegisteredUsers([]);
    }
    setLoading(false);
  }
  const handleMarkAttendance = async () => {
    if (!selectedUser) return;
    try {
      await UseMethod("post", `mark-attend`, {
        event_id: event.id,
        user_id: selectedUser.user_id
      });
      fetchEventRegistered(); // refresh the list
      setConfirmModal(false);
    } catch (error) {
      console.error("Failed to mark attendance:", error);
    }
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
  const handleClose = () => {
    fetchEventRegistered();
    setOpenRegistered(false);
    setModalOpen(false)

  }


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
            width: { xs: "100%", sm: "90%", md: "80%" },
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 0,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#007bb6", // modern blue tone
            color: "white",
            px: 3,
            py: 2,

            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              onClick={onClose}
              variant="contained"
              size="medium"
              sx={{
                backgroundColor: "#f44336",
                color: "white",
                borderRadius: 2,
                textTransform: "none",
                px: 2,
                "&:hover": {
                  backgroundColor: "#d32f2f",
                },
              }}
            >
              <ArrowBackSharp fontSize="small" sx={{ mr: 1 }} />
              Back
            </Button>
          </Box>

          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              "& .MuiTab-root": {
                color: "white",
                fontWeight: 500,
                textTransform: "none",
              },
              "& .Mui-selected": {
                color: "white",
                fontWeight: 800, // Highlight active tab with amber
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#ffc107", // Active tab underline
              },
            }}
          >
            <Tab label="Details" />
            <Tab label="QR Code" />
            <Tab label="Registered" />
            <Tab label="Comments & Reviews" />
            <Tab label="Overview" />
          </Tabs>
        </DialogTitle>

        <DialogContent sx={{ overflowY: "auto", height: "100vh" }}>
          <Grid>


            {tabIndex === 0 && (
              <Grid container sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                            ? `${apiUrl}/storage/${event?.image}`
                            : URL.createObjectURL(event?.image)
                        }
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}

                  </Grid>

                </Box>
                <Typography sx={{ mt: 1 }} variant="h4" fontWeight={700} gutterBottom>
                  {event?.title}
                </Typography>
                <Paper

                  elevation={1}
                  sx={{
                    p: 2,
                    mx: 3,
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    boxShadow: "0 10px 13px rgba(5, 4, 4, 0.08)",
                  }}
                >
                  <Grid container spacing={3}>
                    {/* Title and Organizer */}
                  
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
                    <Grid size={{ md: 6 }} xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <LocationOnIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                        <strong>Venue:</strong> {event?.venue}
                      </Typography>
                    </Grid>

                    {/* Address */}
                    <Grid size={{ md: 6 }} xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <LocationOnIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                        <strong>Address:</strong> {event?.address}
                      </Typography>
                    </Grid>

                    {/* Contact */}
                    <Grid size={{ md: 6 }} xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <PhoneIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                        <strong>Organizer :</strong> {event?.organizer}
                      </Typography>
                    </Grid>
                    <Grid size={{ md: 6 }} xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <PhoneIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                        <strong>Contact No:</strong> {event?.contact}
                      </Typography>
                    </Grid>
                    <Grid size={{ md: 6 }} xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <CategorySharp sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                        <strong>Event Mode:</strong> {event?.category}
                      </Typography>
                    </Grid>

                    {/* Attendees */}
                    <Grid size={{ md: 6 }} item xs={12} sm={6} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        <GroupIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                        <strong>Expected Attendees:</strong>{" "}
                        
                        {event?.event_types?.map((type) => type.description).join(", ") || "None"}
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
                      style={{ maxWidth: "100%", height: "45vh" }}
                    />
                    {/* <Button
                      onClick={() => printImage(qrPath)}
                      variant="contained"
                      color="success"
                      sx={{ mt: 2 }}
                    >
                      Print Event QR
                    </Button> */}
                    <Button
                      onClick={() => window.open(`http://127.0.0.1:8000/api/event-summary/${event.id}`, "_blank")}
                      variant="outlined"
                      color="primary"
                      sx={{ mt: 2 }}
                    >
                      🖨️ Print Event QRCode
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


                {/* Search Field */}
                <Box display="flex" gap={1} mb={1}>
                  <TextField
                    sx={{ flexGrow: .2 }}
                    label="Search by Name or User ID"
                    variant="outlined"
                    size="small"
                    value={search}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    onChange={(e) => setSearch(e.target.value)}
                    clearable
                  />
                  <Button variant="contained" onClick={handleSearch}>
                    Search
                  </Button>
                  <Button onClick={() => setModalOpen(true)} variant="contained">
                    Registered Users
                  </Button>
                </Box>
                <RegisterUserSelectorModal
                  open={modalOpen}
                  onClose={handleClose}
                  eventId={event.id}
                />

                {/* List */}
                {loading ? (
                  <Box display="flex" justifyContent="center" mt={1}>
                    <CircularProgress />
                  </Box>
                ) : (

                  <List disablePadding>
                    {registeredUsers.length === 0 ? (
                      <Box mt={5} textAlign="center">
                        <img
                          src="no_data.svg" // change this to the actual path of your image
                          alt="No Data"
                          style={{ maxWidth: "290px", marginBottom: 8 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          No registered users found.
                        </Typography>
                      </Box>
                    ) : (
                      registeredUsers.map((user) => (
                        <ListItem
                          button

                          onClick={() => {

                            setSelectedUser(user);
                            setConfirmModal(true);

                          }}
                          sx={{

                            width: "100%",
                            mb: 1,
                            border: "1px solid #ddd",
                            borderRadius: 3,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",

                          }}
                        >
                          <Grid width={'100vw'} container spacing={2} alignItems="center">
                            <Grid size={{ md: 1 }} item xs={12} sm={2} md={1}>
                              <Avatar sx={{ bgcolor: "#1976d2", width: 48, height: 48 }}>
                                {user.details?.first_name?.[0] || "U"}
                              </Avatar>
                            </Grid>
                            <Grid size={{ md: 11 }} container spacing={0} alignItems="center">
                              {/* Avatar & Name */}


                              <Grid size={{ md: 12 }} item xs={12} sm={10} md={5}>
                                <Typography variant="h6" fontWeight={600}>
                                  {user.details?.first_name} {user.details?.middle_name || ""} {user.details?.last_name}
                                </Typography>

                              </Grid>
                              <Grid size={{ md: 4 }} item xs={12} sm={10} md={5}>

                                <Typography variant="body2" color="text.secondary">
                                  Sex: {user.details?.sex?.name || "N/A"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Phone: {user.details?.phone_number || "N/A"}
                                </Typography>
                              </Grid>

                              {/* Registration Info */}
                              <Grid size={{ md: 4 }} item xs={12} sm={6} md={3}>
                                <Typography variant="body2" color="text.secondary">
                                  Registered at: {user.registered_time}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Attend at: {user?.attend_time || "❌ Not Attended"}
                                </Typography>
                              </Grid>

                              {/* Attendance */}
                              <Grid size={{ md: 4 }} item xs={12} sm={6} md={3}>
                                <Typography variant="body2" color="text.secondary">
                                  Attendance:{" "}
                                  <strong style={{ color: user?.is_attend ? "green" : "red" }}>
                                    {user?.is_attend ? "✅ Present" : "❌ Not Attended"}
                                  </strong>
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                  Remarks:   <strong style={{ color: user.is_attend ? "green" : "red" }}>
                                    {user.is_attend ? "✅ Present" : "❌ Not Attended"}
                                  </strong>
                                </Typography>

                              </Grid>
                            </Grid>
                          </Grid>
                        </ListItem>

                      ))
                    )}
                  </List>
                )}
                {/* Pagination */}
                {totalPages > 1 && (
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button
                      variant="outlined"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Prev
                    </Button>
                    <Typography variant="body2" mt={1}>
                      Page {currentPage} of {totalPages}
                    </Typography>
                    <Button
                      variant="outlined"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {tabIndex === 3 && (
              <Box p={2}>
                <h3>Comments & Reviews</h3>
                {/* Add comments & reviews here */}
              </Box>
            )}


          </Grid>
        </DialogContent>


      </Dialog>

      {/* QR Code Modal */}

      <Dialog
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,

            width: "100%",
            boxShadow: 6,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.25rem",
            color: "#1976d2",
            borderBottom: "1px solid #e0e0e0",
            pb: 1.5,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography>📝 Confirm Attendance</Typography>

          <Button
            onClick={() => setConfirmModal(false)}
            variant="contained"
            color="error"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
        </DialogTitle>

        <DialogContent sx={{ py: 2.5 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to mark the following user as <strong>attended</strong>?
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            p={2}
            border="1px solid #e0e0e0"
            borderRadius={2}
            bgcolor="#f9f9f9"
          >
            <Avatar sx={{ bgcolor: "#1976d2", width: 48, height: 48 }}>
              {selectedUser?.details?.first_name?.[0] ?? "U"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {selectedUser?.details?.first_name} {selectedUser?.details?.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Registry Date :  {selectedUser?.registered_time ?? "No email provided"}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", mt: 1 }}>

          {(() => {
            const now = new Date();
            const startDateTime = new Date(`${selectedUser?.event?.start_date}T${selectedUser?.event?.start_time}`);
            const endDateTime = new Date(`${selectedUser?.event?.end_date}T${selectedUser?.event?.end_time}`);

            const oneHourBeforeStart = new Date(startDateTime.getTime() - 60 * 60 * 1000);
            const isEventExpired = now > endDateTime;
            const isTooEarly = now < oneHourBeforeStart;
            const alreadyAttended = selectedUser?.is_attend;

            if (alreadyAttended) {
              return (
                <Typography variant="body1" color="text.secondary">
                  ✅ User already marked as attended
                </Typography>
              );
            }

            if (isEventExpired) {
              return (
                <Typography variant="body1" color="error">
                  ❌ Attendance not allowed. Event has already ended.
                </Typography>
              );
            }

            if (isTooEarly) {
              return (
                <Typography variant="body1" color="warning.main">
                  ⏳ Attendance allowed 1 hour before the event starts.
                </Typography>
              );
            }

            return (
              <Button
                variant="contained"
                color="success"
                onClick={handleMarkAttendance}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Confirm
              </Button>
            );
          })()}


        </DialogActions>
      </Dialog>


      <EventRegisteredDialog
        open={openRegistered}
        onClose={handleClose} />
    </>
  );
};

export default EventViewDialog;
