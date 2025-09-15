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
  LinearProgress,
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
  Details,

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
import EventProgramFormDialog from "./EventProgramFormDialog";
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
  const [reviews, setReviews] = useState([]);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
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
  const [openProgramDialog, setOpenProgramDialog] = useState(false);
  const [programForm, setProgramForm] = useState({
    start_time: "",
    end_time: "",
    activity: "",
    speaker: "",
  });
  const [programs, setPrograms] = useState(event?.programs || []);
  const now = new Date();
  const eventStart = new Date(`${event?.start_date}T${event?.start_time}`);
  const hasEventEnded = () => {
    return now > eventStart;
  };

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
               if (res?.status === 200) {
          let reviewsData = [];
          
          // Handle both response formats: {reviews: []} or {review: {}}
          if (Array.isArray(res.data.reviews)) {
            reviewsData = res.data.reviews;
          } else if (res.data.review) {
            // Single review object - convert to array
            reviewsData = [res.data.review];
          }
          
          const currentUserId = localStorage.getItem("userId");
          const formatted = reviewsData.map((r) => ({
            id: r.id,
            user_id: r.user_id,
            user_name: r.user?.name || "Anonymous",
            rating: r.rating,
            comment: r.comment || r.text,
            category_ratings: r.category_ratings || null,
            created_at: r.created_at,
          }));
          setReviews(formatted);

          // If user has a review, mark as reviewed but don't auto-edit
          

        }
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
  const storedUser = useMemo(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }, [open]); // Re-check when dialog opens
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
          width: { xs: "100%", sm: "90%", md: "65%" },
          maxWidth: "100%",

        },
      }}
    >
        {/* Modern Header */}
        <DialogTitle
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(15px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            py: 1.5,
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            minHeight: "auto",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)",
            },
          }}
        >
          <Button
            onClick={onClose}
            startIcon={<ArrowBackSharp />}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2,
              borderColor: "rgba(102, 126, 234, 0.3)",
              color: "#667eea",
              fontWeight: 600,
              px: 2,
              py: 0.5,
              fontSize: "0.8rem",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#667eea",
                backgroundColor: "rgba(102, 126, 234, 0.1)",
              },
            }}
          >
            Back
          </Button>

          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                minWidth: 90,
                minHeight: 40,
                fontWeight: 500,
                fontSize: "0.75rem",
                color: "#64748b",
                textTransform: "none",
                borderRadius: 2,
                mx: 0.25,
                py: 0.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                  color: "#667eea",
                },
              },
              "& .Mui-selected": {
                fontWeight: 600,
                color: "#667eea !important",
                backgroundColor: "rgba(102, 126, 234, 0.15)",
              },
              "& .MuiTabs-indicator": {
                height: 2,
                borderRadius: 2,
                background: "linear-gradient(90deg, #667eea, #764ba2)",
              },
            }}
          >
            <Tab icon={<EventIcon sx={{ fontSize: 16 }} />} label="Details" />
            <Tab icon={<QRCodeIcon sx={{ fontSize: 16 }} />} label="QR Code" />
            <Tab icon={<GroupIcon sx={{ fontSize: 16 }} />} label="Registered" />
            <Tab icon={<Comment sx={{ fontSize: 16 }} />} label="Reviews" />
            <Tab icon={<Insights fontSize="small" />} label="Overview" />
          </Tabs>
        </DialogTitle>

        <DialogContent
          sx={{
            overflowY: "auto",
            p: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
            backdropFilter: "blur(15px)",
          }}
        >
          {/* Tab 0: Details */}
          {tabIndex === 0 && (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {/* Hero Image Section */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 200, md: 250 },
                  borderRadius: 3,
                  overflow: "hidden",
                  mb: 2.5,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(45deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))",
                    zIndex: 1,
                  },
                }}
              >
                {event?.image ? (
                  <img
                    src={`${apiUrl}/storage/${event.image}`}
                    alt={event.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "0%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                      color: "#64748b",
                      fontSize: "1.1rem",
                      fontWeight: 500,
                    }}
                  >
                    📸 No Image Available
                  </Box>
                )}
              </Box>

              {/* Main Details Card */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.85)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "3px",
                    background: "linear-gradient(90deg, #667eea, #764ba2)",
                  },
                }}
              >
                {/* Event Header */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1.5,
                      fontSize: { xs: "1.5rem", md: "2rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    {event?.title}
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
                    <Chip
                      icon={<Person />}
                      label={`Organized by ${event?.organizer}`}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "rgba(102, 126, 234, 0.3)",
                        color: "#667eea",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        "& .MuiChip-icon": { color: "#667eea", fontSize: "1rem" },
                      }}
                    />
                    {event?.location?.name && (
                      <Chip
                        icon={<LocationIcon />}
                        label={event.location.name}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: "rgba(118, 75, 162, 0.3)",
                          color: "#764ba2",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          "& .MuiChip-icon": { color: "#764ba2", fontSize: "1rem" },
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Event Details Grid */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      p: 2,
                      borderRadius: 2,
                      background: "rgba(102, 126, 234, 0.05)",
                      border: "1px solid rgba(102, 126, 234, 0.1)",
                      height: "100%",
                    }}>


                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                        <CalendarIcon sx={{ color: "#667eea", fontSize: 20 }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                            Date Range
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event?.startDate} to {event?.endDate}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <TimeIcon sx={{ color: "#667eea", fontSize: 20 }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                            Time
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event?.startTime} – {event?.endTime}
                          </Typography>
                        </Box>

                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1.5 }}>

                        <TimeIcon sx={{ color: "#667eea", fontSize: 20 }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                            Contact Number
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event?.contact || "Not provided"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      p: 2,
                      borderRadius: 2,
                      background: "rgba(118, 75, 162, 0.05)",
                      border: "1px solid rgba(118, 75, 162, 0.1)",
                      height: "100%",
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <GroupIcon sx={{ color: "#22c55e", fontSize: 20 }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                            Participant Types
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event?.event_types?.map((type) => type.code).join(", ") || "Open to all"}
                          </Typography>
                        </Box>
                      </Box>
                    

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                      <LocationIcon sx={{ color: "#764ba2", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                          Venue
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event?.venue || "TBA"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <LocationIcon sx={{ color: "#764ba2", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                          Address
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event?.address || "Address not specified"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>



              </Grid>

              {/* Description Section */}
              <Box sx={{
                p: 2.5,
                borderRadius: 2,
                background: "rgba(255, 255, 255, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(8px)",
              }}>
                <Typography variant="subtitle1" sx={{
                  fontWeight: 600,
                  color: "#334155",
                  mb: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "1rem",
                }}>
                  📝 Event Description
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                    fontSize: "0.9rem",
                  }}
                >
                  {event?.description || "No description available for this event."}
                </Typography>
              </Box>




              {event?.status === 'Cancelled' && (
                <Box
                  mt={2}
                  p={2}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: 'error.lighter',
                    border: '1px solid',
                    borderColor: 'error.light',
                    boxShadow: '0 2px 8px rgba(244, 67, 54, 0.08)',
                    borderLeft: '3px solid',
                    borderLeftColor: 'error.main',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(244, 67, 54, 0.15)',
                    },
                  }}
                >
                  {/* Header */}
                  <Box display="flex" alignItems="center" gap={1} mb={1.5}>
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
                  <Grid container spacing={1.5}>
                    {/* Reason */}
                    <Grid size={{ sm: 6 }} item xs={12}>
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
                    <Grid size={{ sm: 3 }} item xs={12} sm={6}>
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
                    <Grid size={{ sm: 3 }} item xs={12} sm={6}>
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
        {/* {tabIndex === 1 && (
            <Box textAlign="center" p={3}>
              {loadingQR ? (
                <CircularProgress />
              ) : <Paper
                sx={{
                  mt: 1,
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                {storedUser && storedUser.id !== event?.created_by && (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<EventAvailable />}
                    onClick={() => setOpenProgramDialog(true)}
                    sx={{ mt: 2, ml: 2 }}
                  >
                    📅 Add Program
                  </Button>
                )}
              </Paper>}
            </Box>
          )} */}
        {/* Tab 1: QR Code */}
        {tabIndex === 1 && (
          <Box textAlign="center" p={2}>
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
                    height: { xs: "30vh", md: "35vh" },
                    borderRadius: 2,
                    border: "1px solid #ddd",
                    boxShadow: 1,
                  }}
                />
                <Box mt={1.5} display="flex" justifyContent="center" gap={1.5}>
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
              <Box mt={2.5}>
                <Typography color="text.secondary" mb={1.5}>
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

        {tabIndex === 2 && event?.status !== 'Cancelled' && (
          <Box
            sx={{
              padding: { xs: 1.5, sm: 2 },
              bgcolor: "#ffffff",
              borderRadius: 3,
              boxShadow: 1,
              marginTop: 2,
            }}
          >
            {/* Search & Actions Bar */}
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={1.5}
              mb={2}
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
                  maxWidth: { xs: "100%", sm: 350 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 6,
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
                    borderRadius: 6,
                    textTransform: "none",
                    fontWeight: 500,
                    minWidth: 80,
                    fontSize: "0.875rem",
                  }}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setModalOpen(true)}
                  sx={{
                    borderRadius: 6,
                    textTransform: "none",
                    fontWeight: 500,
                    borderColor: "primary.main",
                    color: "primary.main",
                    fontSize: "0.875rem",
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
                {[...Array(4)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2,
                      bgcolor: "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <Skeleton variant="circular" width={44} height={44} sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton variant="text" width="65%" height={24} sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
                      <Skeleton variant="text" width="45%" height={18} sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
                    </Box>
                    <Skeleton variant="rectangular" width={80} height={26} sx={{ borderRadius: 1.5, bgcolor: "rgba(0, 0, 0, 0.06)" }} />
                  </Box>
                ))}
              </Box>
            ) : registeredUsers.length === 0 ? (
              /* Empty State */
              <Box
                textAlign="center"
                p={4}
                sx={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)",
                  },
                }}
              >
                <Box sx={{ fontSize: "3rem", mb: 2, opacity: 0.7 }}>👥</Box>
                <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontSize: "1.1rem", fontWeight: 600 }}>
                  No Registered Users
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3} sx={{ maxWidth: 300, mx: "auto" }}>
                  {search
                    ? "No users match your search criteria. Try adjusting your query."
                    : "This event doesn't have any registrations yet. Be the first to register someone!"}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setModalOpen(true)}
                  sx={{
                    borderRadius: 2,
                    fontSize: "0.875rem",
                    px: 3,
                    py: 1,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  ✨ Register First User
                </Button>
              </Box>
            ) : (
              /* User List */
              <List sx={{ borderRadius: 2, overflow: "hidden", p: 0 }}>
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
                        p: 0,
                        borderRadius: 3,
                        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        overflow: "hidden",
                        position: "relative",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "4px",
                          height: "100%",
                          background: user.is_attend 
                            ? "linear-gradient(180deg, #10b981 0%, #059669 100%)"
                            : "linear-gradient(180deg, #f59e0b 0%, #d97706 100%)",
                        },
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)",
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
                          justifyContent: "space-between",
                          alignItems: { xs: "stretch", sm: "center" },
                          gap: 2,
                          p: 2.5,
                          pl: 3,
                          mb: 0,
                          borderRadius: 0,
                          border: "none",
                          bgcolor: "transparent",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {/* Avatar */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box sx={{ position: "relative" }}>
                            <Avatar
                              sx={{
                                width: 56,
                                height: 56,
                                fontSize: "1.2rem",
                                fontWeight: 700,
                                background: user.is_attend 
                                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                  : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                                border: "3px solid rgba(255, 255, 255, 0.8)",
                              }}
                            >
                              {user.details?.first_name?.[0]?.toUpperCase() || "U"}
                            </Avatar>
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: -2,
                                right: -2,
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                bgcolor: user.is_attend ? "#10b981" : "#f59e0b",
                                border: "2px solid white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.7rem",
                              }}
                            >
                              {user.is_attend ? "✓" : "⏳"}
                            </Box>
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1.1rem", mb: 0.5, color: "#1f2937" }}>
                              {user.details?.first_name} {user.details?.last_name}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: user.is_attend ? "#059669" : "#d97706", 
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px"
                            }}>
                              {user.is_attend ? "Attended" : "Registered"}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Contact Info */}
                        <Box sx={{ textAlign: { xs: "center", sm: "left" }, minWidth: 140 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <PhoneIcon sx={{ fontSize: "0.9rem", color: "#6b7280" }} />
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                              {user.details?.phone_number || "N/A"}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Person sx={{ fontSize: "0.9rem", color: "#6b7280" }} />
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                              {user.details?.sex?.name || "N/A"}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Registration Date */}
                        <Box sx={{ textAlign: { xs: "center", sm: "left" }, minWidth: 120 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <CalendarIcon sx={{ fontSize: "0.9rem", color: "#6b7280" }} />
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                              {new Date(user.registered_time).toLocaleDateString()}
                            </Typography>
                          </Box>
                          {user.is_attend ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CheckCircle sx={{ fontSize: "0.9rem", color: "#10b981" }} />
                              <Typography variant="body2" sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#10b981" }}>
                                {new Date(user?.attend_time).toLocaleDateString()}
                              </Typography>
                            </Box>
                          ) : (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="body2" sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>
                                Not Attending Yet
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Attendance Status */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                          <Box
                            sx={{
                              px: 2,
                              py: 1,
                              borderRadius: 2,
                              background: user.is_attend 
                                ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)"
                                : "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)",
                              border: `1px solid ${user.is_attend ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)"}`,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              minWidth: 120,
                              justifyContent: "center",
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: user.is_attend ? "#10b981" : "#f59e0b",
                                animation: user.is_attend ? "none" : "pulse 2s infinite",
                                "@keyframes pulse": {
                                  "0%, 100%": { opacity: 1 },
                                  "50%": { opacity: 0.5 },
                                },
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: user.is_attend ? "#059669" : "#d97706",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {user.is_attend ? "Present" : "Pending"}
                            </Typography>
                          </Box>
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
                mt={3}
                gap={2}
                flexWrap="wrap"
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  variant="outlined"
                  size="small"
                  startIcon={<ArrowBackSharp fontSize="small" />}
                  sx={{
                    borderRadius: 2,
                    fontSize: "0.85rem",
                    px: 2.5,
                    py: 1,
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                    color: "#6366f1",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      color: "white",
                      border: "1px solid transparent",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
                    },
                    "&:disabled": {
                      opacity: 0.4,
                      transform: "none",
                    },
                  }}
                >
                  Previous
                </Button>

                <Box
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    {currentPage}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem", opacity: 0.8 }}>
                    of {totalPages}
                  </Typography>
                </Box>

                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowBackSharp fontSize="small" sx={{ transform: "rotate(180deg)" }} />}
                  sx={{
                    borderRadius: 2,
                    fontSize: "0.85rem",
                    px: 2.5,
                    py: 1,
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                    color: "#6366f1",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      color: "white",
                      border: "1px solid transparent",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
                    },
                    "&:disabled": {
                      opacity: 0.4,
                      transform: "none",
                    },
                  }}
                >
                  Next
                </Button>
              </Box>
            )}
          </Box>
        )} {tabIndex === 2 && event?.status === 'Cancelled' && (

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
         <Box sx={{mt:2}}>
            



              <Box >
                {reviews.length > 0 ? reviews.map((review) => (
                  <Card key={review.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight="600" sx={{ color: "#1976d2", fontSize: '0.9rem' }}>
                          Review
                        </Typography>
                      
                      </Box>
                      
                      {/* Display ratings */}
                      {review.category_ratings && (
                        <Box sx={{ 
                          mb: 2, 
                          p: 2, 
                          borderRadius: 2, 
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          border: '1px solid rgba(0, 0, 0, 0.08)'
                        }}>
                          <Typography 
                            variant="subtitle2" 
                            fontWeight="600" 
                            sx={{ 
                              fontSize: '0.9rem', 
                              mb: 1.5, 
                              color: 'text.primary',
                              letterSpacing: '0.5px'
                            }}
                          >
                            📊 Ratings
                          </Typography>
                          <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                            gap: 1.5 
                          }}>
                            {Object.entries(review.category_ratings).map(([category, rating]) => (
                              rating > 0 && (
                                <Box 
                                  key={category} 
                                  sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'flex-start', 
                                    gap: 0.5,
                                    p: 1,
                                    borderRadius: 1,
                                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                      transform: 'translateY(-1px)'
                                    }
                                  }}
                                >
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      fontSize: '0.75rem', 
                                      textTransform: 'capitalize',
                                      fontWeight: 500,
                                      color: 'text.secondary'
                                    }}
                                  >
                                    {category}
                                  </Typography>
                                  <Rating 
                                    value={rating} 
                                    readOnly 
                                    size="small" 
                                    sx={{ 
                                      fontSize: '1rem',
                                      '& .MuiRating-iconFilled': {
                                        color: '#ffa726'
                                      },
                                      '& .MuiRating-iconEmpty': {
                                        color: 'rgba(0, 0, 0, 0.12)'
                                      }
                                    }} 
                                  />
                                </Box>
                              )
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      {/* Display comment */}
                      {review.comment && (
                        <Box sx={{
                          mt: 2,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          position: 'relative',
                          '&::before': {
                            content: '"💬"',
                            position: 'absolute',
                            top: -8,
                            left: 12,
                            backgroundColor: 'white',
                            padding: '0 4px',
                            fontSize: '0.8rem'
                          }
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: '0.9rem', 
                              color: 'text.primary',
                              lineHeight: 1.6,
                              fontStyle: 'italic',
                              position: 'relative',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: -8,
                                top: 0,
                                bottom: 0,
                                width: 3,
                                backgroundColor: 'primary.main',
                                borderRadius: 1
                              },
                              pl: 2
                            }}
                          >
                            {review.comment}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                )) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No reviews yet for this event.
                    </Typography>
                  </Box>
                )}
              </Box>
          

            
           
            
      
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
                <Card sx={{ borderRadius: 4, boxShadow: 3, height: 480, py: 5 }}>
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
    </Dialog >

      {/* Attendance Confirmation Modal */ }
      < Dialog
  open = { confirmModal }
  onClose = {() => setConfirmModal(false)}
maxWidth = "sm"
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
      </Dialog >
  <EventProgramFormDialog
    open={openProgramDialog}
    onClose={() => setOpenProgramDialog(false)}
    eventId={event?.id}
    initialPrograms={event?.programs || []}
    initialSponsors={event?.sponsors || []}
  />


    </>
  );
};

export default EventViewDialog;