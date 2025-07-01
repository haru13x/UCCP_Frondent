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
  PeopleAlt,
  ArrowBack,
  ArrowForward,
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

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const COLORS = ["#66bb6a", "#42a5f5", "#ffa726"];

const Dashboard = () => {
  const [summary, setSummary] = useState({ users: 0, events: 0, meetings: 0 });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const fetchDashboard = async (year = currentYear) => {
    const summaryRes = await UseMethod("get", "dashboard/summary");
    const chartRes = await UseMethod("get", `dashboard/chart`, null, `?year=${year}`);

    if (summaryRes?.data) setSummary(summaryRes.data);

    if (chartRes?.data) {
      const monthMap = new Map();
      months.forEach((month) =>
        monthMap.set(month, { month, events: 0, meetings: 0 })
      );

      chartRes.data.events.forEach(({ month, count }) => {
        if (monthMap.has(month)) monthMap.get(month).events = count;
      });
      chartRes.data.meetings.forEach(({ month, count }) => {
        if (monthMap.has(month)) monthMap.get(month).meetings = count;
      });

      setChartData(Array.from(monthMap.values()));
      setPieData([
        { name: "Events", value: chartRes.data.totalEvents ?? 0 },
        { name: "Meetings", value: chartRes.data.totalMeetings ?? 0 },
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
      title: "New Users",
      value: summary.meetings,
      icon: <PeopleAlt />,
      color: "#42a5f5",
    },
    {
      title: "Today Events",
      value: summary.meetings,
      icon: <Event />,
      color: "#66bb6a",
    },
    
  ];

  return (
    <Box p={3} sx={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        UCCP Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12}size={{md:3}} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
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
          </Grid>
        ))}
      </Grid>

      <Box mt={6}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="medium">
            Events & Meetings Overview ({currentYear})
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
          <Grid item size={{md:7}}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: 'auto', minHeight: 400 }}>
              <ResponsiveContainer width="100%" height={350} minWidth={300}>
                <BarChart
                  data={chartData.length > 0 ? chartData : months.map(month => ({ month, events: 0, meetings: 0 }))}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  barGap={10}
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
    content={({ value }) => (value !== 0 ? <text>{value}</text> : null)}
  />
</Bar>
<Bar dataKey="meetings" fill="#42a5f5" name="Meetings">
  <LabelList
    dataKey="meetings"
    position="top"
    content={({ value }) => (value !== 0 ? <text>{value}</text> : null)}
  />
</Bar>

                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item size={{md:5}}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: 'auto', minHeight: 400 }}>
              <ResponsiveContainer width="100%" height={350} minWidth={300}>
                <PieChart>
                  <Pie
                    data={pieData.length > 0 ? pieData : [
                      { name: "Events", value: 0 },
                      { name: "Meetings", value: 0 },
                      { name: "Users", value: 0 },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {(pieData.length > 0 ? pieData : []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
