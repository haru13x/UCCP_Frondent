import { useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import TopBars from "../component/TopBars";
import Sidebar from "../component/SideBar";
import { DRAWER_WIDTH_COLLAPSED, DRAWER_WIDTH_EXPANDED } from "./constants";

const MainLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const drawerWidth = drawerOpen ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top Bar */}
      <Sidebar open={drawerOpen} />

      <TopBars toggleDrawer={() => setDrawerOpen(!drawerOpen)} />

      {/* Sidebar */}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "86%",
          transition: "margin-left 0.3s",
          // marginLeft: drawerOpen ? `${drawerWidth}px` : "0px",  // Add this line
          p: 2,
          minHeight: "80vh",

        }}
      >
        <Toolbar />
        {children}
      </Box>

    </Box>
  );
};

export default MainLayout;
