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
import EventFormDialog from "../component/event/EventFormDialog";
import EventViewDialog from "../component/event/EventViewDialog";
import { EditDocument } from "@mui/icons-material";

// ... (imports unchanged)

const EventPage = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    startDate: "",
    endDate: "",
    endTime: "",
    startTime: "",
    category: "",
    organizer: "",
    contact: "",
    attendees: "",
    venue: "",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
    sponsors: [],
    programs: [],
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    const response = await UseMethod("get", "get-events");
    if (response?.data) {
      const mappedEvents = response.data.map((event, index) => ({
        id: event.id || index,
        title: event.title,
        startTime: event.start_time,
        startDate: event.start_date,
        endDate: event.end_date,
        endTime: event.end_time,
        category: event.category,
        organizer: event.organizer,
        contact: event.contact,
        attendees: event.attendees,
        venue: event.venue,
        address: event.address,
        latitude: event.latitude,
        longitude: event.longitude,
        description: event.description,
        programs: event.event_programs ?? [],
        sponsors: event.events_sponser ?? [], // ✅ include sponsors
      }));
      setEvents(mappedEvents);
     
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

const handleOpenForm = (event = null) => {
    setIsEdit(!!event);
    setFormData(
      event || {
        id: "",
        title: "",
        startDate: "",
        startTime:"",
        endDate: "",
        endTime: "",
        category: "",
        organizer: "",
        contact: "",
        attendees: "",
        venue: "",
        address: "",
        latitude: "",
        longitude: "",
        description: "",
        sponsors:[],
        programs:[]
      }
    );
    setOpenForm(true);
  };
  const handleSubmit = async () => {
    const payload = {
      id: formData.id,
      title: formData.title,
      start_date: formData.startDate,
      start_time: formData.startTime,
      end_date: formData.endDate,
      end_time: formData.endTime,
      category: formData.category,
      organizer: formData.organizer,
      contact: formData.contact,
      attendees: formData.attendees,
      venue: formData.venue,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      description: formData.description,
      programs: formData.programs,
      sponsors: formData.sponsors,
    };

    const api = isEdit ? "update-events" : "store-events";
    const response = await UseMethod("post", api, payload);

    if (response?.data) {
      alert("Event saved successfully!");
      setOpenForm(false);
      fetchEvents();
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
    { field: "startDate", headerName: "Start Date", width: 100 },
    { field: "endDate", headerName: "End Date", width: 100 },
    { field: "venue", headerName: "Venue", flex: 1 },
    { field: "organizer", headerName: "Organizer", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 290,
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
          <Button
            sx={{ ml: 1 }}
            size="small"
            variant="contained"
            color="error"
            startIcon={<EditDocument />}
          >
            Report
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box>
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
          <Grid item xs={12} md={4}>
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
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5]}
          sx={{ backgroundColor: "#fff", borderRadius: 3, height: "75vh" }}
        />
      </Paper>

      {/* Dialogs */}
      <EventFormDialog
        key={openForm ? "open" : "closed"}
        open={openForm}
        programs={formData.programs}
        onClose={() => setOpenForm(false)}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSubmit}
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
