import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Paper,
    Box,
    TextField,
    Divider,
    IconButton,
} from "@mui/material";
import {
    Close as CloseIcon,
    WarningAmber as WarningIcon,
    Image as ImageIcon,
    CalendarMonth,
    AccessTime,
    LocationOn,
    Person,
    Group,
    TitleTwoTone,
    Person2TwoTone,
    ArrowBackSharp,
} from "@mui/icons-material";

const CancelEventDialog = ({
    open,
    onClose,
    eventToCancel,
    handleCancelEvent,
    apiUrl,
}) => {
    const [reason, setReason] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = async () => {
        if (!reason.trim()) {
            setErrors({ reason: "Please provide a reason for cancellation." });
            return;
        }

        try {
            await handleCancelEvent(eventToCancel?.id, reason.trim());
            onClose();
            setReason("");
        } catch (err) {
            console.error("Cancellation failed:", err);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                onClose();
                setReason("");
                setErrors({});
            }}
            maxWidth="md"
            fullWidth
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
                }

            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "error.main",
                    color: "white",
                    py: 2,
                    px: 4,
                }}
            >

                <Button
                    onClick={() => {
                        onClose();
                        setReason("");
                        setErrors({});
                    }}
                    startIcon={<ArrowBackSharp />}
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Back
                </Button>
                <Typography variant="h5" fontWeight={700}>
                    Cancel Event
                </Typography>
                {/* <IconButton
                    onClick={() => {
                        onClose();
                        setReason("");
                        setErrors({});
                    }}
                    sx={{ ml: "auto", color: "white" }}
                >
                    <CloseIcon />
                </IconButton> */}
            </DialogTitle>

            {/* Content */}
            <DialogContent
                sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <Typography variant="body1" color="text.secondary">
                    Are you sure you want to cancel this event? This action cannot be undone.
                </Typography>

                {/* Event Preview Card */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid #e0e0e0",
                        backgroundColor: "#f9f9fb",
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 3,
                        alignItems: "flex-start",
                    }}
                >
                    {/* Image */}
                    <Box
                        sx={{
                            width: { xs: "100%", md: "40%" },
                            height: 180,
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid #ddd",
                            bgcolor: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {eventToCancel?.image ? (
                            <img
                                src={
                                    typeof eventToCancel.image === "string"
                                        ? `${apiUrl}/storage/${eventToCancel.image}`
                                        : URL.createObjectURL(eventToCancel.image)
                                }
                                alt="Event"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <ImageIcon sx={{ fontSize: 60, color: "text.disabled" }} />
                        )}
                    </Box>

                    {/* Details */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            color="primary"
                            gutterBottom
                        >
                            {eventToCancel?.title || "Untitled Event"}
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        <Box display="flex" alignItems="center" mb={1}>
                            <CalendarMonth fontSize="small" color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>From:</strong> {eventToCancel?.startDate || "N/A"} –{" "}
                                {eventToCancel?.endDate || "N/A"}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mb={1}>
                            <AccessTime fontSize="small" color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Time:</strong> {eventToCancel?.startTime || "N/A"} –{" "}
                                {eventToCancel?.endTime || "N/A"}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mb={1}>
                            <LocationOn fontSize="small" color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Venue:</strong> {eventToCancel?.venue || "N/A"}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mb={1}>
                            <Person fontSize="small" color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Organizer:</strong> {eventToCancel?.organizer || "N/A"}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mb={1}>
                            <Group fontSize="small" color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Mode:</strong> {eventToCancel?.category || "N/A"}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center">
                            <Person2TwoTone fontSize="small" color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Participants:</strong>{" "}
                                {eventToCancel?.event_types
                                    ?.map((type) => type.description)
                                    .join(", ") || "None"}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Cancel Reason */}
                <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                        📝 Why are you canceling this event?
                    </Typography>
                    <TextField
                        placeholder="e.g., Venue unavailable, Low registration, Weather concerns..."
                        multiline
                        rows={3}
                        fullWidth
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            if (e.target.value.trim()) setErrors((prev) => ({ ...prev, reason: "" }));
                        }}
                        error={!!errors.reason}
                        helperText={errors.reason}
                        variant="outlined"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                backgroundColor: "white",
                            },
                        }}
                    />
                </Box>
            </DialogContent>

            {/* Actions */}
            <DialogActions
                sx={{
                    p: 3,
                    gap: 2,
                    justifyContent: "flex-end",
                    borderTop: "1px solid #e0e0e0",
                }}
            >
                <Button
                    onClick={() => {
                        onClose();
                        setReason("");
                        setErrors({});
                    }}
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 8,
                        px: 4,
                    }}
                >
                    No, Keep Event
                </Button>

                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="error"
                    size="large"
                    disabled={!reason.trim()}
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 8,
                        px: 4,
                        boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
                        "&:hover": {
                            boxShadow: "0 6px 16px rgba(244, 67, 54, 0.3)",
                        },
                    }}
                >
                    Yes, Cancel Event
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelEventDialog;