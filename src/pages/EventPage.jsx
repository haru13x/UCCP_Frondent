import React, { useState } from "react";
import { Box, Typography, Button, TextField, Paper, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SearchOffSharp from "@mui/icons-material/SearchOffSharp";

import eventsData from "../data/events";
import EventFormDialog from "../component/EventFormDialog";
import EventViewDialog from "../component/EventViewDialog";

const EventPage = () => {
  const [events, setEvents] = useState(eventsData);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate:"",
    time: "",
    endDate: "",
    address:"",
    location: "",
    description: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleOpenForm = (event = null) => {
    setIsEdit(!!event);
    setFormData(
      event || {
        title: "",
        startDate: "",
        endDate: "",
        time: "",
        location: "",
        description: "",
      }
    );
    setOpenForm(true);
  };

  const handleSave = () => {
    if (isEdit) {
      setEvents(events.map((e) => (e.id === formData.id ? formData : e)));
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
    { field: "title", headerName: "Event Title", flex: 1 },
    { field: "startDate" , headerName: "Start Date", width: 120 },
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
      <Paper elevation={3} sx={{ p: 1 }}>
        <Box sx={{ maxWidth: 7800 }}>
          <Grid
            container
            px={{
              display: "flex",
              alignItems: "center",
              justifyContent: "right",
            }}
            md={12}
            spacing={2}
          >
            <Grid item width={500} xs={12} md={6} sm={8}>
              <TextField
                fullWidth
                label="Search Events"
                size="small"
                margin="dense"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                startIcon={<SearchOffSharp />}
                fullWidth
                onClick={handleOpenForm}
                size="small"
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
              >
                Add Event
              </Button>
            </Grid>
          </Grid>
        </Box>

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

      {/* Modularized Dialog Components */}
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
