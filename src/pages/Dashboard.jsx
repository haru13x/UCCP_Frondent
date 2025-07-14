import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Stack,
  Button,
} from "@mui/material";
import {
  Group,
  Event,
  ArrowBack,
  ArrowForward,
  People,
  EventAvailableOutlined,
  AccessTime,
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
  const [summary, setSummary] = useState({ users: 0, events: 0 });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState(format(new Date(), "hh:mm:ss a"));

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

  useEffect(() => {
    fetchDashboard(currentYear);
  }, [currentYear]);

  const cards = [
    {
      title: "Total Users",
      value: summary.users,
      icon: <Group />,
      color: "#42a5f5",
    },
    {
      title: "Total Events",
      value: summary.events,
      icon: <Event />,
      color: "#66bb6a",
    },
    {
      title: "Today Events",
      value: summary.todayEvents,
      icon: <EventAvailableOutlined />,
      color: "#66bb6a",
    },
    {
      title: "New Users",
      value: summary.newUsers,
      icon: <People />,
      color: "#42a5f5",
    },
  ];

  return (
    <Box p={3} sx={{ minHeight: "100vh", background: "#f0f4f9" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        UCCP Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid size={{md:4}} item xs={12} md={4}>
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
        <Grid  size={{md:8}}  item xs={12} md={8}>
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
          <Grid  size={{md:7}}  item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minHeight: 400 }}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={
                    chartData.length > 0
                      ? chartData
                      : months.map((month) => ({ month, events: 0 }))
                  }
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="events" fill="#66bb6a" name="Events">
                    <LabelList
                      dataKey="events"
                      position="top"
                      content={({ value }) =>
                        value !== 0 ? <text>{value}</text> : null
                      }
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid  size={{md:5}}  item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minHeight: 400 }}>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={
                      pieData.length > 0
                        ? pieData
                        : [
                          { name: "Events", value: 0 },
                          { name: "Users", value: 0 },
                        ]
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {(pieData.length > 0 ? pieData : []).map((entry, index) => (
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
