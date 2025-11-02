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
import FormDebugComponent from "../../component/debug/FormDebugComponent";
import EventViewDialog from "../../component/event/EventViewDialog";
import { CalendarMonth, Cancel, CancelPresentation, DocumentScanner, EditDocument, GeneratingTokensRounded, Group, Person, Person2TwoTone, Report, ReportSharp, Title, TitleTwoTone } from "@mui/icons-material";
import { useSnackbar } from "../../component/event/SnackbarProvider ";
import { CancelOutlined, Event, AccessTime, LocationOn } from '@mui/icons-material'
import EventReportDialog from "../../component/event/EventReportDialog";
import { ca, se } from "date-fns/locale";
import CancelEventDialog from "../../component/event/CancelEventDialog";
import { useLocation, useNavigate } from "react-router-dom";

const EventPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDebug, setOpenDebug] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [eventToCancel, setEventToCancel] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [accountGroups, setAccountGroups] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
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
    location_id: "",
    longitude: "",
    description: "",
    accountGroupId: "",
    sponsors: [],
    programs: [],
    
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const fetchEvents = async (filters = {}) => {
    setLoading(true);

    const response = await UseMethod("post", "get-events", filters); // POST request
    if (response?.data) {
      let mappedEvents = response.data.map((event, index) => ({
        id: event.id || index,
        title: event.title,
        startTime: event.start_time,
        startDate: event.start_date,
        endDate: event.end_date,
        endTime: event.end_time,
        category: event.category,
        organizer: event.organizer,
        contact: event.contact || '',
        attendees: event.attendees,
        venue: event.venue,
        address: event.address,
        latitude: event.latitude,
        longitude: event.longitude,
        description: event.description,
        image: event.image || "",
        status: event.status_id === 1 ? "Active" : "Cancelled",
        // Only keep needed program data
        programs: Array.isArray(event.event_programs) ? event.event_programs.map(p => ({
          start_time: p.start_time,
          end_time: p.end_time,
          activity: p.activity
        })) : [],
        accountGroupId: (Array.isArray(event.accountGroupIds) && event.accountGroupIds.length > 0)
          ? String(event.accountGroupIds[0])
          : "",
        cancel_by: event.cancel_by || "",
        cancel_reason: event.cancel_reason || "",
        cancel_date: event.cancel_date || "",
        location_id: event.location_id || "",
        location: event.location || "",
        conference_locations: event.conference_locations || [],
        isconference: event.isconference || false,
        event_modes: event.event_modes || [],
        location_data: event.location_data || []
      }));

      // Client-side category filter (backend may ignore category filter)
      if (filters && filters.category) {
        const catId = String(filters.category);
        mappedEvents = mappedEvents.filter(ev => {
          const cats = Array.isArray(ev.category)
            ? ev.category.map(v => String(v))
            : String(ev.category || '').split(',').map(id => id.trim()).filter(Boolean);
          return cats.includes(catId);
        });
      }

      setEvents(mappedEvents);
    }
    setLoading(false);
  };
  const [filter, setFilter] = useState({
    search: "",
    dateFilter: "upcoming", // default
    status_id: 1, // active
    category: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eid = params.get("eventId");
    if (!eid) return;

    const openFromList = () => {
      const ev = events.find((e) => String(e.id) === String(eid));
      if (ev) {
        setSelectedEvent(ev);
        setOpenView(true);
        return true;
      }
      return false;
    };

    const openFromApi = async () => {
      const res = await UseMethod("get", `get-event/${eid}`);
      const data = res?.data;
      if (!data) return;
      const event = {
        id: data.id || "",
        title: data.title,
        startDate: data.start_date,
        startTime: data.start_time,
        endDate: data.end_date,
        endTime: data.end_time,
        category: data.category,
        organizer: data.organizer,
        contact: data.contact || "",
        attendees: data.attendees,
        venue: data.venue,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description,
        image: data.image || "",
        status: data.status_id === 1 ? "Active" : "Cancelled",
        programs: Array.isArray(data.event_programs) ? data.event_programs.map(p => ({
          start_time: p.start_time,
          end_time: p.end_time,
          activity: p.activity
        })) : [],
        accountGroupIds: data.accountGroupIds || [],
        cancel_by: data.cancel_by || "",
        cancel_reason: data.cancel_reason || "",
        cancel_date: data.cancel_date || "",
        location_id: data.location_id || "",
        location: data.location || "",
        conference_locations: data.conference_locations || [],
        isconference: data.isconference || false,
        event_modes: data.event_modes || [],
        location_data: data.location_data || [],
      };
      setSelectedEvent(event);
      setOpenView(true);
    };

    if (!openFromList()) {
      openFromApi();
    }

    const newSearch = new URLSearchParams(location.search);
    newSearch.delete("eventId");
    navigate(`${location.pathname}?${newSearch.toString()}`, { replace: true });
  }, [location.search, events]);

  // Load current user once
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch {}
    }
  }, []);

  // Load account groups for admin only
  useEffect(() => {
    const loadAccountGroups = async () => {
      const res = await UseMethod("get", "account-groups");
      if (res?.data) setAccountGroups(res.data);
    };
    if (currentUser?.role_id === 1) {
      loadAccountGroups();
    }
  }, [currentUser]);

  const handleOpenForm = (event = null) => {
    console.log('handleOpenForm called with event:', event);
    setIsEdit(!!event);
    if (event) {
      console.log('Event data received:', {
        start_date: event.start_date,
        start_time: event.start_time,
        end_date: event.end_date,
        end_time: event.end_time,
        title: event.title,
        fullEvent: event
      });
      // Map backend event data to frontend formData structure
      const mappedFormData = {
        id: event.id || "",
        image: event.image || "",
        title: event.title || "",
        startDate: event.startDate,
        startTime: event.startTime || "",
        endDate: event.endDate,
        endTime: event.endTime || "",
        category: event.category ? (Array.isArray(event.category) ? event.category : event.category.split(',').map(id => id.trim())) : [],
        organizer: event.organizer || "",
        contact: event.contact || "",
        attendees: event.attendees || "",
        venue: event.venue || "",
        address: event.address || "",
        latitude: event.latitude || "",
        longitude: event.longitude || "",
        description: event.description || "",
        sponsors: event.sponsors || [],
        programs: event.programs || [],
        status: event.status || "",
        accountGroupIds: event.accountGroupIds || [],
        location_id: "", // Not used anymore - only venue field
        conference_locations: event?.conference_locations ||  [],
        isconference: event.isconference ?? true
      };
      console.log('Mapped formData:', mappedFormData);
       setFormData(mappedFormData);
    } else {
      // Default values for new event
      setFormData({
        id: "",
        image: "",
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        category: [],
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
        status: "",
        accountGroupIds: [],
        location_id: "",
        conference_locations: [],
        isconference: true
      });
    }
    setOpenForm(true);
   console.log('dddd',formData)
  };
  const handleSubmit = async () => {
    const form = new FormData();
    form.append("id", formData.id);
    form.append("title", formData.title);
    form.append("start_date", formData.startDate);
    form.append("start_time", formData.startTime);
    form.append("end_date", formData.endDate);
    form.append("end_time", formData.endTime);
    // Only admins can choose categories; others forced to their own group
    const categoryList = currentUser?.role_id === 1
      ? (Array.isArray(formData.category)
          ? formData.category.map((v) => String(v))
          : String(formData.category || '').split(',').filter(Boolean))
      : (currentUser?.group_id ? [String(currentUser.group_id)] : []);
    form.append("category", categoryList.join(","));
    form.append("organizer", formData.organizer);
    form.append("contact", formData.contact);
    form.append("attendees", formData.attendees);
    form.append("venue", formData.venue);
    form.append("address", formData.address);
    form.append("latitude", formData.latitude);
    form.append("longitude", formData.longitude);
    form.append("description", formData.description);
    // account_group_id removed - using category field for multiple account groups
    form.append("isconference", formData.isconference ? 1 : 0);
    
    // Handle location data based on event type
    // Open to all (conference) does not include specific locations
    if (!formData.isconference) {
      // For regular events, send single location ID
      form.append("location_id", formData.location_id);
    }
    
    // Remove participants (account types) from payload
    
    // Send participantData with account_group_id information
    // Account types removed; only groups are used
    // Auto-assign auth_group_id for non-admin creators
    if (currentUser?.role_id === 1 && currentUser?.group_id) {
      form.append("auth_group_id", String(currentUser.group_id));
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
    // Display active event modes (account groups) safely using renderCell
    {
      field: "groups",
      headerName: "Groups",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const row = params?.row || {};
        const modes = Array.isArray(row.event_modes) ? row.event_modes : [];
        const names = modes
          .filter((m) => m?.status_id === 1 && m?.event_group)
          .map((m) => m.event_group?.description || m.event_group?.code || String(m.event_group?.id))
          .filter(Boolean);
        return <span>{names.length ? names.join(", ") : "-"}</span>;
      },
    },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 290,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={50}
          flexDirection="row"
         
          width="100%"
          gap={1}
          flexWrap="wrap"
        >
          <Button
            size="small"
            variant="outlined"
            color="info"
            onClick={() => handleView(params.row)}
            startIcon={<VisibilityIcon />}
          >
            View
          </Button>

          {params.row.status === 'Active' && (
            <>
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
                size="small"
                variant="contained"
                color="error"
                onClick={() => {
                  setEventToCancel(params.row);
                  setCancelDialogOpen(true);
                }}
                startIcon={<CancelPresentation />}
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      ),
    },

  ];
  const handleGenerateReport = async (filters) => {

    setLoadingReport(true);
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
      
      // Close dialog after successful generation
      setTimeout(() => {
        setReportDialogOpen(false);
      }, 1000);
    } catch (err) {
      console.error("Report error:", err);
      // Re-throw to let EventReportDialog handle the error state
      throw err;
    } finally {
      setLoadingReport(false);
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
              value={filter.search}
              onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchEvents({
                  search: filter.search,
                  date_filter: filter.dateFilter,
                  status_id: filter.status_id,
                  category: filter.category || undefined,
                });
              }}
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

          {/* Category filter: visible only for admin (role_id === 1) */}
          {currentUser?.role_id === 1 && (
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                placeholder="Category"
                size="small"
                SelectProps={{ native: true }}
                value={filter.category}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">All</option>
                {accountGroups.map((g) => (
                  <option key={g.id} value={String(g.id)}>
                    {g.description || g.code || `Group ${g.id}`}
                  </option>
                ))}
              </TextField>
            </Grid>
          )}

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
                category: filter.category || undefined,
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
        loading={loadingReport}
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
    
      <CancelEventDialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        eventToCancel={eventToCancel}
        apiUrl={process.env.REACT_APP_API_URL}
        handleCancelEvent={async (id, reason) => {
          // Send to backend
          await UseMethod("put", `cancel-event/${id}`, { reason });
          showSnackbar("Event canceled successfully.", "success");
          // Refresh list
          fetchEvents();
        }}
      />


    </Box>

  );
};

export default EventPage;
