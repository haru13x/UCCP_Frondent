import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  
  Paper,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EventNoteIcon from "@mui/icons-material/EventNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import eventsData from "../data/events";
import { SearchOffSharp } from "@mui/icons-material";

const EventPage = () => {
  const [events, setEvents] = useState(eventsData);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [formData, setFormData] = useState({ title: "", date: "", time: "", location: "", description: "" });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleOpenForm = (event = null) => {
    setIsEdit(!!event);
    setFormData(event || { title: "", date: "", time: "", location: "", description: "" });
    setOpenForm(true);
  };

  const handleSave = () => {
    if (isEdit) {
      setEvents(events.map(e => (e.id === formData.id ? formData : e)));
    } else {
      setEvents([...events, { id: events.length + 1, ...formData }]);
    }
    setOpenForm(false);
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setOpenView(true);
  };

  const columns = [
  
    { field: "title", headerName: "Title", flex: 1 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "time", headerName: "Time", width: 120 },
    { field: "location", headerName: "Location", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            variant="outlined"
            color="info"
            onClick={() => handleView(params.row)}
            sx={{ mr: 1 }}
            startIcon={<VisibilityIcon />}
          >
            View
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleOpenForm(params.row)}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ pr:1 }}>
        <Paper elevation={3} sx={{  p:1 }}>
      
        
      <Box sx={{ maxWidth: 7800, }}>
        <Grid container px={{display:'flex', alignItems:'center',justifyContent:'right'}} md={12} spacing={2}>
          <Grid item width={500} xs={12} md={6} sm={8} >
            <TextField
              fullWidth
              label="Search Events"
              size="small"
              margin="dense"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Grid>
            <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              startIcon={<SearchOffSharp />}
              fullWidth
              onClick={handleOpenForm}
               size="small"
              margin="dense"
            >
             Search
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              fullWidth
              onClick={() => handleOpenForm()}
               size="small"
              margin="dense"
            >
              Add Event
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      
      {/* <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          sx={{ borderRadius: 3 }}
        >
          Add Event
        </Button>
      </Box> */}

      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <DataGrid
          rows={events}
          columns={columns}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5]}
          sx={{ backgroundColor: "#fff", borderRadius: 3 }}
        />
      </Paper>
</Paper>
      {/* Add/Edit Event Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit ? "Edit Event" : "Add New Event"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} fullWidth />
          <TextField type="date" label="Date" InputLabelProps={{ shrink: true }} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} fullWidth />
          <TextField type="time" label="Time" InputLabelProps={{ shrink: true }} value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} fullWidth />
          <TextField label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} fullWidth />
          <TextField label="Description" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} fullWidth maxWidth="xs">
        <DialogTitle>👁️ View Event</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 3 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: "#1976d2" }}>
                <EventNoteIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" mt={2}>{selectedEvent.title}</Typography>
              <Typography color="text.secondary">{selectedEvent.date} @ {selectedEvent.time}</Typography>
              <Divider sx={{ width: "100%", my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                  <Typography>{selectedEvent.location}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography>{selectedEvent.description}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventPage;
