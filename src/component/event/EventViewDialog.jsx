import React, { useState, useEffect, useMemo } from "react";
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
  Rating,
  IconButton,
  Tooltip,
  Chip,
  Skeleton,
  InputAdornment,
} from "@mui/material";
import {
  ArrowBackSharp,
  CalendarMonth as CalendarMonthIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Group as GroupIcon,
  Description as DescriptionIcon,
  Category as CategorySharp,
  Event as EventIcon,
  QrCode2 as QRCodeIcon,
  Comment,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Insights,
  Search as SearchIcon,
  Print as PrintIcon,
  Star,
  StarBorder,
  PhonelinkLockOutlined,
  PersonPinCircleOutlined,
  EventAvailable,
  AccessTime,
  CheckCircle,
  CheckCircleOutline,
  Cancel,
  WarningAmber,
  Person,

} from "@mui/icons-material";
import { UseMethod } from "../../composables/UseMethod";
import { useSnackbar } from "./SnackbarProvider "; // assumed
import RegisterUserSelectorModal from "./RegisterUserSelectorModal";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
const Transition = React.forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

const EventViewDialog = ({ open, onClose, event }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showSnackbar } = useSnackbar();
  // State
  const [tabIndex, setTabIndex] = useState(0);
  const [qrPath, setQrPath] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Format date-time
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

  // Overview Stats
  const overviewStats = useMemo(() => {
    const total = registeredUsers.length;
    const attended = registeredUsers.filter((u) => u.is_attend).length;
    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "–";

    return [
      { label: "Total Registrations", value: total, color: "primary" },
      { label: "Attended", value: attended, color: "success" },
      { label: "Not Attended", value: total - attended, color: "error" },
      { label: "Avg. Rating", value: avgRating, icon: <Star fontSize="small" color="warning" /> },
    ];
  }, [registeredUsers, reviews]);

  // Fetch QR Code
  useEffect(() => {
    if (!event?.id || !open) return;

    const fetchQR = async () => {
      setLoadingQR(true);
      try {
        const res = await UseMethod("get", "qrcodes", null, event.id);
        if (res?.data?.qr_url) setQrPath(res.data.qr_url);
      } catch (err) {
        console.error("Failed to fetch QR code", err);
        showSnackbar("Failed to load QR code.", { variant: "error" });
      } finally {
        setLoadingQR(false);
      }
    };

    fetchQR();
  }, [event?.id, open, showSnackbar]);

  // Fetch Registered Users
  useEffect(() => {
    if (tabIndex !== 2 || !event?.id) return;
    fetchEventRegistered();
  }, [tabIndex, event?.id, searchTerm, currentPage]);

  const fetchEventRegistered = async () => {
    setLoading(true);
    try {
      const payload = { page: currentPage, search: searchTerm, itemsPerPage };
      const res = await UseMethod("post", `get-event-registered/${event.id}`, payload);
      const data = res?.data?.registered_users;
      setRegisteredUsers(data?.data || []);
      setTotalPages(data?.last_page || 1);
    } catch (err) {
      console.error("Error fetching registered users", err);
      showSnackbar("Failed to load registered users.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Fetch Reviews
  useEffect(() => {
    if (!open || tabIndex !== 3 || !event?.id || hasFetched) return;

    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const res = await UseMethod("get", `events/${event.id}/reviews`);
        if (res?.status === 200 && Array.isArray(res.data.reviews)) {
          const formatted = res.data.reviews.map((r) => ({
            id: r.id,
            name: r.is_mine ? "You" : r.name || "User",
            rating: r.rating,
            text: r.text,
            created_at: r.created_at,
          }));
          setReviews(formatted);

          const myReview = formatted.find((r) => r.name === "You");
          if (myReview) {
            setUserRating(myReview.rating);
            setUserComment(myReview.text);
          }
        }
        showSnackbar("Reviews loaded successfully!", { variant: "success" });
      } catch (error) {
        console.error("Failed to load reviews:", error);
        showSnackbar("Could not load reviews.", { variant: "error" });
      } finally {
        setLoadingReviews(false);
        setHasFetched(true);
      }
    };

    fetchReviews();
  }, [open, tabIndex, event?.id, hasFetched, showSnackbar]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTabIndex(0);
      setQrPath(null);
      setRegisteredUsers([]);
      setReviews([]);
      setHasFetched(false);
      setSearch("");
      setSearchTerm("");
      setCurrentPage(1);
    }
  }, [open]);

  // Handlers
  const handleTabChange = (e, newValue) => setTabIndex(newValue);
  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(search);
  };

  const handleGenerateQR = async () => {
    setLoadingQR(true);
    try {
      const res = await UseMethod("post", `qrcodes/generate/${event.id}`);
      if (res?.data?.qr_url) setQrPath(res.data.qr_url);
      showSnackbar("QR code generated successfully!", { variant: "success" });
    } catch (err) {
      showSnackbar("Failed to generate QR code.", { variant: "error" });
    } finally {
      setLoadingQR(false);
    }
  };

  const printImage = (src) => {
    const win = window.open("", "_blank");
    win.document.write(`<img src="${src}" onload="window.print();window.close();" style="max-width:100%"/>`);
    win.document.close();
  };

  const handleMarkAttendance = async () => {
    if (!selectedUser) return;
    try {
      await UseMethod("post", "mark-attend", {
        event_id: event.id,
        user_id: selectedUser.user_id,
      });
      fetchEventRegistered();
      setConfirmModal(false);
      showSnackbar("Attendance marked successfully!", { variant: "success" });
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      showSnackbar("Failed to mark attendance.", { variant: "error" });
    }
  };

  return (
    <>
      {/* Main Dialog */}
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        fullScreen
        PaperProps={{
          sx: {
            height: "100vh",
            ml: "auto",
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", sm: "90%", md: "80%" },
            maxWidth: "100%",
            borderRadius: { xs: 0, sm: 3 },
          },
        }}

      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#005b9f",
            color: "white",
            py: 1.5,
            px: 3,
            gap: 2,
          }}
        >
          <Button
            onClick={onClose}
            startIcon={<ArrowBackSharp />}
            variant="contained"
            color="error"
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Back
          </Button>

          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              "& .MuiTab-root": { minWidth: 120, fontWeight: 500 },
              "& .Mui-selected": { fontWeight: 700 },
              "& .MuiTabs-indicator": { height: 3, borderRadius: 4 },
            }}
          >
            <Tab icon={<EventIcon fontSize="small" />} label="Details" />
            <Tab icon={<QRCodeIcon fontSize="small" />} label="QR Code" />
            <Tab icon={<GroupIcon fontSize="small" />} label="Registered" />
            <Tab icon={<Comment fontSize="small" />} label="Reviews" />
            <Tab icon={<Insights fontSize="small" />} label="Overview" />
          </Tabs>
        </DialogTitle>

        <DialogContent sx={{ overflowY: "auto", padding: 5, paddingTop: 3, bgcolor: "#f5f7fa", }}>
          {/* Tab 0: Details */}
          {tabIndex === 0 && (
            <Box>
              {/* Image */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 250,
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 3,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                {event?.image ? (
                  <img
                    src={`${apiUrl}/storage/${event.image}`}
                    alt={event.title}
                    style={{ width: "80%", height: "90%", objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#e9ecef",
                      color: "#6c757d",
                    }}
                  >
                    No Image Available
                  </Box>
                )}
              </Box>

              {/* Details Card */}
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                <Typography variant="h5" fontWeight="700" gutterBottom color="primary">
                  {event?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  <strong>Organized by:</strong> {event?.organizer}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid size={{ sm: 6 }} item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <CalendarIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        <strong>Date:</strong> {event?.startDate} to {event?.endDate}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <TimeIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        <strong>Time:</strong> {event?.startTime} – {event?.endTime}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <LocationIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        <strong>Venue:</strong> {event?.venue}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <LocationIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        <strong>Address:</strong> {event?.address}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <PhoneIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        <strong>Contact:</strong> {event?.contact}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <GroupIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        <strong>Expected Attendees:</strong> {event?.event_types?.map((type) => type.code).join(", ") || "None"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight="600" color="text.primary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                    {event?.description || "No description available."}
                  </Typography>
                </Box>

                {event?.status === 'Cancelled' && (
                  <Box
                    mt={3}
                    p={3}
                    sx={{
                      borderRadius: 3,
                      backgroundColor: 'error.lighter',
                      border: '1px solid',
                      borderColor: 'error.light',
                      boxShadow: '0 4px 12px rgba(244, 67, 54, 0.1)',
                      borderLeft: '5px solid',
                      borderLeftColor: 'error.main',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(244, 67, 54, 0.15)',
                      },
                    }}
                  >
                    {/* Header */}
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Cancel fontSize="small" color="error" />
                      <Typography
                        variant="subtitle1"
                        fontWeight="700"
                        color="error.main"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <WarningAmber fontSize="small" color="warning" />
                        Event Cancelled
                      </Typography>
                    </Box>

                    {/* Cancel Details Grid */}
                    <Grid container spacing={2}>
                      {/* Reason */}
                      <Grid size={{sm:6}} item xs={12}>
                        <Box display="flex" alignItems="flex-start" gap={1}>
                          <DescriptionIcon fontSize="small" color="action" sx={{ mt: 0.5, flexShrink: 0 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                              Reason for Cancellation
                            </Typography>
                            <Typography
                              variant="body1"
                              color="error.dark"
                              sx={{
                                mt: 0.5,
                                ml: 2,
                                fontStyle: 'italic',
                                lineHeight: 1.5,
                                borderLeft: '2px solid',
                                borderColor: 'error.light',
                                pl: 2,
                              }}
                            >
                              "{event?.cancel_reason || 'No reason provided'}"
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Cancelled By */}
                      <Grid size={{sm:3}} item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Person fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                              Cancelled By
                            </Typography>
                            <Typography variant="body1" color="text.primary" fontWeight={600}>
                              {event?.cancel_by || 'Unknown User'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Date */}
                      <Grid size={{sm:3}} item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <EventAvailable fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                              Cancelled On
                            </Typography>
                            <Typography variant="body1" color="text.primary" fontWeight={600}>
                              {event?.cancel_date
                                ? new Date(event.cancel_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                                : 'Date unavailable'
                              }
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Warning Banner */}
                    <Box
                      mt={2}
                      p={1.5}
                      borderRadius={2}
                      bgcolor="warning.lighter"
                      border="1px solid"
                      borderColor="warning.light"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <WarningAmber fontSize="small" color="warning" />
                      <Typography variant="body2" color="warning.dark">
                        This event cannot be resumed. All registrations are cancelled.
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
          {/* Tab 1: QR Code */}
          {tabIndex === 1 && (
            <Box textAlign="center" p={3}>
              {loadingQR ? (
                <CircularProgress />
              ) : qrPath ? (
                <>
                  <Box
                    component="img"
                    src={qrPath}
                    alt="Event QR"
                    sx={{
                      maxWidth: "100%",
                      height: "45vh",
                      borderRadius: 2,
                      border: "1px solid #ddd",
                      boxShadow: 2,
                    }}
                  />
                  <Box mt={2} display="flex" justifyContent="center" gap={2}>
                    {/* <Button
                      startIcon={<PrintIcon />}
                      variant="contained"
                      color="primary"
                      onClick={() => printImage(qrPath)}
                    >
                      Print
                    </Button> */}
                    <Button
                      startIcon={<PrintIcon />}
                      variant="contained"
                      color="primary"
                      href={`${apiUrl}/event-summary/${event.id}`}
                      target="_blank"
                    >
                      Print Event QR Code
                    </Button>
                  </Box>
                </>
              ) : (
                <Box mt={4}>
                  <Typography color="text.secondary" mb={2}>
                    No QR code generated yet.
                  </Typography>
                  <Button
                    startIcon={<QRCodeIcon />}
                    variant="contained"
                    color="warning"
                    onClick={handleGenerateQR}
                    disabled={loadingQR}
                  >
                    {loadingQR ? "Generating..." : "Generate QR"}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {tabIndex === 2 && event?.status !== 'Cancelled' &&(
            <Box
              sx={{
                padding: { xs: 2, sm: 3 },
                bgcolor: "#ffffff",
                borderRadius: 4,
                boxShadow: 2,
                marginTop: 3,
              }}
            >
              {/* Search & Actions Bar */}
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={2}
                mb={3}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <TextField
                  label="Search by Name or ID"
                  variant="outlined"
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="e.g. John Doe or 12345"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSearch} color="primary" size="small">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    flexGrow: 1,
                    maxWidth: { xs: "100%", sm: 400 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 8,
                    },
                  }}
                />

                <Box display="flex" gap={1} flexWrap="wrap">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                    sx={{
                      borderRadius: 8,
                      textTransform: "none",
                      fontWeight: 600,
                      minWidth: 100,
                    }}
                  >
                    Search
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setModalOpen(true)}
                    sx={{
                      borderRadius: 8,
                      textTransform: "none",
                      fontWeight: 500,
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.main",
                        color: "white",
                      },
                    }}
                  >
                    🧑‍🤝‍🧑 Register User
                  </Button>
                </Box>
              </Box>

              {/* Register Modal */}
              <RegisterUserSelectorModal
                open={modalOpen}
                onClose={() => {
                  setModalOpen(false);
                  fetchEventRegistered();
                }}
                eventId={event.id}
              />

              {/* Loading State */}
              {loading ? (
                <Box mt={2}>
                  {[...Array(5)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        mb: 2,
                        borderRadius: 3,
                        bgcolor: "grey.50",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Skeleton variant="circular" width={48} height={48} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width="60%" height={28} />
                        <Skeleton variant="text" width="40%" height={20} />
                      </Box>
                      <Skeleton variant="rectangular" width={70} height={30} sx={{ borderRadius: 2 }} />
                    </Box>
                  ))}
                </Box>
              ) : registeredUsers.length === 0 ? (
                /* Empty State */
                <Box
                  textAlign="center"

                  sx={{
                    border: "2px dashed #e0e0e0",
                    borderRadius: 4,
                    bgcolor: "#f9f9f9",
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    📭 No Registered Users Found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {search
                      ? "Try adjusting your search query."
                      : "This event has no registrations yet."}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setModalOpen(true)}
                    sx={{ borderRadius: 8 }}
                  >
                    Register First User
                  </Button>
                </Box>
              ) : (
                /* User List */
                <List sx={{ borderRadius: 3, overflow: "hidden" }}>
                  {registeredUsers.map((user) => (
                    <Tooltip
                      title={
                        user.is_attend
                          ? "Already marked as attended"
                          : "Click to mark attendance"
                      }
                      arrow
                    >
                      <ListItem
                        key={user.user_id}
                        button={user.is_attend === 1}
                        onClick={
                          user.is_attend === 0
                            ? () => {
                              setSelectedUser(user);
                              setConfirmModal(true);
                            }
                            : undefined
                        }
                        sx={{
                          mb: 1,

                          borderRadius: 3,
                          border: "1px solid #e0e0e0",
                          bgcolor: "background.paper",
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: "primary.light",
                            borderColor: "primary.main",
                            transform: "translateY(-2px)",
                            boxShadow: 3,
                          },
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexDirection: { xs: "column", sm: "row" },
                          textAlign: { xs: "center", sm: "left" },
                          justifyContent: "space-between",
                          cursor: user.is_attend === 0 ? "pointer" : "default",
                        }}
                      >
                        {/* Avatar & Name */}
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between", // or "space-around"
                            alignItems: { xs: "stretch", sm: "center" },
                            gap: 1,
                            p: 1,
                            mb: 1.5,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: user.is_attend ? "success.light" : "error.light",
                            bgcolor: user.is_attend ? "success.lighter" : "error.lighter",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                              borderColor: user.is_attend ? "success.main" : "error.main",
                            },
                          }}
                        >
                          {/* Avatar */}
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar
                              sx={{
                                width: 64,
                                height: 64,
                                fontSize: "1.5rem",
                                fontWeight: 700,
                                bgcolor: user.is_attend ? "success.main" : "error.main",
                              }}
                            >
                              {user.details?.first_name?.[0]?.toUpperCase() || "U"}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight={600}>
                                {user.details?.first_name} {user.details?.last_name}
                              </Typography>

                            </Box>
                          </Box>

                          {/* Contact Info */}
                          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                            <Typography variant="body2" color="text.secondary">
                              Phone Number : {user.details?.phone_number || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Gender : {user.details?.sex?.name || "N/A"}
                            </Typography>
                          </Box>

                          {/* Registration Date */}
                          <Box sx={{ textAlign: { xs: "center", sm: "justify" } }}>
                            <Typography variant="body2" color="text.secondary">
                              Registered Date : {new Date(user.registered_time).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Attent Date : {new Date(user?.attend_time).toLocaleDateString() || "Not attended yet"}
                            </Typography>
                          </Box>

                          {/* Attendance Chip */}
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Chip
                              icon={user.is_attend ? null : null}
                              label={user.is_attend ? "✅ Attended" : "❌ Not Attended"}
                              color={user.is_attend ? "success" : "error"}
                              size="medium"
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                height: 32,
                                minWidth: 120,
                              }}
                            />
                          </Box>
                        </Box>


                      </ListItem>
                    </Tooltip>
                  ))}
                </List>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mt={4}
                  gap={2}
                  flexWrap="wrap"
                >
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    variant="outlined"
                    color="primary"
                    startIcon={<ArrowBackSharp fontSize="small" />}
                    sx={{ borderRadius: 8 }}
                  >
                    Previous
                  </Button>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      bgcolor: "primary.light",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    Page {currentPage} of {totalPages}
                  </Typography>

                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    variant="outlined"
                    color="primary"
                    endIcon={<ArrowBackSharp fontSize="small" sx={{ transform: "rotate(180deg)" }} />}
                    sx={{ borderRadius: 8 }}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </Box>
          )}: { tabIndex === 2  &&  event?.status === 'Cancelled' && (
           
                  <Box
                    mt={3}
                    p={3}
                    sx={{
                      borderRadius: 3,
                      backgroundColor: 'error.lighter',
                      border: '1px solid',
                      borderColor: 'error.light',
                      boxShadow: '0 4px 12px rgba(244, 67, 54, 0.1)',
                      borderLeft: '5px solid',
                      borderLeftColor: 'error.main',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(244, 67, 54, 0.15)',
                      },
                    }}
                  >
                    {/* Header */}
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Cancel fontSize="small" color="error" />
                      <Typography
                        variant="subtitle1"
                        fontWeight="700"
                        color="error.main"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <WarningAmber fontSize="small" color="warning" />
                        Event Cancelled
                      </Typography>
                    </Box>

                    {/* Cancel Details Grid */}
                    <Grid container spacing={2}>
                      {/* Reason */}
                      <Grid item xs={12}>
                        <Box display="flex" alignItems="flex-start" gap={1}>
                          <DescriptionIcon fontSize="small" color="action" sx={{ mt: 0.5, flexShrink: 0 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                              Reason for Cancellation
                            </Typography>
                            <Typography
                              variant="body1"
                              color="error.dark"
                              sx={{
                                mt: 0.5,
                                ml: 2,
                                fontStyle: 'italic',
                                lineHeight: 1.5,
                                borderLeft: '2px solid',
                                borderColor: 'error.light',
                                pl: 2,
                              }}
                            >
                              "{event?.cancel_reason || 'No reason provided'}"
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Cancelled By */}
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Person fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                              Cancelled By
                            </Typography>
                            <Typography variant="body1" color="text.primary" fontWeight={600}>
                              {event?.cancel_by || 'Unknown User'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Date */}
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <EventAvailable fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                              Cancelled On
                            </Typography>
                            <Typography variant="body1" color="text.primary" fontWeight={600}>
                              {event?.cancel_date
                                ? new Date(event.cancel_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                                : 'Date unavailable'
                              }
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Warning Banner */}
                    <Box
                      mt={2}
                      p={1.5}
                      borderRadius={2}
                      bgcolor="warning.lighter"
                      border="1px solid"
                      borderColor="warning.light"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <WarningAmber fontSize="small" color="warning" />
                      <Typography variant="body2" color="warning.dark">
                        This event cannot be resumed. All registrations are cancelled.
                      </Typography>
                    </Box>
                  </Box>
                
          )}

          {/* Tab 3: Reviews */}
          {tabIndex === 3 && (
            <Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                ⭐ Reviews & Feedback
              </Typography>

              {/* Submit Review */}
              {/* <Paper sx={{ p: 3, mb: 3, borderRadius: 3, backgroundColor: "#f0f7ff" }}>
                     <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                       {editingReviewId ? "Edit Your Review" : "Share Your Experience"}
                     </Typography>
                     <Rating
                       value={userRating}
                       onChange={(e, newValue) => setUserRating(newValue)}
                       size="large"
                       sx={{ mb: 1 }}
                     />
                     <TextField
                       placeholder="Write your review here..."
                       multiline
                       rows={3}
                       fullWidth
                       variant="outlined"
                       value={userComment}
                       onChange={(e) => setUserComment(e.target.value)}
                       sx={{
                         mt: 1,
                         "& .MuiOutlinedInput-root": {
                           borderRadius: 2,
                           backgroundColor: "white",
                         },
                       }}
                     />
                     <Box mt={2} display="flex" gap={2}>
                       {editingReviewId && (
                         <Button
                           variant="outlined"
                           color="error"
                           onClick={handleCancelEdit}
                           sx={{ fontWeight: 600, borderRadius: 2 }}
                         >
                           Cancel
                         </Button>
                       )}
                       <Button
                         variant="contained"
                         color="primary"
                         startIcon={<SendIcon />}
                         onClick={handleSubmitReview}
                         disabled={!userRating && !userComment.trim()}
                         sx={{
                           fontWeight: 600,
                           borderRadius: 2,
                           px: 3,
                         }}
                       >
                         {editingReviewId ? "Update Review" : "Submit Review"}
                       </Button>
                     </Box>
                   </Paper> */}

              {/* Reviews List */}
              {loadingReviews ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress size={24} />
                </Box>
              ) : reviews.length > 0 ? (
                <List disablePadding>
                  {reviews.map((review) => (
                    <Paper
                      key={review.id}
                      variant="outlined"
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        borderColor: "divider",
                        backgroundColor: "background.paper",
                      }}
                    >
                      <Box display="flex" gap={2}>
                        <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                          {review.name[0]}
                        </Avatar>
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontWeight="600">{review.name}</Typography>
                            <Rating value={review.rating} readOnly size="small" />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.created_at).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {review.text}
                          </Typography>
                        </Box>
                        {/* Edit Button - Only for user's own review */}
                        {/* {review.name === "You" && (
                               <IconButton
                                 size="small"
                                 onClick={() => handleEdit(review)}
                                 sx={{ alignSelf: "flex-start" }}
                               >
                                 <EditIcon fontSize="small" color="primary" />
                               </IconButton>
                             )} */}
                      </Box>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
                  No reviews yet. Be the first to leave one!
                </Typography>
              )}
            </Box>
          )}

          {/* Tab 4: Overview */}
          {tabIndex === 4 && (
            <Box sx={{ padding: 2, bgcolor: "#fff", borderRadius: 2, boxShadow: 1, marginTop: 3 }}>
              {/* Title */}
              <Typography variant="h5" fontWeight={600} mb={3} color="primary" display="flex" alignItems="center" gap={1}>
                <Insights fontSize="large" /> 📊 Event Overview
              </Typography>

              {/* Stats Cards */}
              <Grid container spacing={3} mb={4}>
                {overviewStats.map((stat, i) => (
                  <Grid size={{ md: 6 }} item xs={12} sm={6} md={3} key={i}>
                    <Card
                      sx={{
                        textAlign: "center",
                        borderRadius: 3,
                        boxShadow: 3,
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" color="text.secondary" display="flex" alignItems="center" justifyContent="center">
                          {stat.icon || null} {stat.label}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color={stat.color}>
                          {stat.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Charts Grid */}
              <Grid container spacing={4}>
                {/* Pie Chart: Attendance */}
                <Grid size={{ md: 6 }} item xs={12} md={6}>
                  <Card sx={{ borderRadius: 4, boxShadow: 3,height: 480, py: 5 }}>
                    <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
                      🎯 Attendance Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Attended", value: registeredUsers.filter((u) => u.is_attend).length },
                            { name: "Not Attended", value: registeredUsers.filter((u) => !u.is_attend).length },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            <Cell key="attended" fill="#388e3c" />,
                            <Cell key="not-attended" fill="#d32f2f" />,
                          ]}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} people`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>

                {/* Bar Chart: Simulated Registration Trend */}
                <Grid size={{ md: 6 }} item xs={12} md={6}>
                  <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, height: 300 }}>
                    <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
                      📈 Registration Trend (Last 7 Days)
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={(() => {
                          const trend = [];
                          const today = new Date();
                          for (let i = 6; i >= 0; i--) {
                            const date = new Date(today);
                            date.setDate(today.getDate() - i);
                            const dateString = date.toISOString().split("T")[0];
                            // Simulate registrations (you can replace with real data)
                            const count = Math.floor(Math.random() * 5) + 1;
                            trend.push({ date: dateString.slice(5), count });
                          }
                          return trend;
                        })()}
                        barSize={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} registrations`, ""]} />
                        <Legend />
                        <Bar dataKey="count" fill="#1976d2" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>
              </Grid>

              {/* Summary Card */}
              <Card
                sx={{
                  mt: 4,
                  borderRadius: 4,
                  boxShadow: 3,
                  backgroundColor: "white",
                  border: "1px solid #e3f2fd",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="primary"
                    display="flex"
                    alignItems="center"
                    gutterBottom
                  >
                    <Insights fontSize="small" sx={{ mr: 1 }} />
                    Event Summary
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: "divider" }} />
                  <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                    This event had a total of{" "}
                    <strong style={{ color: "#1976d2", fontWeight: 600 }}>
                      {registeredUsers.length}
                    </strong>{" "}
                    registrations, with{" "}
                    <strong style={{ color: "#2e7d32", fontWeight: 600 }}>
                      {registeredUsers.filter((u) => u.is_attend).length}
                    </strong>{" "}
                    attendees. The average rating from participants is{" "}
                    <strong style={{ color: "#ed6c02", fontWeight: 600 }}>
                      {overviewStats[3].value}
                    </strong>
                    .
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Attendance Confirmation Modal */}
      <Dialog
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "primary.main", borderBottom: "1px solid #e0e0e0" }}>
          Confirm Attendance
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography mb={2}>Mark this user as attended?</Typography>
          {selectedUser && (
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              p={2}
              border="1px solid #e0e0e0"
              borderRadius={2}
              bgcolor="#f9f9f9"
            >
              <Avatar sx={{ bgcolor: "primary.main" }}>
                {selectedUser.details?.first_name?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {selectedUser.details?.first_name} {selectedUser.details?.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registered: {selectedUser.registered_time}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmModal(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleMarkAttendance} variant="contained" color="success">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventViewDialog;