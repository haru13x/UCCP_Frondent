import React, { useRef, useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';
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
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import EventProgramFormDialog from "./EventProgramFormDialog";
import { ArrowBackSharp } from "@mui/icons-material";
import { UseMethod } from "../../composables/UseMethod";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const EventFormDialog = ({ open, onClose, formData, setFormData, onSave, isEdit }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [placeOptions, setPlaceOptions] = useState([]);
  const [accountGroups, setAccountGroups] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const fileInputRef = useRef();
  const [openProgramForm, setOpenProgramForm] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const theme = useTheme();

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

  useEffect(() => {
    const fetchAccountGroups = async () => {
      const res = await UseMethod("get", "account-groups");
      if (res?.data) {
        setAccountGroups(res.data);
      }
    };
    if (open) fetchAccountGroups();
  }, [open]);
  useEffect(() => {
    const fetchOnEdit = async () => {
      if (formData.accountGroupId) {
        const res = await UseMethod("get", `account-types/${formData.accountGroupId}`);
        setAccountTypes(res?.data || []);
      }
    };
    fetchOnEdit();
  }, [formData.accountGroupId]);
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
          width: { xs: "100%", sm: "90%", md: "85%" },
        },
      }}
    >
      <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: '#fff', display: 'flex' }}>
        <Button onClick={onClose} color="error" variant="contained">
          <ArrowBackSharp fontSize="small" /> Back
        </Button>
        <Typography variant="h5" sx={{ ml: 2, mt: 1 }}>
          {isEdit ? `Edit Event - ${formData?.title}` : "Create Event"}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ flex: 1, overflowY: 'auto', background: 'linear-gradient(to bottom right,#e3dede,#f0ecec,#c7c5c5)' }}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item md={6}>
            <Box sx={{ width: 500, height: 200, border: "2px dashed #ccc", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", backgroundColor: "#f9f9f9" }}
              onClick={() => fileInputRef.current.click()}
            >
              {formData.image ? (
                <img
                  src={
                    typeof formData.image === "string"
                      ? `http://127.0.0.1:8000/storage/${formData.image}`
                      : URL.createObjectURL(formData.image)
                  }
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography color="textSecondary">Click to upload event image</Typography>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData((prev) => ({ ...prev, image: file }));
                  }
                }}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <IconButton onClick={locateUser} color="primary" size="small">
                <MyLocationIcon />
              </IconButton>
              {formData.latitude && (
                <Typography fontSize="0.9rem" color="text.secondary">
                  Coordinates: {formData.latitude}, {formData.longitude}
                </Typography>
              )}
            </Box>
            <Box ref={mapRef} sx={{ height: 120, width: "100%", borderRadius: 2, border: "1px solid #ccc", mt: 1 }} />
            <TextField
              label="Event Descriptions"
              multiline
              rows={4}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              size="small"
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid item md={6}>
            <TextField
              label="Event Name"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
            />

            <Grid container spacing={1} mt={1}>
              <Grid item md={6}>
                <TextField
                  type="date"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  type="time"
                  label="Start Time"
                  InputLabelProps={{ shrink: true }}
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  type="date"
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  type="time"
                  label="End Time"
                  InputLabelProps={{ shrink: true }}
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>

            <TextField
              label="Organizer"
              value={formData.organizer || ""}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              fullWidth
              size="small"
              sx={{ mt: 2 }}
            />

            <Autocomplete
              options={accountGroups}
              getOptionLabel={(option) => option.description}
              value={accountGroups.find(g => g.id === formData.accountGroupId) || null}
              onChange={handleCategoryChange}
              renderInput={(params) => (
                <TextField {...params} label="Select Account Group" size="small" fullWidth />
              )}
              sx={{ my: 2 }}
            />

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


            <Autocomplete
              freeSolo
              options={placeOptions}
              getOptionLabel={(option) => option.description || ""}
              onInputChange={handleSearchChange}
              onChange={handlePlaceSelect}
              renderInput={(params) => (
                <TextField {...params} label="Search Place" placeholder="e.g. McDonald's, Ayala Center" fullWidth size="small" />
              )}
              sx={{ mt: 2 }}
            />

            <TextField
              label="Venue / Establishment Name"
              value={formData.venue || ""}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              fullWidth
              size="small"
              sx={{ mt: 2 }}
            />

            <TextField
              label="Full Address"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
              size="small"
              sx={{ mt: 2 }}
            />

            <Button
              onClick={onSave}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              {isEdit ? "Update" : "Create Event"}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      <EventProgramFormDialog
        open={openProgramForm}
        onClose={() => setOpenProgramForm(false)}
        programs={programs}
        sponsors={sponsors}
        onSaveAll={({ programs, sponsors }) => {
          setPrograms(programs);
          setSponsors(sponsors);
          setFormData((prev) => ({
            ...prev,
            sponsors,
            programs
          }));
        }}
      />
    </Dialog>
  );
};

export default EventFormDialog;
