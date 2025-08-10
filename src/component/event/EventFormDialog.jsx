import React, { useRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  Slide,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowBackSharp from "@mui/icons-material/ArrowBackSharp";
import { UseMethod } from "../../composables/UseMethod";
import EventProgramFormDialog from "./EventProgramFormDialog";
import { CategorySharp, ContactPhone } from "@mui/icons-material";

// Load Google Maps Script
const loadGoogleMapsScript = (callback) => {
  if (window.google?.maps) {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyA-Psh9ZzR9Qp7tiJcH5RTqhFrr9nYZRdQ&libraries=places";
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
};

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

const EventFormDialog = ({ open, onClose, formData, setFormData, onSave, isEdit }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const mapRef = useRef(null);
  const fileInputRef = useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [placeOptions, setPlaceOptions] = useState([]);
  const [accountGroups, setAccountGroups] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [openProgramForm, setOpenProgramForm] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [organizer, setOrganizer] = useState([]);
  // Load account groups
  useEffect(() => {
    const fetchAccountGroups = async () => {
      const res = await UseMethod("get", "account-groups");
      if (res?.data) setAccountGroups(res.data);
    };
    if (open) fetchAccountGroups();
  }, [open]);
  useEffect(() => {
    const fetchOrganizer = async () => {
      const res = await UseMethod("get", `get-organizer`);
      setOrganizer(res?.data || []);
    }
    fetchOrganizer();
  }, [open])
  // Load account types when group changes
  useEffect(() => {
    const fetchAccountTypes = async () => {
      if (formData.accountGroupId) {
        const res = await UseMethod("get", `account-types/${formData.accountGroupId}`);
        setAccountTypes(res?.data || []);
      }
    };
    fetchAccountTypes();
  }, [formData.accountGroupId]);

  // Initialize Google Maps
  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => {
      loadGoogleMapsScript(initializeMap);
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (mapRef.current) mapRef.current.innerHTML = "";
      setMap(null);
      setMarker(null);
    };
  }, [open]);

  const initializeMap = () => {
    if (!mapRef.current || map) return;

    const initialPosition = {
      lat: parseFloat(formData.latitude) || 10.3157,
      lng: parseFloat(formData.longitude) || 123.8854,
    };

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialPosition,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { elementType: "labels", stylers: [{ visibility: "on" }] },
        { featureType: "water", stylers: [{ color: "#e0f7fa" }] },
      ],
    });

    const mapMarker = new window.google.maps.Marker({
      position: initialPosition,
      map: mapInstance,
      draggable: true,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#1976d2",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "white",
      },
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
  };

  const handleCategoryChange = async (event, value) => {
    if (!value?.id) return;
    setFormData((prev) => ({
      ...prev,
      accountGroupId: value.id,
      category: value.description,
      participants: [],
    }));
    const res = await UseMethod("get", `account-types/${value.id}`);
    setAccountTypes(res?.data || []);
  };

  const handlePlaceSelect = (event, value) => {
    if (!value || !map || !marker) return;
    const placesService = new window.google.maps.places.PlacesService(map);
    placesService.getDetails({ placeId: value.place_id }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
        const location = place.geometry.location;
        marker.setPosition(location);
        map.setCenter(location);
        setFormData((prev) => ({
          ...prev,
          latitude: location.lat(),
          longitude: location.lng(),
          venue: place.name || "",
          address: place.formatted_address || "",
        }));
      }
    });
  };

  const handleSearchChange = (event) => {
    const input = event.target.value;
    if (!input || !window.google) return;
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions({ input }, (predictions) => {
      setPlaceOptions(predictions || []);
    });
  };

  const locateUser = () => {
    if (navigator.geolocation && map && marker) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos);
        marker.setPosition(pos);
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: pos }, (results, status) => {
          if (status === "OK" && results[0]) {
            setFormData((prev) => ({
              ...prev,
              latitude: pos.lat,
              longitude: pos.lng,
              venue: results[0].address_components?.[0]?.long_name || "",
              address: results[0].formatted_address || "",
            }));
          }
        });
      });
    }
  };

  useEffect(() => {
    setPrograms(formData.programs || []);
    setSponsors(formData.sponsors || []);
  }, [open, formData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
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
          justifyContent: "space-between",
          backgroundColor: theme.palette.primary.main,
          color: "white",
          py: 1.5,
          px: 3,
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          startIcon={<ArrowBackSharp />}
          variant="contained"
          color="error"
          size="small"
          sx={{ borderRadius: 2 }}
        >
          Back
        </Button>
        <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1, textAlign: "center" }}>
          {isEdit ? `✏️ Edit Event` : "📅 Create New Event"}
        </Typography>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          flex: 1,
          overflowY: "auto",
          bgcolor: "#f9f9fb",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Grid container spacing={1} sx={{ p: 1 }}>
          {/* Left Column */}
          <Grid size={{ md: 6 }} item xs={12} md={6}>
            {/* Image Upload */}
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  <ImageIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                  Event Image
                </Typography>
                <Box
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    width: "100%",
                    height: 180,
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    bgcolor: "#fafafa",
                    "&:hover": { borderColor: "primary.main", bgcolor: "#f0f7ff" },
                  }}
                >
                  {formData.image ? (
                    <img
                      src={
                        typeof formData.image === "string"
                          ? `${apiUrl}/storage/${formData.image}`
                          : URL.createObjectURL(formData.image)
                      }
                      alt="Event"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Typography color="text.secondary" textAlign="center">
                      🖼️ Click to upload image
                    </Typography>
                  )}
                </Box>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setFormData((prev) => ({ ...prev, image: file }));
                  }}
                />
              </CardContent>
            </Card>

            {/* Map */}
            <Card sx={{ mt: 1, boxShadow: 3 }}>
              <CardContent>


                <Grid container sx={{ mb: 2 }}>
                  <Grid size={{ md: 12 }}>
                    <Autocomplete
                      freeSolo
                      options={placeOptions}
                      getOptionLabel={(option) => option.description || ""}
                      onInputChange={handleSearchChange}
                      onChange={handlePlaceSelect}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Location"
                          placeholder="e.g. McDonald's, Ayala Center"
                          fullWidth
                          size="small"

                        />
                      )}
                    /></Grid>
                  <Grid size={{ md: 12 }}>
                    <TextField
                      label="Venue Name"
                      value={formData.venue || ""}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      fullWidth
                      size="small"
                      sx={{ my: 1 }}
                    />
                  </Grid>
                  <Grid size={{ md: 12 }}>
                    <TextField
                      label="Full Address"
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      fullWidth
                      size="small"

                    />
                  </Grid>
                </Grid>


                {formData.latitude && (
                  <Typography variant="body2" color="text.secondary" mb={1} fontSize="0.85rem">
                    📍 {formData.latitude}, {formData.longitude}
                  </Typography>
                )}
                <Box
                  ref={mapRef}
                  sx={{
                    height: 180,
                    borderRadius: 2,
                    border: "1px solid #ddd",
                    bgcolor: "#e0e0e0",
                  }}
                />
              </CardContent>
            </Card>

            {/* Description */}

          </Grid>

          {/* Right Column */}
          <Grid size={{ md: 6 }} item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
                  {isEdit ? "Edit Event Details" : "Fill Event Details"}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Event Title */}
                <TextField
                  label="Event Name"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  fullWidth
                  required
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                  InputProps={{ startAdornment: <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} /> }}
                />

                {/* Date & Time */}
                <Grid container spacing={2}>
                  <Grid size={{ md: 6 }} item xs={6}>
                    <TextField
                      type="date"
                      label="Start Date"
                      InputLabelProps={{ shrink: true }}
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      fullWidth
                      size="small"
                      InputProps={{ startAdornment: <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} /> }}
                    />
                  </Grid>
                  <Grid size={{ md: 6 }} item xs={6}>
                    <TextField
                      type="time"
                      label="Start Time"
                      InputLabelProps={{ shrink: true }}
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      fullWidth
                      size="small"
                      InputProps={{ startAdornment: <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} /> }}
                    />
                  </Grid>
                  <Grid size={{ md: 6 }} item xs={6}>
                    <TextField
                      type="date"
                      label="End Date"
                      InputLabelProps={{ shrink: true }}
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      fullWidth
                      size="small"
                      InputProps={{ startAdornment: <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} /> }}
                    />
                  </Grid>
                  <Grid size={{ md: 6 }} item xs={6}>
                    <TextField
                      type="time"
                      label="End Time"
                      InputLabelProps={{ shrink: true }}
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      fullWidth
                      size="small"
                      InputProps={{ startAdornment: <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} /> }}
                    />
                  </Grid>
                </Grid>

                <Autocomplete
                  options={organizer}
                  getOptionLabel={(option) => option?.name || ""}
                  value={
                    organizer.find((g) => g.id === parseInt(formData.organizer)) || null
                  }
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      organizer: newValue ? newValue.id : null, // store only the ID
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Organizer"
                      size="small"
                      fullWidth
                      sx={{ my: 2 }}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <CategorySharp fontSize="small" color="action" sx={{ mr: 1 }} />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
                  <Grid container spacing={2} >
                <Grid size={{ md: 6 }} item xs={6}>
                     <TextField
                  label="Contact Number"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  fullWidth
                  required
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                  InputProps={{ startAdornment: <ContactPhone fontSize="small" color="action" sx={{ mr: 1 }} /> }}
                />
                </Grid>
                <Grid size={{ md: 6 }} item xs={6}>
                  {/* Category */}
                  <Autocomplete
                    options={accountGroups}
                    getOptionLabel={(option) => option.description}
                    value={accountGroups.find((g) => g.id === formData.accountGroupId) || null}
                    onChange={handleCategoryChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Event Category"
                        size="small"
                        fullWidth
                        sx={{ mb: 1 }}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <CategorySharp fontSize="small" color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                    )}
                  />
                </Grid>
