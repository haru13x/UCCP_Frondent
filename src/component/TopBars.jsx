import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TopBars = ({ toggleDrawer }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogOut = () => {
  // Clear token and user data
  localStorage.removeItem("api_token");
  localStorage.removeItem("user");

  // Optionally clear all localStorage
  // localStorage.clear();

  // Redirect to login page
  navigate("/", { replace: true });
};

const handleProfile = () => {
  // Redirect to profile page   
  navigate("/profile", { replace: true });
};

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main} 0%, 
          ${theme.palette.primary.dark} 50%, 
          ${alpha(theme.palette.primary.main, 0.9)} 100%
        )`,
        backdropFilter: "blur(20px)",
        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}, 
                   0 2px 16px ${alpha(theme.palette.common.black, 0.1)}`,
        borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(90deg, 
            transparent 0%, 
            ${alpha(theme.palette.common.white, 0.05)} 50%, 
            transparent 100%
          )`,
          pointerEvents: "none",
        },
      }}
    >
        <Toolbar 
          sx={{ 
            justifyContent: "space-between",
            minHeight: "72px !important",
            px: { xs: 2, sm: 3 },
            position: "relative",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip title="Toggle Sidebar" placement="bottom">
              <IconButton
                onClick={toggleDrawer}
                sx={{
                  color: "white",
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  borderRadius: 2,
                  padding: 1.5,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.2),
                    transform: "scale(1.05)",
                    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.2)}`,
                  },
                  "&:active": {
                    transform: "scale(0.95)",
                  },
                }}
              >
                <MenuIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Tooltip>
            <Typography 
              variant="h5" 
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: "0.5px",
                color: "white",
                textShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.3)}`,
                background: `linear-gradient(45deg, white 0%, ${alpha(theme.palette.common.white, 0.9)} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
              }}
            >
              United Church of Christ in the Philippines Event Management
            </Typography>
          </Box>

          <Box>
            <Tooltip title="User Menu" placement="bottom">
              <IconButton 
                onClick={(e) => setAnchorEl(e.currentTarget)} 
                sx={{
                  padding: 1,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.2)}`,
                  },
                }}
              >
                <Avatar 
                  sx={{
                    width: 44,
                    height: 44,
                    background: `linear-gradient(135deg, 
                      ${alpha(theme.palette.common.white, 0.9)} 0%, 
                      ${alpha(theme.palette.common.white, 0.7)} 100%
                    )`,
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              open={open}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: 3,
                  minWidth: 200,
                  background: `linear-gradient(135deg, 
                    ${alpha(theme.palette.background.paper, 0.95)} 0%, 
                    ${alpha(theme.palette.background.paper, 0.9)} 100%
                  )`,
                  backdropFilter: "blur(20px)",
                  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  mt: 1,
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem 
                onClick={handleProfile}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    transform: "translateX(4px)",
                  },
                }}
              >
                <PersonIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                Profile
              </MenuItem>
              <MenuItem 
                onClick={handleLogOut}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.08),
                    transform: "translateX(4px)",
                    color: theme.palette.error.main,
                  },
                }}
              >
                <LogoutIcon sx={{ mr: 1.5, color: theme.palette.error.main }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBars;
