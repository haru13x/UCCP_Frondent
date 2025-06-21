import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { DRAWER_WIDTH } from "../layout/constants";
import { useNavigate } from "react-router-dom";

const TopBars = ({ toggleDrawer }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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



  return (
   <AppBar
  position="fixed"
  sx={{
    zIndex: (theme) => theme.zIndex.drawer + 1,
    backgroundColor: "#1565c0", // church-blue
    boxShadow: 3,
  }}
>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" noWrap>
            UCCP Event Management
          </Typography>
        </Box>

        <Box>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit">
            <Avatar />
          </IconButton>
          <Menu
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBars;
