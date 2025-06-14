// src/component/EventViewDialog.jsx
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
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";

const EventViewDialog = ({ open, onClose, event }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>👁️ View Event</DialogTitle>
      <DialogContent>
        {event && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 3,
            }}
          >
            <Avatar sx={{ width: 80, height: 80, bgcolor: "#1976d2" }}>
              <EventNoteIcon fontSize="large" />
            </Avatar>
            <Typography variant="h6" fontWeight="bold" mt={2}>
              {event.title}
            </Typography>
            <Typography color="text.secondary">
              {event.date} @ {event.time}
            </Typography>
            <Divider sx={{ width: "100%", my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography>{event.location}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography>{event.description}</Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventViewDialog;
