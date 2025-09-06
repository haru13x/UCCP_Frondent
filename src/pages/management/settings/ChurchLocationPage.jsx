import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Paper,
  IconButton,
  Grid,
  Box,
  Dialog,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility, Edit } from "@mui/icons-material";
import ChurchLocationFormModal from "../../../component/users/ChurchLocationFormModal";
import { UseMethod } from "../../../composables/UseMethod";

const ChurchLocationPage = () => {
  const [open, setOpen] = useState(false);
  const [churchLocations, setChurchLocations] = useState([]);
  const [selectedChurchLocation, setSelectedChurchLocation] = useState(null);

  const fetchChurchLocations = async () => {
    const res = await UseMethod("get", "get-church-locations");
    console.log('API Response:', res);
    if (res?.data) {
      console.log('Church Locations Data:', res.data);
      setChurchLocations(res.data);
    }
  };

  useEffect(() => {
    fetchChurchLocations();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "slug", headerName: "Slug", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
           label={params.row.status_id === 1 ? "Active" : "Inactive"}
           color={params.row.status_id === 1 ? "success" : "default"}
           size="small"
         />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={50}
            flexDirection="row"
            width="100%"
            gap={1}
            flexWrap="wrap"
          >
            <Button
              size="small"
              variant="outlined"
              color="info"
              onClick={() => {
                setSelectedChurchLocation(params.row);
                setOpen(true);
              }}
              startIcon={<Edit />}
            >
              Edit
            </Button>
          </Box>
        </>
      ),
    },
  ];

  const handleClose = () => {
    setOpen(false);
    setSelectedChurchLocation(null);
    fetchChurchLocations();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Church Location Management</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedChurchLocation(null);
            setOpen(true);
          }}
        >
          Add Church Location
        </Button>
      </Grid>

      <div style={{ height: 500, marginTop: 20 }}>
        <DataGrid 
          rows={churchLocations} 
          columns={columns} 
          pageSize={10}
          getRowId={(row) => row.id}
          disableSelectionOnClick
        />
      </div>

      {open && (
        <ChurchLocationFormModal
          open={open}
          onClose={handleClose}
          churchLocation={selectedChurchLocation}
          onRefresh={fetchChurchLocations}
        />
      )}
    </Paper>
  );
};

export default ChurchLocationPage;