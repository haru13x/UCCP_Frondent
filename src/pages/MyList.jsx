// src/pages/MyList.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  TextField,
  Button,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import {
  Event as EventIcon,
  Groups as MeetingIcon,
  CalendarToday,
  FiberManualRecord,
  Search,
  EventBusy,
} from "@mui/icons-material";
import { UseMethod } from "../composables/UseMethod";
import EventSlideDialog from "../component/event/EventSlideDialog";
import { useSnackbar } from "../component/event/SnackbarProvider ";
import Calendar from "../component/Calendar";

// Parse YYYY-MM-DD as a local date to avoid timezone shift
const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

const formatTimelineDate = (dateStr) => {
  const date = parseLocalDate(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    weekday: "long",
  }).format(date);
};

const groupByDate = (items) => {
  const groups = {};
  items.forEach((item) => {
    const date = item.start_date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });
  return groups;
};

const MyList = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]); // events shown in the timeline
  const [monthEvents, setMonthEvents] = useState([]); // events used for calendar dots
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const { showSnackbar } = useSnackbar();
  const [qrPath, setQrPath] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch events for a specific month and year (for calendar dots and default timeline)
  const fetchMonthEvents = async (month, year) => {
    setLoading(true);
    try {
      const monthUrl = `my-events-list?month=${month}&year=${year}`;
      const monthRes = await UseMethod("get", monthUrl);
      const data = Array.isArray(monthRes?.data) ? monthRes.data : [];
      setMonthEvents(data);
      // If no specific date selected, show month events in timeline
      if (!selectedDate) {
        const timelineReady = data.map((e) => ({ ...e, type: e.type || "event" }));
        setEvents(timelineReady);
      }
    } catch (error) {
      console.error("Failed to fetch month events:", error);
      showSnackbar({
        message: "Failed to load your month events.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch events for a specific date (for timeline only)
  const fetchDateEvents = async (specificDate) => {
    setLoading(true);
    try {
      const dateUrl = `my-events-list?date=${specificDate}`;
      const dateRes = await UseMethod("get", dateUrl);
      const data = Array.isArray(dateRes?.data) ? dateRes.data : [];
      const timelineReady = data.map((e) => ({ ...e, type: e.type || "event" }));
      setEvents(timelineReady);
    } catch (error) {
      console.error("Failed to fetch date events:", error);
      showSnackbar({
        message: "Failed to load events for the selected date.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize with current month
    fetchMonthEvents(currentMonth, currentYear);
  }, []);

  useEffect(() => {
    // When month/year changes, clear selected date and refetch month events
    if (selectedDate === null) {
      fetchMonthEvents(currentMonth, currentYear);
    }
  }, [currentMonth, currentYear, selectedDate]);

  useEffect(() => {
    // When a specific date is selected, fetch only that date's events
    if (selectedDate) {
      fetchDateEvents(selectedDate);
    }
  }, [selectedDate]);

  const handleSearch = () => {
    if (selectedDate) {
      fetchDateEvents(selectedDate);
    } else {
      fetchMonthEvents(currentMonth, currentYear);
    }
  };

  const handleGenerateQR = async () => {
    setLoadingQR(true);
    try {
      const res = await UseMethod("post", `qrcodes/generate/${selectedEvent.id}`);
      if (res?.data?.qr_url) {
        setQrPath(res.data.qr_url);
      }
    } catch (err) {
      showSnackbar({ message: "Failed to generate QR code.", type: "error" });
    } finally {
      setLoadingQR(false);
    }
  };

  const printImage = (src) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      `<img src="${src}" onload="window.print();window.close()" style="max-width:100%"/>`
    );
    printWindow.document.close();
  };

  // Render Event Card
  const renderCard = (item) => {
    const isEvent = item.type === "event";
    const icon = isEvent ? <EventIcon /> : <MeetingIcon />;
    const color = isEvent ? "success" : "primary";
    const isCancelled = item.status_id === 2 || item.status === "Cancelled";

    return (
      <Card
        key={`${item.type}-${item.id}`}
        onClick={() => {
          setSelectedEvent(item);
          setDialogOpen(true);
          setTabIndex(0);
          setQrPath(null);
        }}
        sx={{
          mb: 2,
          borderLeft: `5px solid`,
          borderColor: `${color}.main`,
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 3,
            transform: "translateY(-2px)",
            borderColor: `${color}.dark`,
            backgroundColor: `${color}.50`,
          },
        }}
      >
        <CardContent>
          <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2}>
            <Avatar sx={{ bgcolor: `${color}.main`, alignSelf: "flex-start" }}>{icon}</Avatar>
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  {item.title}
                </Typography>
                <Chip
                  size="small"
                  label={isCancelled ? "Cancelled" : "Active"}
                  color={isCancelled ? "error" : "success"}
                  icon={isCancelled ? <EventBusy fontSize="small" /> : undefined}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" mt={0.5}>
                <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                {item.start_date} {item.start_time} – {item.end_date} {item.end_time}
              </Typography>
              {item.venue && (
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  📍 {item.venue}
                </Typography>
              )}
              {item.address && (
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  🗺️ {item.address}
                </Typography>
              )}
              {item.contact && (
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  📞 {item.contact}
                </Typography>
              )}
            </Box>
            {item.image && (
              <Box
                component="img"
                src={`${apiUrl}/storage/${item.image}`}
                alt={item.title}
                sx={{
                  width: isMobile ? "100%" : 100,
                  height: isMobile ? 120 : 100,
                  borderRadius: 2,
                  objectFit: "cover",
                  mt: isMobile ? 1 : 0,
                }}
                onError={(e) => {
                  e.target.src = "/placeholder-event.jpg"; // fallback image
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Handle calendar date click: ONLY fetch by date, do not refetch month
  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    fetchDateEvents(dateStr);
  };

  // Handle calendar month change
  const handleMonthChange = (monthDate) => {
    const newMonth = monthDate.getMonth() + 1; // JavaScript months are 0-indexed
    const newYear = monthDate.getFullYear();
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(null); // Clear specific date selection when changing months
    // Fetch month events for the new month/year
    fetchMonthEvents(newMonth, newYear);
  };
  
  // Clear date filter
  const handleClearFilter = () => {
    setSelectedDate(null);
    const today = new Date();
    const m = today.getMonth() + 1;
    const y = today.getFullYear();
    setCurrentMonth(m);
    setCurrentYear(y);
    fetchMonthEvents(m, y);
  };

  // Render Timeline View
  const renderTimeline = (items) => {
    const grouped = groupByDate(items);
    return Object.entries(grouped).map(([date, group]) => (
      <Box 
        key={date} 
        id={`date-${date}`}
        display="flex" 
        position="relative" 
        mb={3}
        sx={{
          transition: 'background-color 0.3s ease',
          borderRadius: 1,
          p: 1,
          ml: -1,
        }}
      >
        {/* Timeline Dot & Line */}
        <Box sx={{ position: "relative", minWidth: 160 }}>
          <FiberManualRecord
            sx={{
              color: "primary.main",
              position: "absolute",
              top: 8,
              left: 7,
              zIndex: 1,
              fontSize: 16,
              backgroundColor: "#fff",
              borderRadius: "50%",
              boxShadow: 1,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: 14,
              top: 20,
              bottom: 0,
              width: 2,
              borderLeft: "2px dashed #e0e0e0",
            }}
          />
          <Typography
            variant="subtitle2"
            sx={{
              ml: 4,
              fontWeight: "bold",
              color: "primary.main",
              mt: 1,
            }}
          >
            {formatTimelineDate(date)}
          </Typography>
        </Box>

        {/* Event Cards */}
        <Box sx={{ ml: 3, flexGrow: 1 }}>{group.map((item) => renderCard(item))}</Box>
      </Box>
    ));
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 ,height: '100vh'}}>
      {/* Header: Month/Year Display + Search */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
        
        maxWidth={{ xs: "950px", md: "1400px" }}
        mx="auto"
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            {new Date(currentYear, currentMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Typography>
          {selectedDate && (
            <Typography variant="body1" color="text.secondary">
              - {parseLocalDate(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Typography>
          )}
        </Box>

        {/* Search and Filter Controls */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", width: { xs: "100%", sm: "auto" } }}>
          {/* Date Filter Indicator */}
          {selectedDate && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "primary.50", px: 2, py: 1, borderRadius: 1 }}>
              <Typography variant="body2" color="primary.main">
                Viewing: {parseLocalDate(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleClearFilter}
                sx={{ minWidth: "auto", px: 1 }}
              >
                Clear
              </Button>
            </Box>
          )}
          
          {/* Search */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            sx={{ display: "flex" }}
          >
            <TextField
              size="small"
              placeholder="Search my events..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                borderRadius: 2,
                width: { xs: "100%", sm: 350 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "28px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                ml: 1,
                px: 2.5,
                height: 40,
                borderRadius: "28px",
                fontWeight: "600",
                display: { xs: "none", sm: "inline-flex" },
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box maxWidth={{ xs: "950px", md: "1400px" }} mx="auto">
        <Divider sx={{ mb: 3, borderColor: "divider" }} />
        
        {/* Main Content with Calendar Layout */}
        <Box 
          display="flex" 
          gap={3} 
          alignItems="flex-start"
          sx={{
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {/* Main Events Content */}
          <Box 
            sx={{ 
              flex: 1,
              minWidth: 0, // Prevents flex item from overflowing
              maxWidth: { xs: '100%', md: 'calc(100% - 340px)' }
            }}
          >
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" py={6}>
                <CircularProgress color="primary" />
              </Box>
            ) : (() => {
              // Show all events (either for specific date or for the month)
              const eventsToShow = events || [];
              
              return eventsToShow.length > 0 ? (
                renderTimeline(eventsToShow)
              ) : (
                <Box textAlign="center" py={6}>
                  <Box component="img" src="/event.png" alt="No events" sx={{ width: 320, opacity: 0.6 }} />
                  <Typography variant="h6" color="text.secondary">
                    {selectedDate 
                      ? `No Events Found for ${parseLocalDate(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
                      : `No Events Found for ${new Date(currentYear, currentMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {selectedDate 
                      ? 'No events are scheduled for this date.'
                      : 'No events are scheduled for this month.'
                    }
                  </Typography>
                </Box>
              );
            })()}
          </Box>
          
          {/* Calendar Sidebar */}
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'block' },
              flexShrink: 0,
              position: 'sticky',
              top: 20,
            }}
          >

            <Calendar 
              events={monthEvents} 
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
              onMonthChange={handleMonthChange}
            />
          </Box>
        </Box>
      </Box>

      {/* Slide Dialog */}
      <EventSlideDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        event={selectedEvent}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        qrPath={qrPath}
        loadingQR={loadingQR}
        handleGenerateQR={handleGenerateQR}
        printImage={printImage}
      />
    </Box>
  );
};

export default MyList;