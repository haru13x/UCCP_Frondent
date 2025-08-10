// src/component/event/EventSlideDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Rating,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Group as GroupIcon,
  Description as DescriptionIcon,
  Star as StarIcon,
  Send as SendIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import Slide from "@mui/material/Slide";
import { useSnackbar } from "./SnackbarProvider ";
import { UseMethod } from "../../composables/UseMethod";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const EventSlideDialog = ({
  open,
  onClose,
  event,
  tabIndex,
  setTabIndex,
  qrPath,
  loadingQR,
  handleGenerateQR,
  printImage,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const apiUrl = process.env.REACT_APP_API_URL;
  const { showSnackbar } = useSnackbar();

  // Review State
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [hasFetched, setHasFetched] = useState(false); // Prevent duplicate fetch
  const now = new Date();
  const eventStart = new Date(`${event?.start_date}T${event?.start_time}`);
  const hasEventEnded = () => {
    return now > eventStart;
  };

  // Fetch reviews only when Reviews tab is selected
  useEffect(() => {
    if (!open || tabIndex !== 1 || !event?.id || hasFetched) return;

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

          // If user has a review, pre-fill it for editing
          const myReview = formatted.find((r) => r.name === "You");
          if (myReview) {
            setUserRating(myReview.rating);
            setUserComment(myReview.text);
          }
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
        showSnackbar({ message: "Could not load reviews.", type: "error" });
      } finally {
        setLoadingReviews(false);
        setHasFetched(true);
      }
    };

    fetchReviews();
  }, [open, tabIndex, event?.id, hasFetched, showSnackbar]);

  // Reset fetch state when dialog closes
  useEffect(() => {
    if (!open) {
      setHasFetched(false);
      setReviews([]);
      setEditingReviewId(null);
      setUserComment("");
      setUserRating(0);
    }
  }, [open]);

  const handleSubmitReview = async () => {
    if (!userRating && !userComment.trim()) return;

    const payload = {
      reviewId : editingReviewId,
      rating: userRating,
      comment: userComment.trim(),
    };

    try {
      const method = editingReviewId ? "put" : "post";
      const endpoint = `events/${event.id}/review`;

      const res = await UseMethod(method, endpoint, payload);

      if (res.status === 200 || res.status === 201) {
        const newReview = {
          id: res.data.review.id,
          name: "You",
          rating: userRating,
          text: userComment.trim(),
          created_at: new Date().toISOString(),
        };

        // Update or add review
        if (editingReviewId) {
          setReviews((prev) =>
            prev.map((r) => (r.id === editingReviewId ? newReview : r))
          );
        } else {
          setReviews((prev) => [newReview, ...prev]);
        }

        // Reset form
        setUserComment("");
        setUserRating(0);
        setEditingReviewId(null);
        showSnackbar({
          message: editingReviewId
            ? "Review updated!"
            : "Thank you for your review!",
          type: "success",
        });
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to submit review";
      showSnackbar({ message, type: "error" });
    }
  };

  const handleEdit = (review) => {
    setUserComment(review.text);
    setUserRating(review.rating);
    setEditingReviewId(review.id);
   
  };

  const handleCancelEdit = () => {
    setUserComment("");
    setUserRating(0);
    setEditingReviewId(null);
  };

  const handleTabChange = (e, newValue) => setTabIndex(newValue);

  const handleRegister = async () => {
    try {
      const res = await UseMethod("post", `event-registration/${event?.id}`);
      if (res && res.status === 200) {
        showSnackbar({ message: "Registered successfully!", type: "success" });
        onClose();
      } else {
        showSnackbar({
          message: "Registration failed. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      showSnackbar({ message: "Something went wrong.", type: "error" });
    }
  };

  return (
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
          width: { xs: "100%", sm: "90%", md: "60%" },
          maxWidth: "100%",
          borderRadius: { xs: 0, sm: 3 },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#007bb6",
          color: "white",
          px: 3,
          py: 2,
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          startIcon={<ArrowBackIcon />}
          sx={{
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            whiteSpace: "nowrap",
          }}
        >
          Back
        </Button>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            "& .MuiTab-root": {
              minWidth: 120,
              fontWeight: 500,
              textTransform: "none",
              fontSize: "15px",
            },
            "& .Mui-selected": { fontWeight: 700 },
            "& .MuiTabs-indicator": { backgroundColor: "#ffc107" },
          }}
        >
          <Tab label="Event Details" />
          {event?.is_registered === 1 && (
            <Tab label="Reviews" icon={<StarIcon fontSize="small" />} iconPosition="end" />
          )}
        </Tabs>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Tab 0: Event Details */}
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
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                    <CalendarIcon fontSize="small" color="primary" />
                    <Typography variant="body2">
                      <strong>Date:</strong> {event?.start_date} to {event?.end_date}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                    <TimeIcon fontSize="small" color="primary" />
                    <Typography variant="body2">
                      <strong>Time:</strong> {event?.start_time} – {event?.end_time}
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
            </Paper>
          </Box>
        )}

        {/* Tab 1: Reviews */}
        {tabIndex === 1 && (
          <Box>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              ⭐ Reviews & Feedback
            </Typography>

            {/* Submit Review */}
            {hasEventEnded() && event.is_registered === 1 ? (
              <Paper sx={{ p: 3, mb: 3, borderRadius: 3, backgroundColor: "#f0f7ff" }}>
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
              </Paper>
            ) :
              <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
                You can't Review yet Event not End Yet
              </Typography>
            }
           
            
            {  loadingReviews ? (
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
                      {review.name === "You" && (
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(review)}
                          sx={{ alignSelf: "flex-start" }}
                        >
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      )}
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
      </DialogContent>

      {/* Footer Action */}
      <DialogActions
        sx={{
          p: 2,
          borderTop: "1px solid #dee2e6",
          backgroundColor: "#ffffff",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth={isMobile}
          size="large"
          onClick={handleRegister}
          disabled={event?.is_registered === 1}
          sx={{
            fontWeight: "bold",
            fontSize: "16px",
            py: 1.5,
            borderRadius: 2,
            backgroundColor: event?.is_registered === 1 ? "#6c757d" : "#007bb6",
            "&:hover": {
              backgroundColor: event?.is_registered === 1 ? "#5a6268" : "#005a87",
            },
          }}
        >
          {event?.is_registered === 1 ? "Already Registered" : "Register for This Event"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventSlideDialog;