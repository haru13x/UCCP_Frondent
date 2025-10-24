import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Group,
  Event,
  ArrowBack,
  ArrowForward,
  People,
  EventAvailableOutlined,
  AccessTime,
  CalendarMonth,
  LocationOn,
  Groups,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import { UseMethod } from "../composables/UseMethod";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import format from "date-fns/format";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const COLORS = ["#66bb6a", "#42a5f5"];

const Dashboard = () => {
  const [summary, setSummary] = useState({ users: 0, events: 0, todayEvents: 0, newUsers: 0 });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState(format(new Date(), "hh:mm:ss a"));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const cards = [
    {
      title: "Total Users",
      value: summary.users || 0,
      icon: <Group />,
      color: "#42a5f5"
    },
    {
      title: "Total Events",
      value: summary.events || 0,
      icon: <Event />,
      color: "#66bb6a"
    },
    {
      title: "Today Events",
      value: summary.todayEvents || 0,
      icon: <EventAvailableOutlined />,
      color: "#ec407a"
    },
    {
      title: "New Users",
      value: summary.newUsers || 0,
      icon: <People />,
      color: "#ab47bc"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "hh:mm:ss a"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async (year = currentYear) => {
    const summaryRes = await UseMethod("get", "dashboard/summary");
    const chartRes = await UseMethod("get", `dashboard/chart`, null, `?year=${year}`);

    if (summaryRes?.data) setSummary(summaryRes.data);

    if (chartRes?.data) {
      const monthMap = new Map();
      months.forEach((month) =>
        monthMap.set(month, { month, events: 0 })
      );

      chartRes.data.events.forEach(({ month, count }) => {
        if (monthMap.has(month)) monthMap.get(month).events = count;
      });

      setChartData(Array.from(monthMap.values()));
      setPieData([
        { name: "Events", value: chartRes.data.totalEvents ?? 0 },
        { name: "Users", value: chartRes?.data?.totalUsers ?? 0 },
      ]);
    }
  };

  const fetchEventsByDate = async (date) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await UseMethod("post", "dashboard/events-by-date", { date: formattedDate });
      if (response?.data) {
        setSelectedDateEvents(response.data.events);
        setIsAdmin(response.data.isAdmin);
        // setEventsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchDashboard(currentYear);
  }, [currentYear]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchEventsByDate(date);
  };

  const EventsList = () => (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        mt: 2,
        borderRadius: 4,
        background: "linear-gradient(to bottom, #ffffff, #f3f6f9)",
        minHeight: 420,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        maxHeight: 500,
        overflow: 'auto'
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <CalendarMonth color="primary" />
        <Typography variant="h6">
          Events for {format(selectedDate, "MMMM d, yyyy")}
        </Typography>
      </Stack>
      {selectedDateEvents.length > 0 ? (
        <List>
          {selectedDateEvents.map((event, index) => (
            <React.Fragment key={event.id}>
              <ListItem>
                <ListItemIcon>
                  <Event color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2">
                          {format(new Date(event.start_date), "h:mm a")} - {format(new Date(event.end_date), "h:mm a")}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2">{event.venue}</Typography>
                      </Stack>
                      {isAdmin && event.eventModes && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Groups fontSize="small" color="action" />
                          <Typography variant="body2">
                            Groups: {event.eventModes.map(mode => mode.eventGroup?.description).join(", ")}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  }
                />
              </ListItem>
              {index < selectedDateEvents.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{ height: '300px' }}
        >
          <Event sx={{ fontSize: 60, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary">
            No events for this date
          </Typography>
        </Stack>
      )}
    </Paper>
  );

  return (
    <Box p={3} sx={{ minHeight: "100vh", background: "#f0f4f9" }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid size={{md:4 , xs:6, sm:12}} item xs={12} md={4}>
          {cards.map((card, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                p: 3,
                mt: 2,
                borderRadius: 3,
                backgroundColor: "#fff",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 6,
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: card.color }}>{card.icon}</Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {card.title}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {card.value}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Grid>

        {/* Calendar + Time */}
        <Grid size={{md:4, sm:12, xs:12}} item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              mt: 2,
              borderRadius: 4,
              background: "linear-gradient(to bottom, #ffffff, #f3f6f9)",
              minHeight: 420,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight="bold" color="primary.dark">
                📅 Event Calendar
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTime color="action" />
                <Typography variant="subtitle1" fontWeight="bold">
                  {currentTime}
                </Typography>
              </Stack>
            </Stack>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                sx={{
                  bgcolor: "#ffffff",
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  "& .MuiPickersDay-root": {
                    fontWeight: "500",
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      color: "#1565c0",
                    },
                  },
                  "& .MuiPickersDay-today": {
                    borderColor: "#1565c0",
                  },
                  "& .MuiPickersCalendarHeader-root": {
                    backgroundColor: "#e3f2fd",
                    borderRadius: 2,
                    mb: 2,
                  },
                }}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>

        {/* Events List */}
        <Grid size={{md:4, xs:12}} item xs={12} md={4}>
          <EventsList />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Box mt={6}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight="medium">
            Events Overview ({currentYear})
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<ArrowBack />}
              variant="outlined"
              onClick={() => setCurrentYear(currentYear - 1)}
            >
              Prev Year
            </Button>
            <Button
              endIcon={<ArrowForward />}
              variant="outlined"
              onClick={() => setCurrentYear(currentYear + 1)}
            >
              Next Year
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{md:7}} item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minHeight: 400 }}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={
                    chartData.length > 0
                      ? chartData
                      : months.map((month) => ({ month, events: 0 }))
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="events" fill="#42a5f5" name="Events">
                    <LabelList dataKey="events" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid size={{md:5}} item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minHeight: 400 }}>
              <Typography variant="h6" mb={2}>
                Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