</Grid>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  options={accountTypes}
                  getOptionLabel={(option) => option.description}
                  value={accountTypes.filter(type =>
                    formData.participants?.includes(type.id)
                  )}
                  onChange={(e, values) =>
                    setFormData({
                      ...formData,
                      participants: values.map((v) => v.id), // ✅ only store IDs
                    })
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Box
                        component="span"
                        sx={{
                          width: 20,

                          height: 20,
                          mr: 1,
                          border: '1px solid gray',
                          borderRadius: '4px',
                          backgroundColor: selected ? '#1976d2' : '#fff',
                        }}
                      />
                      {option.description}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Participants (Account Types)"
                      size="small"
                      fullWidth
                    />
                  )}
                />

                <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      <DescriptionIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      Description
                    </Typography>
                    <TextField
                      label="Event Description"
                      multiline
                      rows={4}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      fullWidth
                      size="small"
                      variant="outlined"
                    />
                  </CardContent>
                </Card>


                {/* Action Buttons */}
                <Box display="flex" gap={2} mt={1}>
                  {/* <Button
                    onClick={() => setOpenProgramForm(true)}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ borderRadius: 8 }}
                  >
                    🎤 Add Programs & Sponsors
                  </Button> */}
                  <Button
                    onClick={onSave}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ borderRadius: 8, fontWeight: 600 }}
                  >
                    {isEdit ? "🔄 Update Event" : "✅ Create Event"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Nested Dialog */}
      <EventProgramFormDialog
        open={openProgramForm}
        onClose={() => setOpenProgramForm(false)}
        programs={programs}
        sponsors={sponsors}
        onSaveAll={({ programs, sponsors }) => {
          setPrograms(programs);
          setSponsors(sponsors);
          setFormData((prev) => ({ ...prev, programs, sponsors }));
        }}
      />
    </Dialog>
  );
};

export default EventFormDialog;