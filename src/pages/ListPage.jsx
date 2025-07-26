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
} from "@mui/material";
import {
  Event as EventIcon,
  Groups as MeetingIcon,
  CalendarToday,
  FiberManualRecord,
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

const ListPage = () => {
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
const [search, setSearch] = useState("");
const fetchTabData = async (tabName) => {
  setLoading(true);
  try {
    let payload = {
      search : searchInput
    }
    const res = await UseMethod("post", `events-list/${tabName}`, payload);
    setEvents((prev) => ({
      ...prev,
      [tabName]: res.data.map((e) => ({ ...e, type: "event" })),
    }));
  } catch (error) {
    console.error("Fetch failed:", error);
    showSnackbar({ message: "Server error while fetching events.", type: "error" });
  } finally {
    setLoading(false);
  }
};
  

useEffect(() => {
  fetchTabData(tab);
}, [tab]);



  const handleGenerateQR = async () => {
    setLoadingQR(true);
    const res = await UseMethod("post", `qrcodes/generate/${selectedEvent.id}`);
    if (res?.data?.qr_url) {
      setQrPath(res.data.qr_url);
    }
    setLoadingQR(false);
  };

  const printImage = (src) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      `<img src="${src}" onload="window.print();window.close()" style="max-width:100%"/>`
    );
    printWindow.document.close();
  };

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
          borderLeft: `6px solid`,
          borderColor: `${color}.main`,
          cursor: "pointer",
          transition: "all 0.3s",
          "&:hover": {
            boxShadow: 4,
            transform: "translateY(-2px)",
            backgroundColor: `${color}.50`,
          },
        }}
      >
        <CardContent>
          <Box display="flex">
            <Avatar sx={{ bgcolor: `${color}.main`, mr: 2 }}>{icon}</Avatar>
            <Box flex={1}>
              <Typography variant="h6" fontWeight="bold">
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                {item.start_date} {item.start_time} – {item.end_date} {item.end_time}
              </Typography>
              {item.venue && <Typography variant="body2">📍 {item.venue}</Typography>}
              {item.address && <Typography variant="body2">🗺️ {item.address}</Typography>}
              {item.contact && <Typography variant="body2">📞 {item.contact}</Typography>}
            </Box>
            {item.image && (
              <Box
                component="img"
                src={`${apiUrl}/storage/${item.image}`}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  ml: 2,
                  objectFit: "cover",
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderTimeline = (items) => {
    const grouped = groupByDate(items);
    return Object.entries(grouped).map(([date, group]) => (
      <Box key={date} display="flex" position="relative" mb={1}>
        <Box sx={{ minWidth: 180, position: "relative" }}>
          <FiberManualRecord
            sx={{
              color: "primary.main",
              position: "absolute",
              top: 4,
              left: 7,
              zIndex: 1,
              fontSize: 16,
              backgroundColor: "#fff",
              borderRadius: "50%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: 14,
              top: 14,
              bottom: 0,
              width: 2,
              borderLeft: "2px dashed #ccc",
              zIndex: 0,
            }}
          />
          <Typography variant="subtitle2" sx={{ ml: 4 }} fontWeight="bold">
            {formatTimelineDate(date)}
          </Typography>
        </Box>
        <Box sx={{ ml: 6, flexGrow: 1 }}>{group.map((item) => renderCard(item))}</Box>
      </Box>
    ));
  };

  return (
    <Box>
      {/* Tabs */}
   <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  flexWrap="wrap"
  mb={2}
  maxWidth="950px"
  mx="auto"
>
  {/* Tabs */}
  <Tabs value={tab} onChange={(e, v) => setTab(v)}>
    <Tab value="today" label="Today" />
    <Tab value="upcoming" label="Upcoming" />
    <Tab value="past" label="Past" />
  </Tabs>

  {/* Search Field */}
  <Box display="flex" alignItems="center" gap={1} mt={{ xs: 2, sm: 0, width:'50%' }}>
    <TextField
      fullWidth
      size="small"
      variant="outlined"
       onKeyDown={(e) => {
                                        if (e.key === "Enter") fetchTabData(tab);
                                    }}
      placeholder="Search events..."
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    />
    <Box>
      <Button
        onClick={() => {
          setSearch(searchInput);
          fetchTabData(tab); // Trigger search
        }}
        style={{
          padding: '6px 16px',
          border: 'none',
          borderRadius: 4,
          backgroundColor: '#1976d2',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Search
      </Button>
    </Box>
  </Box>
</Box>



      {/* Content */}
      <Box maxWidth="950px" mx="auto">
        <Divider sx={{ mb: 2 }} />
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : events[tab].length > 0 ? (
          renderTimeline(events[tab])
        ) : (
          <Box textAlign="center" mt={2}>

            <Box mt={0} textAlign="center">
              <img
                src="no_data.svg" // change this to the actual path of your image
                alt="No Data"
                maxWidth="350px"
                style={{ maxWidth: "300px", marginBottom: 8, marginTop: 5 }}
              />
              <Typography>
                No {tab.charAt(0).toUpperCase() + tab.slice(1)} Events Found
              </Typography>

            </Box>
          </Box>
        )}
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

export default ListPage;
