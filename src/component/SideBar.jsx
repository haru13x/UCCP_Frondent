import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Typography,
  Box,
  Divider,
  Tooltip
} from "@mui/material";
import {
  Dashboard,
  People,
  Event,
  Settings,
  ExpandLess,
  ExpandMore,
  Rule,
  Groups,
  EventNote,
  HowToReg,
  MeetingRoom,
  BreakfastDining,
  History,
  Upcoming,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import ChurchIcon from '@mui/icons-material/Church';
import { useState } from "react";
import { Link } from "react-router-dom";
import { DRAWER_WIDTH_EXPANDED, DRAWER_WIDTH_COLLAPSED } from "../layout/constants";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const [openMeetings, setOpenMeetings] = useState(false);
    const [openEvents, setOpenEvents] = useState(false);

  const drawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          transition: "width 0.3s",
          overflowX: "hidden",
          background: "linear-gradient(to bottom right, #e3f2fd, #ffffff)",
          borderRight: "1px solid #ccc",
        },
      }}
    >
      <Box sx={{ marginTop: "86px", textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            px: collapsed ? 0 : 2,
            py: 1,
            transition: "all 0.3s ease-in-out",
          }}
        >
          {!collapsed && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              <ChurchIcon sx={{ color: "#1565c0", fontSize: 30 }} />
              <Typography
                variant="h6"
                sx={{ ml: 1, color: "#1565c0", fontWeight: "bold" }}
              >
                UCCP
              </Typography>
            </Box>
          )}
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              bgcolor: "#e3f2fd",
              borderRadius: 2,
              boxShadow: 1,
              justifyContent: "flex-end",
              "&:hover": {
                bgcolor: "#bbdefb",
              },
            }}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>

        <Divider sx={{ my: 1, backgroundColor: "#cfd8dc" }} />

        {/* Collapse Button */}
      </Box>

      <List>
        <Tooltip
          title="Dashboard"
          placement="right"
          disableHoverListener={!collapsed}
        >
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <Dashboard color="primary" />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Dashboard" />}
          </ListItem>
        </Tooltip>

        <Tooltip
          title="Events"
          placement="right"
          disableHoverListener={!collapsed}
        >
          <ListItem button onClick={() => setOpenEvents(!openEvents)}>
            <ListItemIcon>
              <Event color="primary" />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Management" />}
            {!collapsed && (openEvents ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>
        </Tooltip>
        <Collapse in={openEvents && !collapsed} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/events" sx={{ pl: 4 }}>
              <ListItemIcon>
                <Groups color="action" />
              </ListItemIcon>
              <ListItemText primary="Events" />
            </ListItem>
            <ListItem button component={Link} to="/meetings" sx={{ pl: 4 }}>
              <ListItemIcon>
                <EventNote color="action" />
              </ListItemIcon>
              <ListItemText primary="Meetings" />
            </ListItem>
            <ListItem button component={Link} to="/attendance" sx={{ pl: 4 }}>
              <ListItemIcon>
                <HowToReg color="action" />
              </ListItemIcon>
              <ListItemText primary="Attendance" />
            </ListItem>
          </List>
        </Collapse>

        {/* Meetings */}
        {/* <Tooltip title="Meetings" placement="right" disableHoverListener={!collapsed}>
          <ListItem button onClick={() => setOpenMeetings(!openMeetings)}>
            <ListItemIcon><MeetingRoom color="primary" /></ListItemIcon>
            {!collapsed && <ListItemText primary="Meetings" />}
            {!collapsed && (openMeetings ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>
        </Tooltip>
        <Collapse in={openMeetings && !collapsed} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/meetings/breakfast" sx={{ pl: 4 }}>
              <ListItemIcon><BreakfastDining /></ListItemIcon>
              <ListItemText primary="Breakfast" />
            </ListItem>
            <ListItem button component={Link} to="/meetings/upcoming" sx={{ pl: 4 }}>
              <ListItemIcon><Upcoming /></ListItemIcon>
              <ListItemText primary="Upcoming" />
            </ListItem>
            <ListItem button component={Link} to="/meetings/past" sx={{ pl: 4 }}>
              <ListItemIcon><History /></ListItemIcon>
              <ListItemText primary="Past" />
            </ListItem>
          </List>
        </Collapse> */}

        {/* Settings */}
        <Tooltip
          title="User's & Settings"
          placement="right"
          disableHoverListener={!collapsed}
        >
          <ListItem button onClick={() => setOpenSettings(!openSettings)}>
            <ListItemIcon>
              <Settings color="primary" />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="User's & Settings" />}
            {!collapsed && (openSettings ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>
        </Tooltip>
        <Collapse in={openSettings && !collapsed} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/users" sx={{ pl: 4 }}>
              <ListItemIcon>
                <People color="action" />
              </ListItemIcon>
              <ListItemText primary="User's" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/settings/role"
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <Rule color="action" />
              </ListItemIcon>
              <ListItemText primary="Role" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/settings/rules"
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <Rule color="action" />
              </ListItemIcon>
              <ListItemText primary="Rules" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar;
