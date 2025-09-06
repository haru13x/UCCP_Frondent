import { useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import TopBars from "../component/TopBars";
import Sidebar from "../component/SideBar";
import { DRAWER_WIDTH_COLLAPSED, DRAWER_WIDTH_EXPANDED } from "./constants";

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const drawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top Bar */}
      <TopBars toggleDrawer={() => setCollapsed(!collapsed)} />

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          marginLeft: `${drawerWidth}px`,
        
          minHeight: "100vh",
          backgroundColor: "#fafafa",
          position: "relative",
        }}
      >
        <Toolbar />
        {children}
      </Box>

    </Box>
  );
};

export default MainLayout;
