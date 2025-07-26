import React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs"; // If not installed: npm install dayjs
import { UseMethod } from "../../composables/UseMethod"; // Adjust the import path as needed
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
} from "@mui/material";
import {
    ArrowBackSharp,
    EventAvailable as EventAvailableIcon,
    CalendarMonth as CalendarMonthIcon,
    AccessTime as AccessTimeIcon,
    LocationOn as LocationOnIcon,
    Phone as PhoneIcon,
    Group as GroupIcon,
    Description as DescriptionIcon,
    QrCode as QRCodeIcon,
} from "@mui/icons-material";
import Slide from "@mui/material/Slide";
import { useSnackbar } from "./SnackbarProvider ";
// Slide-in transition
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
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState("");
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: "Jane D.",
            rating: 5,
            comment: "Amazing event! Everything was well organized.",
            date: "July 1, 2025",
        },
        {
            id: 2,
            name: "Mark A.",
            rating: 4,
            comment: "Great experience, but the location was hard to find.",
            date: "June 29, 2025",
        },
    ]);
            const apiUrl = process.env.REACT_APP_API_URL;
    const { showSnackbar } = useSnackbar();
    const [isRegistered, setIsRegistered] = useState(false);
    const now = dayjs();
    const start = dayjs(`${event?.start_date}T${event?.start_time}`);
    const end = dayjs(`${event?.end_date}T${event?.end_time}`);

    // Conditions
    const isBeforeEvent = now.isBefore(start);      // ⏳ Event hasn't started yet
    const isDuringEvent = now.isAfter(start) && now.isBefore(end); // 🟢 Event is ongoing
    const isAfterEvent = now.isAfter(end);

    // useEffect(() => {
    //     if (tabIndex !== 1) {
    //         setUserRating(0);
    //         setUserComment("");

    //     }

    //     const checkIfRegistered = async () => {
    //         try {
    //             const res = await UseMethod("get", `isregistered/${event?.id}`);
    //             setIsRegistered(res?.data || false);
    //         } catch (error) {
    //             console.error(error);
    //             showSnackbar({
    //                 message: "An error occurred while checking registration status.",
    //                 type: "error",
    //             });
    //         }

    //     }
    //     if (tabIndex !== 1) {
    //         checkIfRegistered();
    //     }
    // }, [open, tabIndex, event]);


    const handleSubmitReview = () => {
        if (!userRating && !userComment.trim()) return;

        const newReview = {
            id: Date.now(),
            name: "You",
            rating: userRating || null,
            comment: userComment.trim() || null,
            date: new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            }),
        };
        showSnackbar({
            message: "Review submitted successfully!",
            type: "success",
        });
        setReviews([newReview, ...reviews]);
        setUserRating(0);
        setUserComment("");
    };

    const handleTabChange = (e, newValue) => setTabIndex(newValue);
    const handleRegister = async () => {
        try {
            const res = await UseMethod("post", `event-registration/${event?.id}`);
            if (res && res.status === 200) {
                showSnackbar({
                    message: "Registration successful!.",
                    type: "success",
                });
            setIsRegistered(true);
            } else {
                showSnackbar({
                    message: "Registration failed. Please try again.",
                    type: "error",
                });
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while registering.");
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
                    width: { xs: "100%", sm: "90%", md: "55%" },
                },
            }}
        >
            {/* Header */}
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
                <Button
                    onClick={onClose}
                    variant="contained"
                    color="error"
                    size="large"
                    fullWidth={isMobile}
                >
                    <ArrowBackSharp fontSize="small" sx={{ mr: 1 }} /> Back
                </Button>
<Tabs
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
      fontWeight: 800,
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "#ffc107",
    },
  }}
  value={tabIndex}
  onChange={handleTabChange}
>
  <Tab label="About Event" />
  
  {event?.is_registered === 1 && isAfterEvent && (
    <Tab label="Comments & Reviews" />
  )}
</Tabs></DialogTitle>

            {/* Content */}
            <DialogContent sx={{ overflowY: "auto", flex: 1 }}>
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
                                        <strong>Date:</strong> {event?.start_date} to {event?.end_date}
                                    </Typography>
                                </Grid>

                                {/* Time */}
                                <Grid size={{ md: 6 }} xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <AccessTimeIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                                        <strong>Time:</strong> {event?.start_time} – {event?.end_time}
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
                        <Typography variant="h6" gutterBottom>⭐ Comments & Reviews</Typography>

                        {/* Average Rating Summary */}
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Rating value={4.5} precision={0.5} readOnly />
                            <Typography variant="body2">(4.5 out of 5 · 23 reviews)</Typography>
                        </Box>

                        {/* Submit Review */}
                        <Box
                            sx={{
                                mb: 4,
                                p: 2,
                                border: "1px solid #ddd",
                                borderRadius: 2,
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <Typography variant="subtitle1" mb={1}>Leave a Review</Typography>
                            <Rating
                                value={userRating}
                                onChange={(e, newValue) => setUserRating(newValue)}
                            />
                            <TextField
                                placeholder="Write your comment..."
                                multiline
                                rows={3}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                value={userComment}
                                onChange={(e) => setUserComment(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmitReview}
                                disabled={!userRating && !userComment.trim()}
                            >
                                Submit Review
                            </Button>

                        </Box>

                        {/* Comments List */}
                        <List disablePadding>
                            {reviews.map((review) => (
                                <ListItem
                                    key={review.id}
                                    alignItems="flex-start"
                                    sx={{
                                        mb: 2,
                                        p: 2,
                                        border: "1px solid #eee",
                                        borderRadius: 2,
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar>{review.name[0]}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography fontWeight={600}>{review.name}</Typography>
                                                <Rating value={review.rating} readOnly size="small" />
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="text.secondary">
                                                    {review.date}
                                                </Typography>
                                                <Typography mt={0.5}>{review.comment}</Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
    
            </DialogContent>

            {/* Bottom Register Button */}
           <DialogActions sx={{ p: 2 }}>
  <Button
    variant="contained"
    size="large"
    color="primary"
    fullWidth={isMobile}
    onClick={handleRegister}
    disabled={!isBeforeEvent || event?.is_registered === 1} // Disable if event started or already registered
  >
    {isAfterEvent
      ? "Event Ended"
      : isDuringEvent
        ? "Event Already Started"
        : event?.is_registered === 1
          ? "Already Registered"
          : "Register for this Event"}
  </Button>
</DialogActions>

        </Dialog>
    );
};

export default EventSlideDialog;
