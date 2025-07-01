import React, { useRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  TableCell,
  TableRow,
  TableBody,
  Table,
  TableHead,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import EventProgramFormDialog from "./EventProgramFormDialog";

const loadGoogleMapsScript = (callback) => {
  if (window.google?.maps) {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyA-Psh9ZzR9Qp7tiJcH5RTqhFrr9nYZRdQ&libraries=places";
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
};

const EventFormDialog = ({ open, onClose, formData, setFormData, onSave, isEdit, }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [placeOptions, setPlaceOptions] = useState([]);
  const [openProgramForm, setOpenProgramForm] = useState(false)
  const [programs, setPrograms] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [editingPrograms, setEditingPrograms] = useState([]);
  const [editingSponsors, setEditingSponsors] = useState([]);
  const initializeMap = () => {
    if (!mapRef.current || map) return;

    const initialPosition = {
      lat: parseFloat(formData.latitude) || 10.3157,
      lng: parseFloat(formData.longitude) || 123.8854,
    };

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialPosition,
      zoom: 15,
    });

    const mapMarker = new window.google.maps.Marker({
      position: initialPosition,
      map: mapInstance,
      draggable: true,
    });

    const geocoder = new window.google.maps.Geocoder();

    mapInstance.addListener("click", (e) => {
      const clickedPos = e.latLng;
      mapMarker.setPosition(clickedPos);
      mapInstance.panTo(clickedPos);

      geocoder.geocode({ location: clickedPos }, (results, status) => {
        if (status === "OK" && results[0]) {
          const place = results[0];
          setFormData((prev) => ({
            ...prev,
            latitude: clickedPos.lat(),
            longitude: clickedPos.lng(),
            venue: place.address_components?.[0]?.long_name || "",
            address: place.formatted_address || "",
          }));
        }
      });
    });

    setMap(mapInstance);
    setMarker(mapMarker);

    setTimeout(() => {
      mapInstance.setCenter(initialPosition);
      mapMarker.setPosition(initialPosition);
    }, 300);
  };

  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(() => {
      loadGoogleMapsScript(() => {
        initializeMap();
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (mapRef.current) mapRef.current.innerHTML = "";
      setMap(null);
      setMarker(null);
    };
  }, [open]);

  useEffect(() => {
    if (map && marker && open) {
      const position = {
        lat: parseFloat(formData.latitude) || 10.3157,
        lng: parseFloat(formData.longitude) || 123.8854,
      };
      map.setCenter(position);
      marker.setPosition(position);
    }
  }, [formData.latitude, formData.longitude, open]);

  const handlePlaceSelect = (event, value) => {
    if (!value) return;
    const placesService = new window.google.maps.places.PlacesService(map);
    placesService.getDetails({ placeId: value.place_id }, (place, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        place.geometry
      ) {
        const location = place.geometry.location;
        marker.setPosition(location);
        map.setCenter(location);
        setFormData({
          ...formData,
       
          latitude: location.lat(),
          longitude: location.lng(),
          venue: place.name || "",
          address: place.formatted_address || "",
        });
      }
    });
  };

  const handleSearchChange = (event) => {
    const input = event.target.value;
    if (!input || !window.google) return;

    const autocompleteService =
      new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions({ input }, (predictions) => {
      setPlaceOptions(predictions || []);
    });
  };

  const locateUser = () => {
    if (navigator.geolocation && map && marker) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const pos = { lat: latitude, lng: longitude };
        map.setCenter(pos);
        marker.setPosition(pos);

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: pos }, (results, status) => {
          if (status === "OK" && results[0]) {
            setFormData({
              ...formData,
              latitude,
              longitude,
              venue: results[0].address_components?.[0]?.long_name || "",
              address: results[0].formatted_address || "",
            });
          }
        });
      });
    }
  };
