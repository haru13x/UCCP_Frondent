// src/components/TopBar.jsx
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ChurchIcon from "@mui/icons-material/Church";

const TopBar = () => {
  const location = useLocation();

  const navItems = [
    { label: "About", path: "/about" },
    { label: "Login", path: "/" },
    { label: "Register", path: "/register" },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#bbdefb",
        color: "#0d47a1",
        boxShadow: 2,
      }}
    >
    
        <Toolbar
         
          sx={{
            display: "flex",
            justifyContent: "space-between",
            
          }}
        >
          {/* Left: Logo + Name */}
          <Box display="flex" alignItems="left" gap={1}>
            <ChurchIcon sx={{ color: "#0d47a1", fontSize: 30 }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                fontFamily: "'Merriweather', serif",
                color: "#0d47a1",
              }}
            >
              UCCP Event Management
            </Typography>
          </Box>

          {/* Center: Nav */}
          <Box
            sx={{
             
              display: "flex",
              gap: 3,
            }}
          >
            {navItems.map(({ label, path }) => (
              <Button
                key={label}
                component={Link}
                to={path}
                sx={{
                  fontSize: "1.05rem",
                  fontWeight: "bold",
                  color: location.pathname === path ? "#0d47a1" : "#1565c0",
                  textTransform: "none",
                  borderBottom: location.pathname === path ? "2px solid #0d47a1" : "none",
                  "&:hover": {
                    color: "#0d47a1",
                    borderBottom: "2px solid #0d47a1",
                    backgroundColor: "transparent",
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      
    </AppBar>
  );
};

export default TopBar;
