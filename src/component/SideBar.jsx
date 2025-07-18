import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Box,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import ChurchIcon from "@mui/icons-material/Church";
import { Link } from "react-router-dom";
import { sidebarConfig } from "../composables/sidebarConfig";
import { DRAWER_WIDTH_EXPANDED, DRAWER_WIDTH_COLLAPSED } from "../layout/constants";

// ✅ Function to get user permissions from localStorage
const getUserPermissions = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const permissions =
      user?.role?.role_permissions?.map((rp) => rp.permission?.code) || [];
    return permissions;
  } catch (error) {
    console.error("Failed to extract permissions:", error);
    return [];
  }
};

// ✅ Recursive filtering based on permission rules
const filterSidebarByPermissions = (items, permissions) => {
  return items
    .filter((item) => !item.rule || permissions.includes(item.rule))
    .map((item) => {
      if (item.children) {
        const filteredChildren = filterSidebarByPermissions(item.children, permissions);
        return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null;
      }
      return item;
    })
    .filter(Boolean);
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);

  const drawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED;

  useEffect(() => {
    const permissions = getUserPermissions();
    setUserPermissions(permissions);
  }, []);

  const filteredSidebar = filterSidebarByPermissions(sidebarConfig, userPermissions);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
  <Drawer
  variant="permanent"
  sx={{
    width: collapsed ? 70 : drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    "& .MuiDrawer-paper": {
      width: collapsed ? 70 : drawerWidth,
      transition: "width 0.3s ease-in-out",
      overflowX: "hidden",
      background: "linear-gradient(to bottom, #e3f2fd, #ffffff)",
      borderRight: "none",
      boxShadow: "2px 0 6px rgba(0, 0, 0, 0.1)",
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ChurchIcon sx={{ color: "#1565c0", fontSize: 28, mr: 1 }} />
          <Typography variant="h6" sx={{ color: "#1565c0", fontWeight: "bold" }}>
            UCCP
          </Typography>
        </Box>
      )}
      <IconButton
        onClick={() => setCollapsed(!collapsed)}
        sx={{
          bgcolor: "#e3f2fd",
          borderRadius: 2,
          boxShadow: 2,
          "&:hover": { bgcolor: "#bbdefb" },
          transition: "0.2s",
        }}
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>
    </Box>
    <Divider sx={{ my: 1, backgroundColor: "#cfd8dc" }} />
  </Box>

  <List sx={{ mt: 1 }}>
    {filteredSidebar.map((item, index) => {
      const Icon = item.icon;

      if (item.children) {
        return (
          <React.Fragment key={index}>
            <Tooltip title={item.label} placement="right" disableHoverListener={!collapsed}>
              <ListItem
                button
                onClick={() => toggleOpen(index)}
                sx={{
                  px: collapsed ? 2 : 3,
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  transition: "background 0.2s",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2 }}>
                  <Icon color="primary" />
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.label} />}
                {!collapsed && (openIndex === index ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>
            </Tooltip>

            <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((child, j) => {
                  const ChildIcon = child.icon;
                  return (
                    <ListItem
                      key={j}
                      button
                      component={Link}
                      to={child.path}
                      sx={{
                        pl: collapsed ? 3 : 5,
                        mx: 1.5,
                        borderRadius: 2,
                        my: 0.5,
                        transition: "background 0.2s",
                        "&:hover": {
                          backgroundColor: "#f0f7ff",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2 }}>
                        <ChildIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      {!collapsed && <ListItemText primary={child.label} />}
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }

      return (
        <Tooltip title={item.label} placement="right" disableHoverListener={!collapsed} key={index}>
          <ListItem
            button
            component={Link}
            to={item.path}
            sx={{
              px: collapsed ? 2 : 3,
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              transition: "background 0.2s",
              "&:hover": {
                backgroundColor: "#e3f2fd",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2 }}>
              <Icon color="primary" />
            </ListItemIcon>
            {!collapsed && <ListItemText primary={item.label} />}
          </ListItem>
        </Tooltip>
      );
    })}
  </List>
</Drawer>

  );
};

export default Sidebar;