useEffect(() => {
  setPrograms(formData.programs || []);
  setSponsors(formData.sponsors || []);
  console.log("FormData Sponsors:", formData);
}, [open, formData]);



  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      fullScreen
      fullWidth
      maxWidth="xl"
      PaperProps={{
        sx: {
          height: '100vh',  // Full viewport height
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >

      <DialogTitle>
        {isEdit ? "Edit Event" : "Add New Meetings"}
      </DialogTitle>
      <DialogContent
        sx={{
          flex: 1,
          overflowY: 'auto',
        }}
      >

        <Grid container spacing={2} mt={1}>

       
          <Grid item size={{ md: 6 }} xs={12}>
            <Grid container spacing={2}>
              <Grid item size={{ md: 12 }}>
                <TextField
                  label="Title"
                  size="small"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item size={{ md: 6 }}>
                <TextField
                  type="date"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  inputProps={{
                    min: new Date().toISOString().split("T")[0], // 👈 this disables past dates
                  }}
                  fullWidth
                  size="small"
                />

              </Grid>
              <Grid item size={{ md: 6 }}>
                <TextField
                  type="time"
                  label="Start Time"
                  InputLabelProps={{ shrink: true }}
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              </Grid>
             
              <Grid item size={{ md: 6 }}>
                <TextField
                  type="date"
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  inputProps={{
                    min: new Date().toISOString().split("T")[0], // 👈 this disables past dates
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item size={{ md: 6 }}>
                <TextField
                  type="time"
                  label="End Time"
                  InputLabelProps={{ shrink: true }}
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item size={{ md: 8 }}>
                <TextField
                  label="Organizer"
                  value={formData.organizer || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, organizer: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item size={{ md: 4 }}>
                <TextField
                  label="Category"
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item size={{ md: 8 }}>
                <TextField
                  label="Contact Person"
                  value={formData.contact || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item size={{ md: 4 }}>
                <TextField
                  label="Expected Attendees"
                  type="number"
                  value={formData.attendees || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, attendees: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item size={{ md: 12 }}>
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              </Grid>
             <Button
  onClick={() => {
    setEditingPrograms(programs); // Pass current data for editing
    setEditingSponsors(sponsors);
    setOpenProgramForm(true);
  }}
  variant="contained"
>
  {programs.length > 0 || sponsors.length > 0 ? "✏️ Edit Programs / Sponsors" : "➕ Add Programs / Sponsors"}
</Button>

            </Grid>
             <Grid>
             
                {programs.length > 0 && (
                  <Box mt={3}>
                    <Typography variant="h6">📋 Saved Programs</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Start</strong></TableCell>
                          <TableCell><strong>End</strong></TableCell>
                          <TableCell><strong>Activity</strong></TableCell>
                          <TableCell><strong>Speaker</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {programs.map((prog, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{prog.start_time}</TableCell>
                            <TableCell>{prog.end_time}</TableCell>
                            <TableCell>{prog.activity}</TableCell>
                            <TableCell>{prog.speaker}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {sponsors.length > 0 && (
                  <Box mt={3}>
                    <Typography variant="h6">🤝 Event Sponsors</Typography>
                    <ul>
                      {sponsors.map((s, idx) => (
                        <li key={idx}>
                          🏷 {s.name} — {s.donated || "No amount"}
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}

              </Grid>
          </Grid>

          {/* RIGHT SIDE - Location Info */}
          <Grid item size={{ md: 6 }} xs={12}>
            <Grid container spacing={2}>
              <Grid item size={{ md: 12 }}>
                <TextField
                  label="Venue / Establishment Name"
                  value={formData.venue || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, venue: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item size={{ md: 12 }}>
                <TextField
                  label="Full Address"
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item size={{ md: 12 }}>
                <Autocomplete
                  freeSolo
                  options={placeOptions}
                  getOptionLabel={(option) => option.description || ""}
                  onInputChange={handleSearchChange}
                  onChange={handlePlaceSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Place"
                      placeholder="e.g. McDonald's, Ayala Center"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item size={{ md: 12 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography fontWeight="bold">
                    📍 Select Location on Map
                  </Typography>
                  <IconButton onClick={locateUser} color="primary" size="small">
                    <MyLocationIcon />
                  </IconButton>
                </Box>
                <Box
                  ref={mapRef}
                  sx={{
                    height: 420,
                    width: "100%",
                    borderRadius: 2,
                    border: "1px solid #ccc",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    mt: 1,
                  }}
                />
                {formData.latitude && (
                  <Typography mt={1} fontSize="0.9rem" color="text.secondary">
                    Coordinates: {formData.latitude}, {formData.longitude}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onSave} variant="contained" color="primary">
          {isEdit ? "Update" : "Save"}
        </Button>
      </DialogActions>

   <EventProgramFormDialog
  open={openProgramForm}
  onClose={() => setOpenProgramForm(false)}
  programs={editingPrograms}
  sponsors={editingSponsors}
  onSaveAll={({ programs, sponsors }) => {
    setPrograms(programs);
    setSponsors(sponsors);
    setOpenProgramForm(false);
 setFormData((prev) => ({
            ...prev,
           sponsors: sponsors,
            programs:programs
          }));
          
  }}
 
/>

    </Dialog>
  );
};

export default EventFormDialog;
