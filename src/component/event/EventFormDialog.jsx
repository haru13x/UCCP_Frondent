import React, { useRef, useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';


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
  Slide,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import EventProgramFormDialog from "./EventProgramFormDialog";
import { GridCloseIcon } from "@mui/x-data-grid";
import { ArrowBackSharp } from "@mui/icons-material";

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
const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="left"
      ref={ref}
      timeout={{
        enter: 3000, // 3 seconds for entering
        exit: 3000,  // 3 seconds for exiting
      }}
      {...props}
    />
  );
});
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
  const [selectedImage, setSelectedImage] = useState(null); // raw File
  const [previewImage, setPreviewImage] = useState("");     // preview URL
  const fileInputRef = useRef();

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

  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      fullScreen
      height="100vh"
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
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.primary.main, // background: primary
          color: '#fff', // text color: white
          display:'flex'            // text color: error (red)
        }}
      >
        <Button onClick={onClose} color="error" variant="contained">
          <ArrowBackSharp fontSize="small" />Back
        </Button>
        <Typography variant="h5" sx={{ ml: 2,mt:1  }}>
        {isEdit ? `Edit Event -  ${formData?.title}` : "Create Event"}

        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          flex: 1,
          overflowY: 'auto',
          background: 'linear-gradient(to bottom right,rgb(227, 222, 222),rgb(240, 236, 236),rgb(199, 197, 197))', // dark gradient
          color: '#f0f0f0', // light text color
        }}
      >

        <Grid container spacing={2} sx={{ mt: 1, display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: '90%' }}>

          <Grid size={{ md: 6 }} sx={{ display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: 500,
                height: 200,
                border: "2px dashed #ccc",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                backgroundColor: "#f9f9f9",
              }}
              onClick={() => fileInputRef.current.click()}
            >
              {formData.image ? (
                <img
                  src={
                    typeof formData.image === "string"
                      ? `http://127.0.0.1:8000/storage/${formData.image}` // ← use Laravel public path
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
                    setFormData((prev) => ({
                      ...prev,
                      image: file, // replace previous string or File with new File
                    }));
                  }
                }}
              />
            </Box>



            <Grid size={{ md: 10 }} sx={{ mb: 1, }}>
              <Box display="flex" alignItems="center" gap={1}>

                <IconButton onClick={locateUser} color="primary" size="small">
                  <MyLocationIcon />
                </IconButton>
                {formData.latitude && (
                  <Typography mt={1} fontSize="0.9rem" color="text.secondary">
                    Coordinates: {formData.latitude}, {formData.longitude}
                  </Typography>
                )}
              </Box>
              <Box
                ref={mapRef}
                sx={{
                  height: 120,
                  width: "100%",
                  borderRadius: 2,
                  border: "1px solid #ccc",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  mt: 1,
                }}
              />

            </Grid>



            <Grid item size={{ md: 10 }} sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                label="Event Descriptions"
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

          </Grid>
          <Grid container size={{ md: 6 }} sx={{mt:1}}>
            <Grid size={{ md: 12 }}>
              <TextField
                label="Event Name"

                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                fullWidth
              />

            </Grid>
            <Grid size={{ md: 12 }} >
              <Grid container spacing={1}>
                <Grid item size={{ md: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" color="black" gutterBottom>
                    Start
                  </Typography>
                </Grid>
                <Grid item size={{ md: 4 }}>
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
                <Grid item size={{ md: 5 }}>
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
              </Grid>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item size={{ md: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography color="black" variant="h6" gutterBottom>
                    End
                  </Typography>
                </Grid>
                <Grid item size={{ md: 4 }}>
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
                <Grid item size={{ md: 5 }}>
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
              </Grid>
            </Grid>
            <Grid size={{ md: 6 }} >
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
            <Grid size={{ md: 6 }}>
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


            <Grid size={{ md: 12 }} sx={{}}>
              <Button onClick={onSave} variant="contained" color="primary" fullWidth>
                {isEdit ? "Update" : "Create Event"}
              </Button>
            </Grid>
          </Grid>
        </Grid>

      </DialogContent>
      {/* <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        
      </DialogActions> */}

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
            programs: programs
          }));

        }}

      />

    </Dialog>
  );
};

export default EventFormDialog;
