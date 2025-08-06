// src/pages/NoPermission.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NoPermission = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        🚫 No Permission
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        You do not have access to view this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/my-list")}>
        Go Back
      </Button>
    </Box>
  );
};

export default NoPermission;
