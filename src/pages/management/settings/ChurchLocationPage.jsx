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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from "@mui/x-data-grid";
import { Visibility, Edit } from "@mui/icons-material";
import ChurchLocationFormModal from "../../../component/users/ChurchLocationFormModal";
import { UseMethod } from "../../../composables/UseMethod";

const ChurchLocationPage = () => {
  const [open, setOpen] = useState(false);
  const [churchLocations, setChurchLocations] = useState([]);
  const [filteredChurchLocations, setFilteredChurchLocations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("active");
  const [selectedChurchLocation, setSelectedChurchLocation] = useState(null);
  const [nameFilter, setNameFilter] = useState('');

  const fetchChurchLocations = async (status = 'active', search = '') => {
    const queryParams = {};
    if (status !== 'all') queryParams.status = status;
    if (search.trim()) queryParams.search = search;
    
    const res = await UseMethod("get", "church-locations", null, "", false, "json", Object.keys(queryParams).length ? queryParams : null);
    if (res?.data) {
      setChurchLocations(res.data);
      setFilteredChurchLocations(res.data);
    }
  };

  useEffect(() => {
    fetchChurchLocations(statusFilter);
  }, [statusFilter]);

  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    setStatusFilter(value);
  };

  const handleNameFilterChange = (event) => {
    const value = event.target.value;
    setNameFilter(value);
  };

  const handleSearch = () => {
    fetchChurchLocations(statusFilter, nameFilter);
  };

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
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Search by Name"
            placeholder="Search name, slug, or description..."
            value={nameFilter}
            onChange={handleNameFilterChange}
            sx={{ minWidth: 250 }}
          />
          <Button
            variant="outlined"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            sx={{ height: '40px' }}
          >
            Search
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedChurchLocation(null);
              setOpen(true);
            }}
          >
            Add Church Location
          </Button>
        </Box>
      </Grid>

      <div style={{ height: 500, marginTop: 20 }}>
        <DataGrid 
          rows={filteredChurchLocations} 
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