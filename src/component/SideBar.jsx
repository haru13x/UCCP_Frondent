import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Divider,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import ChurchIcon from "@mui/icons-material/Church";
import { Link, useLocation } from "react-router-dom";
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

const Sidebar = ({ collapsed = false }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const theme = useTheme();
  const location = useLocation();

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
      

        whiteSpace: "nowrap",
        boxSizing: "border-box",
        "& .MuiDrawer-paper": {
        
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.05)} 0%, 
            ${alpha(theme.palette.background.paper, 0.95)} 50%, 
            ${alpha(theme.palette.primary.main, 0.02)} 100%
          )`,
          backdropFilter: "blur(20px)",
          borderRight: "none",
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.12)}, 
                     0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
         
        },
      }}
    >
      <Box sx={{ marginTop: "86px", textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: collapsed ? 2 : 8,
            py: 2,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
          }}
        >
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center",
              opacity: collapsed ? 0 : 1,
              transform: collapsed ? "scale(0.8)" : "scale(1)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <ChurchIcon 
              sx={{ 
                color: theme.palette.primary.main, 
                fontSize: collapsed ? 24 : 32, 
                mr: collapsed ? 0 : 1.5,
                filter: `drop-shadow(0 2px 4px ${alpha(theme.palette.primary.main, 0.3)})`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }} 
            />
            {!collapsed && (
              <Typography 
                variant="h5" 
                sx={{ 
                  color: theme.palette.primary.main, 
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                UCCP
              </Typography>
            )}
          </Box>
        </Box>
        <Divider 
          sx={{ 
            my: 2, 
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            height: 2,
            borderRadius: 1,
            mx: 2,
          }} 
        />
      </Box>

      <List sx={{ mt: 1, px: 1 }}>
        {filteredSidebar.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.children) {
            const hasActiveChild = item.children.some(child => location.pathname === child.path);
            return (
              <React.Fragment key={index}>
                <Tooltip title={item.label} placement="right" disableHoverListener={!collapsed}>
                  <ListItem
                    button
                    onClick={() => toggleOpen(index)}
                    sx={{
                      px: collapsed ? 1.5 : 2.5,
                      py: 1.5,
                      borderRadius: 3,
                      mx: 0.5,
                      my: 0.5,
                      minHeight: 48,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      background: hasActiveChild 
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.08)})`
                        : "transparent",
                      border: hasActiveChild 
                        ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                        : "1px solid transparent",
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        transform: "translateX(4px)",
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                      },
                      "&:active": {
                        transform: "translateX(2px) scale(0.98)",
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 0, 
                        mr: collapsed ? 0 : 2,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <Icon 
                        sx={{
                          color: hasActiveChild ? theme.palette.primary.main : theme.palette.text.secondary,
                          fontSize: collapsed ? 20 : 24,
                          filter: hasActiveChild 
                            ? `drop-shadow(0 2px 4px ${alpha(theme.palette.primary.main, 0.3)})`
                            : "none",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText 
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: hasActiveChild ? 600 : 500,
                          fontSize: "0.95rem",
                          color: hasActiveChild ? theme.palette.primary.main : theme.palette.text.primary,
                        }}
                      />
                    )}
                    {!collapsed && (
                      <Box
                        sx={{
                          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          transform: openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <ExpandMore 
                          sx={{
                            color: hasActiveChild ? theme.palette.primary.main : theme.palette.text.secondary,
                            fontSize: 20,
                          }}
                        />
                      </Box>
                    )}
                  </ListItem>
                </Tooltip>

                <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: collapsed ? 0 : 1 }}>
                    {item.children.map((child, j) => {
                      const ChildIcon = child.icon;
                      const isChildActive = location.pathname === child.path;
                      return (
                        <ListItem
                          key={j}
                          button
                          component={Link}
                          to={child.path}
                          sx={{
                            pl: collapsed ? 2 : 3,
                            pr: collapsed ? 1.5 : 2.5,
                            py: 1,
                            mx: 0.5,
                            borderRadius: 2.5,
                            my: 0.3,
                            minHeight: 40,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            background: isChildActive 
                              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.06)})`
                              : "transparent",
                            borderLeft: isChildActive 
                              ? `3px solid ${theme.palette.primary.main}`
                              : "3px solid transparent",
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.primary.main, 0.06),
                              transform: "translateX(6px)",
                              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`,
                            },
                            "&:active": {
                              transform: "translateX(3px) scale(0.98)",
                            },
                          }}
                        >
                          <ListItemIcon 
                            sx={{ 
                              minWidth: 0, 
                              mr: collapsed ? 0 : 1.5,
                              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          >
                            <ChildIcon 
                              sx={{
                                fontSize: collapsed ? 16 : 18,
                                color: isChildActive ? theme.palette.primary.main : theme.palette.text.secondary,
                                filter: isChildActive 
                                  ? `drop-shadow(0 1px 2px ${alpha(theme.palette.primary.main, 0.3)})`
                                  : "none",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              }}
                            />
                          </ListItemIcon>
                          {!collapsed && (
                            <ListItemText 
                              primary={child.label}
                              primaryTypographyProps={{
                                fontWeight: isChildActive ? 600 : 400,
                                fontSize: "0.875rem",
                                color: isChildActive ? theme.palette.primary.main : theme.palette.text.secondary,
                              }}
                            />
                          )}
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
                  px: collapsed ? 1.5 : 2.5,
                  py: 1.5,
                  borderRadius: 3,
                  mx: 0.5,
                  my: 0.5,
                  minHeight: 48,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: isActive 
                    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.08)})`
                    : "transparent",
                  border: isActive 
                    ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                    : "1px solid transparent",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    transform: "translateX(4px)",
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                  },
                  "&:active": {
                    transform: "translateX(2px) scale(0.98)",
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 0, 
                    mr: collapsed ? 0 : 2,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Icon 
                    sx={{
                      color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                      fontSize: collapsed ? 20 : 24,
                      filter: isActive 
                        ? `drop-shadow(0 2px 4px ${alpha(theme.palette.primary.main, 0.3)})`
                        : "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "0.95rem",
                      color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                    }}
                  />
                )}
              </ListItem>
            </Tooltip>
          );
    })}
  </List>
</Drawer>

  );
};

export default Sidebar;
