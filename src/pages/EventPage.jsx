import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SearchOffSharp from "@mui/icons-material/SearchOffSharp";
import { UseMethod } from "../composables/UseMethod";
import EventFormDialog from "../component/EventFormDialog";
import EventViewDialog from "../component/EventViewDialog";

const EventPage = () => {
  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    time: "",
    category: "",
    organizer: "",
    contact: "",
    attendees: "",
    venue: "",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events from backend
  const fetchEvents = async () => {
    setLoading(true);
    const response = await UseMethod("get", "get-events");
    if (response?.data) {
      const mappedEvents = response.data.map((event, index) => ({
        id: event.id || index,
        title: event.title,
        startDate: event.start_date,
        endDate: event.end_date,
        time: event.time,
        category: event.category,
        organizer: event.organizer,
        contact: event.contact,
        attendees: event.attendees,
        venue: event.venue,
        address: event.address,
        latitude: event.latitude,
        longitude: event.longitude,
        description: event.description,
      }));
      setEvents(mappedEvents);
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenForm = (event = null) => {
    setIsEdit(!!event);
    setFormData(
      event || {
        title: "",
        startDate: "",
        endDate: "",
        time: "",
        category: "",
        organizer: "",
        contact: "",
        attendees: "",
        venue: "",
        address: "",
        latitude: "",
        longitude: "",
        description: "",
      }
    );
    setOpenForm(true);
  };

  const handleSave = async () => {
    const payload = {
      title: formData.title,
      start_date: formData.startDate,
      end_date: formData.endDate,
      time: formData.time,
      category: formData.category,
      organizer: formData.organizer,
      contact: formData.contact,
      attendees: formData.attendees,
      venue: formData.venue,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      description: formData.description,
    };

    const response = await UseMethod("post", "store-events", payload);
    if (response?.data) {
      alert("Event saved successfully!");
      setOpenForm(false);
      fetchEvents(); // refresh list
    } else {
      alert("Failed to save event.");
    }
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setOpenView(true);
  };

  const columns = [
    { field: "title", headerName: "Event Title", flex: 1 },
    { field: "startDate", headerName: "Start Date", width: 120 },
    { field: "endDate", headerName: "End Date", width: 120 },
    { field: "time", headerName: "Time", width: 120 },
    { field: "venue", headerName: "Venue", flex: 1 },
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
    <Box sx={{ pr: 1 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Events"
              size="small"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SearchOffSharp />}
              onClick={() => {}}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenForm()}
            >
              Add Event
            </Button>
          </Grid>
        </Grid>

        <DataGrid
          rows={events}
          columns={columns}
          autoHeight
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5]}
          sx={{ backgroundColor: "#fff", borderRadius: 3 }}
        />
      </Paper>

      {/* Dialogs */}
      <EventFormDialog
        key={openForm ? "open" : "closed"}
        open={openForm}
        onClose={() => setOpenForm(false)}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        isEdit={isEdit}
      />

      <EventViewDialog
        open={openView}
        onClose={() => setOpenView(false)}
        event={selectedEvent}
      />
    </Box>
  );
};

export default EventPage;
