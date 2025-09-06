// src/pages/EventList.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  TextField,
  Button,
  InputAdornment,
  useMediaQuery,
  useTheme,
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
const formatTimelineDate = (dateStr) => {
  const date = new Date(dateStr);
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
    const date = item.start_date || item.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });
  return groups;
};

const EventList = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("today");
  const [events, setEvents] = useState({ today: [], upcoming: [], past: [] });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const { showSnackbar } = useSnackbar();
  const [qrPath, setQrPath] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchTabData = async (tabName) => {
    setLoading(true);
    try {
      const payload = { search: searchInput };
      const res = await UseMethod("post", `events-list/${tabName}`, payload);
      setEvents((prev) => ({
        ...prev,
        [tabName]: res.data.map((e) => ({ ...e, type: "event" })),
      }));
    } catch (error) {
      console.error("Fetch failed:", error);
      showSnackbar({
        message: "Failed to load events. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabData(tab);
  }, [tab]);

  const handleSearch = () => {
    fetchTabData(tab);
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
              <Typography variant="h6" fontWeight="600" color="text.primary">
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" mt={0.5}>
                <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                {item.start_date} {item.start_time} – {item.end_date} {item.end_time}
              </Typography>
              {item.venue && (
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  📍 {item.venue}
                </Typography>
              )}
              {item.location && (
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  ⛪ {item.location.name}
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

  // Render Timeline View
  const renderTimeline = (items) => {
    const grouped = groupByDate(items);
    return Object.entries(grouped).map(([date, group]) => (
      <Box key={date} display="flex" position="relative" mb={3}>
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
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
      {/* Header: Tabs + Search */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
        maxWidth="950px"
        mx="auto"
      >
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "16px",
            },
            "& .Mui-selected": {
              color: "#1976d2",
            },
          }}
        >
          <Tab value="today" label="Today" />
          <Tab value="upcoming" label="Upcoming" />
          {/* <Tab value="past" label="Past" /> */}
        </Tabs>

        {/* Search */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          sx={{ display: "flex", width: { xs: "100%", sm: "auto" } }}
        >
          <TextField
            size="small"
            placeholder="Search events..."
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

      {/* Content */}
      <Box maxWidth="950px" mx="auto">
        <Divider sx={{ mb: 3, borderColor: "divider" }} />

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={6}>
            <CircularProgress color="primary" />
          </Box>
        ) : events[tab].length > 0 ? (
          renderTimeline(events[tab])
        ) : (
          <Box textAlign="center" py={6}>
            <Box component="img" src="/event.png" alt="No events" sx={{ width: 290, mb: 2, opacity: 0.6 }} />
            <Typography variant="h6" color="text.secondary">
              No {tab.charAt(0).toUpperCase() + tab.slice(1)} Events Found
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Try adjusting your search or check back later.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Slide Dialog */}
      <EventSlideDialog
        open={dialogOpen}
        onClose={() =>{ setDialogOpen(false); fetchTabData(tab)}}
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

export default EventList;