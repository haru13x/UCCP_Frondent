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
  Avatar,
  Divider,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Stack,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Group as GroupIcon,
  Star as StarIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Place as VenueIcon,
  RecordVoiceOver as SpeakerIcon,
  Event as EventIcon,
  Restaurant as FoodIcon,
  Hotel as AccommodationIcon,
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
  const [userRatings, setUserRatings] = useState({
    venue: 0,
    speaker: 0,
    events: 0,
    foods: 0,
    accommodation: 0
  });
  const [userComment, setUserComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [hasFetched, setHasFetched] = useState(false); // Prevent duplicate fetch
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const now = new Date();
  const eventStart = new Date(`${event?.start_date}T${event?.start_time}`);
  const hasEventEnded = () => {
    if (!event?.end_date || !event?.end_time) return false;
    const eventEnd = new Date(`${event.end_date}T${event.end_time}`);
    return now > eventEnd;
  };

  // Fetch reviews only when Reviews tab is selected
  useEffect(() => {
    if (!open || tabIndex !== 1 || !event?.id || hasFetched) return;

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
          
          // Filter to only show current user's reviews
          const userReviews = reviewsData.filter(r => 
            r.user_id === parseInt(currentUserId) || r.is_mine === true
          );
          
          const formatted = userReviews.map((r) => ({
            id: r.id,
            user_id: r.user_id,
            user_name: "You",
            rating: r.rating,
            comment: r.comment || r.text,
            category_ratings: r.category_ratings || null,
            created_at: r.created_at,
          }));
          setReviews(formatted);

          // If user has a review, mark as reviewed but don't auto-edit
          const myReview = formatted.find((r) => r.user_name === "You");
          if (myReview) {
            setHasUserReviewed(true);
            // Don't auto-set editing mode - user needs to click edit button
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
      setUserRatings({
        venue: 0,
        speaker: 0,
        events: 0,
        foods: 0,
        accommodation: 0
      });
      setHasUserReviewed(false);
      setShowEditForm(false);
    }
  }, [open]);

  const handleSubmitReview = async () => {
    const hasAnyRating = Object.values(userRatings).some(rating => rating > 0);
    if (!hasAnyRating && !userComment.trim()) return;

    // Check if user already has a review and prevent new submission
    const existingReview = reviews.find(r => r.user_name === "You");
    if (existingReview && !editingReviewId) {
      showSnackbar("You have already submitted a review for this event. You can only edit your existing review.", "warning");
      return;
    }

    // Calculate overall rating as average of category ratings
    const ratingValues = Object.values(userRatings).filter(rating => rating > 0);
    const overallRating = ratingValues.length > 0 
      ? Math.round(ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length)
      : 0;

    const payload = {
      reviewId: editingReviewId,
      rating: overallRating,
      category_ratings: userRatings,
      comment: userComment.trim(),
    };

    try {
      const method = editingReviewId ? "put" : "post";
      const endpoint = `events/${event.id}/review`;

      const res = await UseMethod(method, endpoint, payload);

      if (res.status === 200 || res.status === 201) {
        const reviewData = res.data.review || res.data.reviewData || res.data;
        const newReview = {
          id: reviewData.id,
          user_id: reviewData.user_id,
          user_name: "You",
          rating: reviewData.rating || overallRating,
          category_ratings: reviewData.category_ratings || userRatings,
          comment: reviewData.comment || userComment.trim(),
          created_at: reviewData.created_at || new Date().toISOString(),
        };

        // Update or add review
        if (editingReviewId) {
          setReviews((prev) =>
            prev.map((r) => (r.id === editingReviewId ? newReview : r))
          );
        } else {
          setReviews((prev) => [newReview, ...prev]);
          setHasUserReviewed(true);
        }

        // Reset form
        setUserComment("");
        setUserRatings({
          venue: 0,
          speaker: 0,
          events: 0,
          foods: 0,
          accommodation: 0
        });
        setEditingReviewId(null);
        setShowEditForm(false);
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
    setUserComment(review.comment);
    if (review.category_ratings) {
      setUserRatings(review.category_ratings);
    } else {
      // Fallback for old single rating system
      setUserRatings({
        venue: review.rating || 0,
        speaker: review.rating || 0,
        events: review.rating || 0,
        foods: review.rating || 0,
        accommodation: review.rating || 0
      });
    }
    setEditingReviewId(review.id);
    setShowEditForm(true);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setShowEditForm(false);
    setUserComment("");
    setUserRatings({
      venue: 0,
      speaker: 0,
      events: 0,
      foods: 0,
      accommodation: 0
    });
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
          py: 1,
         
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
          size="small"
          sx={{
            minHeight: 36,
            "& .MuiTab-root": {
              minWidth: 80,
              minHeight: 36,
              padding: "6px 12px",
              fontWeight: 500,
              textTransform: "none",
              fontSize: "13px",
            },
            "& .Mui-selected": { fontWeight: 700 },
            "& .MuiTabs-indicator": { backgroundColor: "#ffc107" },
          }}
        >
          <Tab label="Event Details" />
          {event?.is_registered === 1 && (
            <Tab label="My Review" icon={<StarIcon fontSize="small" />} iconPosition="end" />
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
                  {event?.location && (
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <LocationIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        <strong>Church Location:</strong> {event.location.name}
                      </Typography>
                    </Box>
                  )}
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
          <Box sx={{mt:2}}>
            



            {/* Display existing reviews first */}
            {hasEventEnded() && event.is_registered === 1 && hasUserReviewed && !showEditForm ? (
              <Box >
                {reviews.map((review) => (
                  <Card key={review.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight="600" sx={{ color: "#1976d2", fontSize: '0.9rem' }}>
                          Your Review
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                          onClick={() => handleEdit(review)}
                          sx={{ 
                            fontWeight: 600, 
                            borderRadius: 1.5, 
                            px: 1.5, 
                            fontSize: '0.75rem',
                            minWidth: 'auto'
                          }}
                        >
                          Edit
                        </Button>
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
                            📊 Your Ratings
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
                ))}
              </Box>
            ) : null}

            {/* Submit Review Form */}
            {hasEventEnded() && event.is_registered === 1 ? (
              (!hasUserReviewed && !showEditForm) ? (
                <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 2, }}>
                  <CardContent sx={{ p: 2 }}>
                   
                    
                    {/* Category Ratings */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="600" gutterBottom sx={{ mb: 1.5, fontSize: '0.9rem' }}>
                        Rate Different Aspects:
                      </Typography>
                      
                      <Stack spacing={1.5}>
                        {/* Venue Rating */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, backgroundColor: "#f8f9fa", borderRadius: 1.5 }}>
                          <VenueIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.8rem' }}>Venue</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Location, facilities, ambiance</Typography>
                          </Box>
                          <Rating
                            value={userRatings.venue}
                            onChange={(e, newValue) => setUserRatings(prev => ({ ...prev, venue: newValue || 0 }))}
                            size="medium"
                            sx={{ "& .MuiRating-iconFilled": { color: "#ff6d00" } }}
                          />
                        </Box>
                        
                        {/* Speaker Rating */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, backgroundColor: "#f8f9fa", borderRadius: 1.5 }}>
                          <SpeakerIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.8rem' }}>Speaker</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Presentation quality, knowledge</Typography>
                          </Box>
                          <Rating
                            value={userRatings.speaker}
                            onChange={(e, newValue) => setUserRatings(prev => ({ ...prev, speaker: newValue || 0 }))}
                            size="medium"
                            sx={{ "& .MuiRating-iconFilled": { color: "#ff6d00" } }}
                          />
                        </Box>
                        
                        {/* Events Rating */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, backgroundColor: "#f8f9fa", borderRadius: 1.5 }}>
                          <EventIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.8rem' }}>Events</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Organization, content, timing</Typography>
                          </Box>
                          <Rating
                            value={userRatings.events}
                            onChange={(e, newValue) => setUserRatings(prev => ({ ...prev, events: newValue || 0 }))}
                            size="medium"
                            sx={{ "& .MuiRating-iconFilled": { color: "#ff6d00" } }}
                          />
                        </Box>
                        
                        {/* Food Rating */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, backgroundColor: "#f8f9fa", borderRadius: 1.5 }}>
                          <FoodIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.8rem' }}>Food</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Quality, variety, service</Typography>
                          </Box>
                          <Rating
                            value={userRatings.foods}
                            onChange={(e, newValue) => setUserRatings(prev => ({ ...prev, foods: newValue || 0 }))}
                            size="medium"
                            sx={{ "& .MuiRating-iconFilled": { color: "#ff6d00" } }}
                          />
                        </Box>
                        
                        {/* Accommodation Rating */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, backgroundColor: "#f8f9fa", borderRadius: 1.5 }}>
                          <AccommodationIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.8rem' }}>Accommodation</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Comfort, cleanliness, service</Typography>
                          </Box>
                          <Rating
                            value={userRatings.accommodation}
                            onChange={(e, newValue) => setUserRatings(prev => ({ ...prev, accommodation: newValue || 0 }))}
                            size="medium"
                            sx={{ "& .MuiRating-iconFilled": { color: "#ff6d00" } }}
                          />
                        </Box>
                      </Stack>
                    </Box>
                    
                    {/* Comment Section */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="600" gutterBottom sx={{ fontSize: '0.9rem' }}>
                        Additional Comments:
                      </Typography>
                      <TextField
                        placeholder="Share your detailed thoughts and feedback..."
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            backgroundColor: "white",
                            fontSize: '0.85rem',
                            "&:hover fieldset": {
                              borderColor: "#1976d2",
                            },
                          },
                        }}
                      />
                    </Box>
                    
                    {/* Action Buttons */}
                    <Box display="flex" gap={1.5} justifyContent="flex-end">
                      {editingReviewId && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={handleCancelEdit}
                          size="small"
                          sx={{ fontWeight: 600, borderRadius: 1.5, px: 2, fontSize: '0.8rem' }}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SendIcon sx={{ fontSize: 16 }} />}
                        onClick={handleSubmitReview}
                        disabled={!Object.values(userRatings).some(rating => rating > 0) && !userComment.trim()}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: 1.5,
                          px: 2,
                          fontSize: '0.8rem',
                          background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                          boxShadow: "0 2px 4px 1px rgba(25, 118, 210, .2)",
                        }}
                      >
                        {editingReviewId ? "Update Review" : "Submit Review"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ) : showEditForm ? (
                <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="700" gutterBottom sx={{ color: "#1976d2", mb: 2, fontSize: '1rem' }}>
                      ✏️ Edit Your Review
                    </Typography>
                    
                    {/* Category Ratings */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="600" gutterBottom sx={{ mb: 1.5, fontSize: '0.9rem' }}>
                        Rate Different Aspects:
                      </Typography>
                      
                      <Stack spacing={1.5}>
                        {/* Venue Rating */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, backgroundColor: "#f8f9fa", borderRadius: 1.5 }}>
                          <VenueIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.8rem' }}>Venue</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Location, facilities, ambiance</Typography>
                          </Box>
                          <Rating
                            value={userRatings.venue}
                            onChange={(e, newValue) => setUserRatings(prev => ({ ...prev, venue: newValue || 0 }))}
                            size="medium"
                            sx={{ "& .MuiRating-iconFilled": { color: "#ff6d00" } }}
                          />
                        </Box>
                        
                        {/* Speaker Rating */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, backgroundColor: "#f8f9fa", borderRadius: 1.5 }}>
                          <SpeakerIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.8rem' }}>Speaker</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Presentation quality, knowledge</Typography>
                          </Box>
                          <Rating
                            value={userRatings.speaker}
                            onChange={(e, newValue) => setUserRatings(prev => ({ ...prev, speaker: newValue || 0 }))}
                            size="medium"
                            sx={{ "& .MuiRating-iconFilled": { color: "#ff6d00" } }}
                          />
                        </Box>
                        
                        {/* Events Rating */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, backgroundColor: "#f8f9fa", borderRadius: 1.5 }}>
                          <EventIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.8rem' }}>Events</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Organization, content, timing</Typography>
                          </Box>
                          <Rating
                            value={userRatings.events}
                            onChange={(e, newValue) => setUserRatings(prev => ({ ...prev, events: newValue || 0 }))}
                            size="medium"
                            sx={{ "& .MuiRating-iconFilled": { color: "#ff6d00" } }}
                          />
                        </Box>
                        
                        {/* Food Rating */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, backgroundColor: "#f8f9fa", borderRadius: 1.5 }}>
                          <FoodIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.8rem' }}>Food</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Quality, variety, service</Typography>
                          </Box>
                          <Rating
                            value={userRatings.foods}
                            onChange={(e, newValue) => setUserRatings(prev => ({ ...prev, foods: newValue || 0 }))}
                            size="medium"
                            sx={{ "& .MuiRating-iconFilled": { color: "#ff6d00" } }}
                          />
                        </Box>
                        
                        {/* Accommodation Rating */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, backgroundColor: "#f8f9fa", borderRadius: 1.5 }}>
                          <AccommodationIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.8rem' }}>Accommodation</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Comfort, cleanliness, service</Typography>
                          </Box>
                          <Rating
                            value={userRatings.accommodation}
                            onChange={(e, newValue) => setUserRatings(prev => ({ ...prev, accommodation: newValue || 0 }))}
                            size="medium"
                            sx={{ "& .MuiRating-iconFilled": { color: "#ff6d00" } }}
                          />
                        </Box>
                      </Stack>
                    </Box>
                    
                    {/* Comment Section */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="600" gutterBottom sx={{ fontSize: '0.9rem' }}>
                        Additional Comments:
                      </Typography>
                      <TextField
                        placeholder="Share your detailed thoughts and feedback..."
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            backgroundColor: "white",
                            fontSize: '0.85rem',
                            "&:hover fieldset": {
                              borderColor: "#1976d2",
                            },
                          },
                        }}
                      />
                    </Box>
                    
                    {/* Action Buttons */}
                    <Box display="flex" gap={1.5} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCancelEdit}
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: 1.5, px: 2, fontSize: '0.8rem' }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SendIcon sx={{ fontSize: 16 }} />}
                        onClick={handleSubmitReview}
                        disabled={!Object.values(userRatings).some(rating => rating > 0) && !userComment.trim()}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: 1.5,
                          px: 2,
                          fontSize: '0.8rem',
                          background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                          boxShadow: "0 2px 4px 1px rgba(25, 118, 210, .2)",
                        }}
                      >
                        Update Review
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ) : null
            ) :
              <Typography variant="caption" color="text.secondary" textAlign="center" mt={3} sx={{ fontSize: '0.8rem' }}>
                You can't Review yet Event not End Yet
              </Typography>
            }
           
            
      
          </Box>
        )}
      </DialogContent>

      {/* Footer Action */}
      {!hasEventEnded() && (
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
      )}
    </Dialog>
  );
};

export default EventSlideDialog;