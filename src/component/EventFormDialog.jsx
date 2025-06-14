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
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

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

const EventFormDialog = ({
  open,
  onClose,
  formData,
  setFormData,
  onSave,
  isEdit,
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [placeOptions, setPlaceOptions] = useState([]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const initialPosition = {
      lat: formData.latitude || 10.3157,
      lng: formData.longitude || 123.8854,
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

    // Ensure map resizes properly after render
    setTimeout(() => {
      window.google.maps.event.trigger(mapInstance, "resize");
      mapInstance.setCenter(initialPosition);
    }, 200);
  };

  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(() => {
      loadGoogleMapsScript(() => {
        initializeMap();
      });
    }, 100); // Delay ensures dialog is rendered

    return () => {
      clearTimeout(timeout);
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
      setMap(null);
      setMarker(null);
    };
  }, [open]);
  
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

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {isEdit ? "Edit Event" : "Add New Church Event"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item size={{ md: 6 }}>
            <TextField
              label="Title"
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
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item size={{ md: 6 }}>
            <TextField
              type="time"
              label="Time"
              InputLabelProps={{ shrink: true }}
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item size={{ md: 6 }}>
            <TextField
              label="Category"
              value={formData.category || ""}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item size={{ md: 6 }}>
            <TextField
              label="Organizer"
              value={formData.organizer || ""}
              onChange={(e) =>
                setFormData({ ...formData, organizer: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item size={{ md: 6 }}>
            <TextField
              label="Contact Person"
              value={formData.contact || ""}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item size={{ md: 6 }}>
            <TextField
              label="Expected Attendees"
              type="number"
              value={formData.attendees || ""}
              onChange={(e) =>
                setFormData({ ...formData, attendees: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item size={{ md: 6 }}>
            <TextField
              label="Description"
              multiline
              rows={3}
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item size={{ md: 6 }}>
            <TextField
              label="Venue / Establishment Name"
              value={formData.venue || ""}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item size={{ md: 6 }}>
            <TextField
              label="Full Address"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              fullWidth
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
                height: 300,
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onSave} variant="contained" color="primary">
          {isEdit ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventFormDialog;
