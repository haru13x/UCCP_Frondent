import React, { useState, useEffect, use } from "react";
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
import { Cancel, CancelPresentation, DocumentScanner, EditDocument, GeneratingTokensRounded, Report, ReportSharp } from "@mui/icons-material";
import { useSnackbar } from "../component/event/SnackbarProvider ";

// ... (imports unchanged)

const EventPage = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    image: "",
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
    accountGroupId: "",
    sponsors: [],
    programs: [],
    participants: [],
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    const response = await UseMethod("get", "get-events");
    if (response?.data) {
      const mappedEvents = response.data.map((event, index) => ({

        id: event.id || index,
        image: event.image || "",
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
        image: event.image,
        // accountGroupId: event.accountGroupId,
        programs: event.event_programs ?? [],
        sponsors: event.events_sponser ?? [],
        // accountGroupId: event.event_types[0]?.group_id || "",
        // participants: event.event_types.map((t) => t.id) || [],
        participants: event.participants || [],
        event_types: event.event_types || [],
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
        image: "",
        title: "",
        startDate: "",
        startTime: "",
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
        image: "",
        sponsors: [],
        programs: [],
        participants: [],
        accountGroupId: "",
      }
    );
    setOpenForm(true);
  };
  const handleSubmit = async () => {
    const form = new FormData();
    form.append("id", formData.id);
    form.append("title", formData.title);
    form.append("start_date", formData.startDate);
    form.append("start_time", formData.startTime);
    form.append("end_date", formData.endDate);
    form.append("end_time", formData.endTime);
    form.append("category", formData.category);
    form.append("organizer", formData.organizer);
    form.append("contact", formData.contact);
    form.append("attendees", formData.attendees);
    form.append("venue", formData.venue);
    form.append("address", formData.address);
    form.append("latitude", formData.latitude);
    form.append("longitude", formData.longitude);
    form.append("description", formData.description);
    form.append("account_group_id", formData.accountGroupId);

    if (Array.isArray(formData.participants)) {
      form.append("participants", JSON.stringify(formData.participants));
    }

    // Attach image file
    if (formData.image instanceof File) {
      form.append("image", formData.image);
    }

    // Attach programs and sponsors as JSON strings
    form.append("programs", JSON.stringify(formData.programs));
    form.append("sponsors", JSON.stringify(formData.sponsors));

    const api = isEdit ? "update-events" : "store-events";
    const response = await UseMethod("post", api, form, "", true);

    if (response?.data) {
      showSnackbar({
        message: isEdit ? "Event updated successfully." : "Event created successfully.",
        type: "success",
      });
      setOpenForm(false);
      fetchEvents();
    } else {
      showSnackbar({ message: "Failed to save event.", type: "error" });
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
            startIcon={<CancelPresentation />}
          >
            Cancel
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item xs={12} md={6} size={{ md: 4 }}>
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
              onClick={() => { }}
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
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<DocumentScanner />}
              color="error"
            >
              Generate Reports
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
        height="100vh"
        open={openView}
        onClose={() => setOpenView(false)}
        event={selectedEvent}
      />
    </Box>
  );
};

export default EventPage;
