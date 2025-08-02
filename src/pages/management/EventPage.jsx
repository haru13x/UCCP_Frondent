import React, { useState, useEffect, use } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SearchOffSharp from "@mui/icons-material/SearchOffSharp";
import { UseMethod } from "../../composables/UseMethod";
import EventFormDialog from "../../component/event/EventFormDialog";
import EventViewDialog from "../../component/event/EventViewDialog";
import { CalendarMonth, Cancel, CancelPresentation, DocumentScanner, EditDocument, GeneratingTokensRounded, Group, Person, Person2TwoTone, Report, ReportSharp, Title, TitleTwoTone } from "@mui/icons-material";
import { useSnackbar } from "../../component/event/SnackbarProvider ";
import { CancelOutlined, Event, AccessTime, LocationOn } from '@mui/icons-material'
// ... (imports unchanged)
import EventReportDialog from "../../component/event/EventReportDialog";
import { se } from "date-fns/locale";

const EventPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [eventToCancel, setEventToCancel] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

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
  const fetchEvents = async (filters = {}) => {
    setLoading(true);

    const response = await UseMethod("post", "get-events", filters); // POST request
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
        status: event.status_id === 1 ? "Active" : "Cancelled",
        programs: event.event_programs ?? [],
        sponsors: event.events_sponser ?? [],
        accountGroupId: event.event_types[0]?.group_id || "",
        participants: event.event_types.map((t) => t.id) || [],
        event_types: event.event_types || [],
      }));
      setEvents(mappedEvents);
    }
    setLoading(false);
  };
  const [filter, setFilter] = useState({
    search: "",
    dateFilter: "upcoming", // default
    status_id: 1, // active
  });

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
        status: "",
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
  const handleCancelEvent = async (eventId) => {
    const response = await UseMethod("put", `cancel-event/${eventId}`);
    if (response?.data) {
      showSnackbar({ message: "Event canceled successfully.", type: "success" });
      fetchEvents();
    } else {
      showSnackbar({ message: "Failed to cancel event.", type: "error" });
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
    { field: "status", headerName: "Status", flex: 1 },
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
            onClick={() => {
              setEventToCancel(params.row);
              setCancelDialogOpen(true);
            }}
          >
            Cancel
          </Button>

        </>
      ),
    },
  ];
  const handleGenerateReport = async (filters) => {
    try {
      const response = await UseMethod("post", "generate-event-report", filters, "", true, "blob");

      if (!response || !response.data) {
        throw new Error("Failed to generate PDF");
      }
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      // Try to force new window
      const windowFeatures = "toolbar=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600,top=100,left=100";
      window.open(fileURL, "_blank", windowFeatures);
      setReportDialogOpen(false);
    } catch (err) {
      console.error("Report error:", err);
    }
  };
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

            <TextField
              select
              fullWidth
              label="Filter By Date"
              size="small"
              SelectProps={{ native: true }}
              value={filter.dateFilter}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, dateFilter: e.target.value }))
              }
            >
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="past">Past</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>

            <TextField
              select
              fullWidth
              label="Status"
              size="small"
              SelectProps={{ native: true }}
              value={filter.status_id}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status_id: e.target.value }))
              }
            >

              <option value="1">Active</option>
              <option value="2">Cancel</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SearchOffSharp />}
              onClick={() => fetchEvents({
                search: filter.search,
                date_filter: filter.dateFilter,
                status_id: filter.status_id,
              })}
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
              onClick={() => setReportDialogOpen(true)}
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
      <EventReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        onGenerate={(filters) => {
          handleGenerateReport(filters);
        }}
      />


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
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundColor: '#fff',
            boxShadow: 24,
            p: 2,
            width: 650,
            display: 'flex',

          },
        }}
      >
        {/* Title with icon */}
        <DialogTitle sx={{ display: 'flex', alignItems: 'start', justifyContent: 'left', mb: 2 }}>

          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Cancel Event
          </Typography>
        </DialogTitle>

        {/* Main Content */}
        <DialogContent sx={{ pb: 1, display: 'flex', flexDirection: 'column', alignItems: '' }}>
          <DialogContentText sx={{ color: 'text.secondary', mb: 2 }}>
            Are you sure you want to cancel this event?
          </DialogContentText>

          {/* Event Detail Box */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: '#f9f9f9',
              border: '1px solid #e0e0e0',


              display: 'flex',
              flexDirection: 'column',

            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
              {eventToCancel?.image && (
                <img
                  src={
                    typeof eventToCancel?.image === "string"
                      ? `${apiUrl}/storage/${eventToCancel?.image}`
                      : URL.createObjectURL(eventToCancel?.image)
                  }
                  alt="Preview"
                  style={{ width: "70%", height: "50%", objectFit: "" }}
                />
              )}

            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TitleTwoTone sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {eventToCancel?.title || 'Untitled Event'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                {eventToCancel?.startDate || 'No date'} - {eventToCancel?.endDate}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                {eventToCancel?.startTime || 'No time'} - {eventToCancel?.endTime}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                {eventToCancel?.venue || 'No location provided'}
              </Typography>
            </Box>


            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                {eventToCancel?.organizer || 'No location provided'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Group sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                {eventToCancel?.category || 'No location provided'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person2TwoTone sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">


                {eventToCancel?.event_types?.map((type) => type.description).join(", ") || "None"}
              </Typography>
            </Box>
          </Paper>
        </DialogContent>

        {/* Action Buttons */}
        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            variant="outlined"
            color="primary"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 500,
            }}
          >
            No, Keep It
          </Button>

          <Button
            onClick={async () => {
              await handleCancelEvent(eventToCancel?.id);
              setCancelDialogOpen(false);
            }}
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 500,
              boxShadow: 'none',
            }}
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>


    </Box>

  );
};

export default EventPage;
