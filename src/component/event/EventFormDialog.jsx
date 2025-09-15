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
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
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
import { useSnackbar } from "./SnackbarProvider ";

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
  const [selectedAccountGroups, setSelectedAccountGroups] = useState([]);
  const [openProgramForm, setOpenProgramForm] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [locations, setLocations] = useState([]);
  const { showSnackbar } = useSnackbar();
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);
  
  // Debug logging when dialog opens
  console.log('EventFormDialog rendered with:', {
    open: open,
    isEdit: isEdit,
    formData: formData,
    startDate: formData?.startDate,
    startTime: formData?.startTime,
    endDate: formData?.endDate,
    endTime: formData?.endTime
  });
  // Load account groups
  useEffect(() => {
    const fetchAccountGroups = async () => {
      console.log('Fetching account groups...');
      const res = await UseMethod("get", "account-groups");
      console.log('Account groups response:', res);
      if (res?.data) {
        console.log('Account groups data:', res.data);
        setAccountGroups(res.data);
      } else {
        console.error('No account groups data received');
      }
    };
    if (open) fetchAccountGroups();
  }, [open]);

  // Initialize selectedAccountGroups and formData.accountGroupIds when editing
  useEffect(() => {
    console.log('Initializing selectedAccountGroups:', { open, isEdit, category: formData.category, accountGroupsLength: accountGroups.length, selectedAccountGroupsLength: selectedAccountGroups.length });
    // Only initialize if in edit mode, formData.category exists, accountGroups are loaded, and selectedAccountGroups is empty (meaning it hasn't been set by user interaction yet)
    if (open && isEdit && formData.category && accountGroups.length > 0 && selectedAccountGroups.length === 0) {
      // formData.category is already an array of IDs
      const categoryIds = formData.category;
      console.log('Category IDs from formData (raw) for initialization:', categoryIds);
      const selectedGroups = accountGroups.filter(group => {
        return categoryIds.includes(String(group.id));
      });
      console.log('Selected groups found for initialization:', selectedGroups);
      setSelectedAccountGroups(selectedGroups);
      // Also set accountGroupIds in formData
      setFormData(prev => ({
        ...prev,
        accountGroupIds: categoryIds,
      }));
    } 
  }, [open, isEdit, formData.category, accountGroups, selectedAccountGroups]);
  useEffect(() => {
    if (open && !isEdit) {
      console.log('Add New Event - Initial formData.category:', formData.category);
      console.log('Add New Event - Initial selectedAccountGroups:', selectedAccountGroups);
    }
  }, [open, isEdit, formData.category, selectedAccountGroups]);

  useEffect(() => {
    const fetchOrganizer = async () => {
      const res = await UseMethod("get", `get-church-locations`);
      if (res?.data) setLocations(res.data);
    }
    fetchOrganizer();
  }, [open])

  useEffect(() => {
    console.log('Account Types useEffect - formData.accountGroupIds:', formData.accountGroupIds, 'formData.participants:', formData.participants);
    const fetchAccountTypes = async () => {
      if (formData.accountGroupIds && formData.accountGroupIds.length > 0) {
        const allAccountTypes = [];
        for (const groupId of formData.accountGroupIds) {
          const res = await UseMethod("get", `account-types/${groupId}`);
          if (res?.data) {
            // Add group info to each account type for better identification
            const group = accountGroups.find(g => g.id === groupId);
            const typesWithGroup = res.data.map(type => ({
              ...type,
              groupName: group ? group.description : '',
              groupId: groupId
            }));
            allAccountTypes.push(...typesWithGroup);
          }
        }
        setAccountTypes(allAccountTypes);
      } else {
        setAccountTypes([]);
      }
    };
    fetchAccountTypes();
  }, [formData.accountGroupIds, accountGroups]);

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

  const handleCategoryChange = async (event, values) => {
    setSelectedAccountGroups(values || []);
    setFormData((prev) => ({
      ...prev,
      accountGroupIds: values?.map(v => v.id) || [],
      category: values?.map(v => v.id) || [], // Store IDs as an array of numbers
      participants: [], // Reset participants when groups change
    }));
  };

  const handlePlaceSelect = (event, value) => {
    if (!value || !value.place_id) {
      console.warn('No place selected or missing place_id');
      return;
    }
    
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.warn('Google Maps Places API not loaded');
      return;
    }
    
    if (!map || !marker) {
      console.warn('Map or marker not initialized');
      return;
    }
    
    const placesService = new window.google.maps.places.PlacesService(map);
    placesService.getDetails({ placeId: value.place_id }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry) {
        const location = place.geometry.location;
        marker.setPosition(location);
        map.setCenter(location);
        setFormData((prev) => ({
          ...prev,
          latitude: location.lat(),
          longitude: location.lng(),
          venue: place.name || value.structured_formatting?.main_text || "",
          address: place.formatted_address || value.description || "",
        }));
        
        // Clear the autocomplete options after selection
        setPlaceOptions([]);
      } else {
        console.warn('Places service error:', status);
        showSnackbar({ message: "Unable to get place details. Please try again.", type: "error" });
      }
    });
  };

  const handleSearchChange = (event, value, reason) => {
    const input = value;
    if (!input || input.trim() === '') {
      setPlaceOptions([]);
      return;
    }
    
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.warn('Google Maps Places API not loaded');
      return;
    }
    
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      { 
        input,
        componentRestrictions: { country: 'ph' }, // Restrict to Philippines
        types: ['establishment', 'geocode'] // Include both places and addresses
      }, 
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPlaceOptions(predictions);
        } else {
          console.warn('Places API error:', status);
          setPlaceOptions([]);
        }
      }
    );
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
          width: { xs: "100%", sm: "80%", md: "68%" },
          maxWidth: "100%",
          borderRadius: { xs: 0, sm: 2 },
          background: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#ffffff",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          color: "#1a1a1a",
          py: 1.5,
          px: 2,
          gap: 2
        }}
      >
        <Button
          onClick={onClose}
          startIcon={<ArrowBackSharp />}
          variant="outlined"
          sx={{
            borderColor: "rgba(0, 0, 0, 0.12)",
            color: "#666",
            borderRadius: 2,
            px: 2,
            py: 0.5,
            "&:hover": {
              borderColor: "rgba(0, 0, 0, 0.2)",
              backgroundColor: "rgba(0, 0, 0, 0.04)"
            }
          }}
        >
          Back
        </Button>
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            flexGrow: 1,
            textAlign: "center",
            color: "#1a1a1a"
          }}
        >
          {isEdit ? "✨ Edit Event" : "🎉 Create New Event"}
        </Typography>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          my: 1,
          flex: 1,
          overflowY: "auto",
          background: "#ffffff",
          p: { xs: 1.5, sm: 2 },
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0, 0, 0, 0.05)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "3px",
            "&:hover": {
              background: "rgba(0, 0, 0, 0.3)",
            },
          },
        }}
      >
        <Grid container spacing={1.5} sx={{ p: 0 }}>
          {/* Left Column */}
          <Grid size={{ md: 6 }} item xs={12} md={6}>
            {/* Image Upload */}
            <Card sx={{
              borderRadius: 2,
              background: "#ffffff",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              mb: 1.5
            }}>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: "#1a1a1a", display: "flex", alignItems: "center" }}>
                  <ImageIcon fontSize="small" sx={{ mr: 1, color: "#666" }} />
                  Event Image
                </Typography>
                <Box
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    width: "100%",
                    height: 180,
                    border: "2px dashed rgba(0, 0, 0, 0.2)",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    background: "rgba(0, 0, 0, 0.02)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "rgba(0, 0, 0, 0.3)",
                      background: "rgba(0, 0, 0, 0.04)"
                    },
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
                    <Box textAlign="center">
                      <ImageIcon sx={{ fontSize: 40, color: "rgba(0, 0, 0, 0.4)", mb: 1 }} />
                      <Typography variant="subtitle1" sx={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: 500 }}>
                        Click to upload image
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(0, 0, 0, 0.4)", mt: 0.5 }}>
                        Drag & drop or click to browse
                      </Typography>
                    </Box>
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
            <Card sx={{
              borderRadius: 2,
              background: "#ffffff",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
            }}>
              <CardContent sx={{ p: 1.5 }}>


                <Grid container sx={{ mb: 2 }}>
                  <Grid size={{ md: 12 }}>
                    <Autocomplete
                      freeSolo
                      options={placeOptions}
                      getOptionLabel={(option) => option.description || ""}
                      onInputChange={handleSearchChange}
                      onChange={handlePlaceSelect}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "#666" }} />
                          <div>
                            <div style={{ fontWeight: 500 }}>{option.description}</div>
                            {option.formatted_address && (
                              <div style={{ fontSize: '0.8em', color: '#666' }}>
                                {option.formatted_address}
                              </div>
                            )}
                          </div>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Location"
                          placeholder="e.g. McDonald's, Ayala Center"
                          fullWidth
                          size="small"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    /></Grid>
                  <Grid size={{ md: 12 }}>
                    <TextField
                      label="Venue Name"
                      value={formData.venue || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, venue: value });
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value.trim() === "") {
                          showSnackbar({ message: "Venue name is required", type: "error" });
                        }
                      }}
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



                <Box
                  ref={mapRef}
                  sx={{
                    height: 200,
                    borderRadius: 3,
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: "2px solid rgba(100, 181, 246, 0.5)",
                      boxShadow: "0 4px 20px rgba(100, 181, 246, 0.2)",
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Description */}

          </Grid>

          {/* Right Column */}
          <Grid size={{ md: 6 }} item xs={12} md={6}>
            <Card sx={{
              borderRadius: 2,
              background: "#ffffff",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
            }}>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: "#1a1a1a", mb: 1, display: "flex", alignItems: "center" }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: "#666" }} />
                  {isEdit ? "Edit Event Details" : "Fill Event Details"}
                </Typography>
                <Divider sx={{ mb: 1.5, borderColor: "rgba(0, 0, 0, 0.08)" }} />

                {/* Event Title */}
                <TextField
                  label="Event Name"
                  value={formData.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, title: value });
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value.trim() === "") {
                      showSnackbar({ message: "Event name is required", type: "error" });
                    } else if (value.trim().length < 3) {
                      showSnackbar({ message: "Event name must be at least 3 characters long", type: "error" });
                    }
                  }}
                  fullWidth
                  required
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1.5 }}
                  InputProps={{
                    startAdornment: <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: "#666" }} />
                  }}
                />

                {/* Date & Time */}
                <Grid container spacing={1}>
                  <Grid size={{ md: 6 }} item xs={6}>
                    <TextField
                      type="date"
                      label="Start Date"
                      InputLabelProps={{ shrink: true }}
                      value={formData.startDate || ''}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        const today = new Date().toISOString().split('T')[0];
                        // Allow past dates when editing existing events
                        if (isEdit || selectedDate >= today) {
                          setFormData({ ...formData, startDate: selectedDate });
                          // Reset end date if it's before the new start date
                          if (formData.endDate && formData.endDate < selectedDate) {
                            setFormData({ ...formData, startDate: selectedDate, endDate: '' });
                          }
                        }
                      }}
                      inputProps={{ min: isEdit ? undefined : new Date().toISOString().split('T')[0] }}
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
                      value={formData.startTime || ''}
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
                      value={formData.endDate || ''}
                      onChange={(e) => {
                        const selectedEndDate = e.target.value;
                        // Allow past dates when editing, but still validate end >= start
                        if (!formData.startDate || selectedEndDate >= formData.startDate) {
                          setFormData({ ...formData, endDate: selectedEndDate });
                        }
                      }}
                      fullWidth
                      size="small"
                      inputProps={{ min: formData.startDate }}
                      InputProps={{ startAdornment: <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} /> }}
                    />
                  </Grid>
                  <Grid size={{ md: 6 }} item xs={6}>
                    <TextField
                      type="time"
                      label="End Time"
                      InputLabelProps={{ shrink: true }}
                      value={formData.endTime || ''}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      fullWidth
                      size="small"
                      InputProps={{ startAdornment: <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} /> }}
                    />
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }} item xs={12} sm={6}>
                    <TextField
                      label="Organizer"
                      value={formData.organizer || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.trim() === "") {
                          showSnackbar({ message: "Organizer field cannot be empty", type: "error" });
                        }
                        setFormData({ ...formData, organizer: value });
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value.trim() === "") {
                          showSnackbar({ message: "Please enter an organizer name", type: "error" });
                        }
                      }}
                      fullWidth
                      required
                      variant="outlined"
                      size="small"
                      
                    
                    />
                  </Grid>
                   <Grid size={{ md: 6 }} item xs={6}>
                    <TextField
                      label="Contact Number"
                      value={formData.contact}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only numbers and basic phone formatting characters
                        const phoneRegex = /^[0-9+\-\s()]*$/;
                        if (value === "" || phoneRegex.test(value)) {
                          setFormData({ ...formData, contact: value });
                        } else {
                          showSnackbar({ message: "Please enter a valid phone number", type: "error" });
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value.trim() === "") {
                          showSnackbar({ message: "Contact number is required", type: "error" });
                        } else if (value.replace(/[^0-9]/g, "").length < 10) {
                          showSnackbar({ message: "Contact number must be at least 10 digits", type: "error" });
                        }
                      }}
                      fullWidth
                      required
                      variant="outlined"
                      size="small"
                      sx={{ mb: 1 }}
                      InputProps={{ startAdornment: <ContactPhone fontSize="small" color="action" sx={{ mr: 1 }} /> }}
                    />
                  </Grid>
                  {/* Conference section - only visible to users with role ID 1 */}
                  {currentUser?.role_id === 1 && (
                    <>
                      <Grid size={{ md: 12 }} item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.isconference || false}
                              onChange={(e) => setFormData({ ...formData, isconference: e.target.checked })}
                              color="primary"
                            />
                          }
                          label="This is a conference event (multiple locations)"
                          sx={{  }}
                        />
                      </Grid>
                    
                      <Grid size={{ md: 12, sm: 12 }} item xs={12} sm={6}>
                        <Autocomplete
                          multiple
                          options={locations}
                          getOptionLabel={(option) => option.slug}
                          value={locations.filter(location => 
                            formData.conference_locations?.includes(location.id)
                          )}
                          onChange={(e, values) => {
                            setFormData({
                              ...formData,
                              conference_locations: values.map(v => v.id)
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Conference Locations"
                              size="small"
                              fullWidth
                              required
                            />
                          )}
                        />
                      </Grid>
                    </>
                  )}
                
                </Grid>

                <Grid container spacing={2} sx={{mt:1}}>
                 
                  <Grid size={{ md: 12 }} sx={{my:1}} item xs={6}>
                    <Box>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  options={accountGroups}
                  getOptionLabel={(option) => option.description}
                  value={selectedAccountGroups}
                  onChange={handleCategoryChange}
                  isOptionEqualToValue={(option, value) => {
                       return String(option.id) === String(value.id);
                  }}
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
                      <Typography variant="body2">{option.description}</Typography>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Event Categories"
                      size="small"
                      fullWidth
                      placeholder="Select event categories"
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
                     </Box>
                  </Grid>
                </Grid>
              
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  options={accountTypes}
                  getOptionLabel={(option) => `${option.description} `}
                  value={accountTypes.filter(type => formData.participants.includes(type.id))}
                  onChange={(e, values) => {
                    console.log('Account Type Autocomplete - selected values:', values);
                    const participantData = values.map((v) => ({
                      account_type_id: v.id,
                      account_group_id: v.groupId
                    }));
                    setFormData({
                      ...formData,
                      participants: values.map((v) => v.id), // Store IDs for compatibility
                      participantData: participantData // Store full data for backend
                    });
                  }}
                  isOptionEqualToValue={(option, value) => {
                   
                    return option.id == value.id;
                  }}
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
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2">{option.description}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.groupName}
                        </Typography>
                      </Box>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Participants (Account Types)"
                      size="small"
                      fullWidth
                      placeholder="Select account types from chosen categories"
                    />
                  )}
                />

                <Card sx={{ mt: 1, borderRadius: 3, boxShadow: 3 }}>
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