
import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import { AccessTime, Event, Group, TrendingUp } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import eventsData from "../data/events";
const Dashboard = () => {
  const cards = [
    {
      title: "Total Users",
      value: 1200,
      icon: <Group />,
      color: "#42a5f5",
    },
    {
      title: "Upcoming Events",
      value: 8,
      icon: <Event />,
      color: "#66bb6a",
    },
    {
      title: "System Uptime",
      value: "99.99%",
      icon: <AccessTime />,
      color: "#ffa726",
    },
    {
      title: "Traffic Increase",
      value: "+25%",
      icon: <TrendingUp />,
      color: "#ab47bc",
    },
  ];
const [events, setEvents] = useState(eventsData);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [formData, setFormData] = useState({ title: "", date: "", time: "", location: "", description: "" });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  return (
    <Box sx={{   minHeight: "100vh" }}>
     
      <Grid container spacing={4} md={12} sx={{display:'flex', justifyContent:'center'}} >
        {cards.map((card, index) => (
          <Grid item  sx={{ width:'22%'}} xs={3} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: "white",
                transition: "transform 0.3s",
                cursor: "pointer",
                '&:hover': {
                  transform: "scale(1.03)",
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ backgroundColor: card.color }}>{card.icon}</Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {card.title}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {card.value}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          Upcoming Events
        </Typography>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
           <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item sx={{width:"30%"}} xs={12} sm={6} md={4} key={event.id}>
            <Card
              sx={{
                width:"100%",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 4,
                },
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <EventAvailableIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {event.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  📅 {event.date} at {event.time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📍 {event.location}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {event.description.length > 80
                    ? event.description.slice(0, 77) + "..."
                    : event.description}
                </Typography>
              </CardContent>
              
            </Card>
          </Grid>
        ))}
      </Grid>

        </Paper>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          Upcoming Meetings
        </Typography>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
           <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item sx={{width:"30%"}} xs={12} sm={6} md={4} key={event.id}>
            <Card
              sx={{
                width:"100%",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 4,
                },
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <EventAvailableIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {event.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  📅 {event.date} at {event.time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📍 {event.location}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {event.description.length > 80
                    ? event.description.slice(0, 77) + "..."
                    : event.description}
                </Typography>
              </CardContent>
              
            </Card>
          </Grid>
        ))}
      </Grid>

        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
