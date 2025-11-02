import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Paper,
  Grid,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from "@mui/x-data-grid";
import { Edit } from "@mui/icons-material";
import { UseMethod } from "../../../composables/UseMethod";
import CivilStatusFormModal from "../../../component/users/CivilStatusFormModal";
const CivilStatusPage = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusFilter, setStatusFilter] = useState("active");
  const [nameFilter, setNameFilter] = useState("");

  const fetchItems = async (status = 'active', search = '') => {
    const queryParams = {};
    if (status !== 'all') queryParams.status = status;
    if (search.trim()) queryParams.search = search;
    const res = await UseMethod("get", "civil-statuses", null, "", false, "json", Object.keys(queryParams).length ? queryParams : null);
    if (res?.data) {
      setItems(res.data);
      setFilteredItems(res.data);
    }
  };

  useEffect(() => { fetchItems(statusFilter); }, [statusFilter]);

  const handleStatusFilterChange = (event) => setStatusFilter(event.target.value);
  const handleNameFilterChange = (event) => setNameFilter(event.target.value);
  const handleSearch = () => fetchItems(statusFilter, nameFilter);
  const handleDelete = async (id) => {
    const res = await UseMethod("delete", "civil-statuses", null, id);
    if (res?.status === 200) {
      fetchItems(statusFilter, nameFilter);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "code", headerName: "Code", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip label={params.row.status_id === 1 ? "Active" : "Inactive"} color={params.row.status_id === 1 ? "success" : "default"} size="small" />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center" height={50} flexDirection="row" width="100%" gap={1}>
          <Button size="small" variant="outlined" color="info" onClick={() => { setSelectedItem(params.row); setOpen(true); }} startIcon={<Edit />}>Edit</Button>
          <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(params.row.id)}>Delete</Button>
        </Box>
      ),
    },
  ];

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    fetchItems(statusFilter, nameFilter);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Civil Status Management</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={handleStatusFilterChange}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField size="small" label="Search" placeholder="Search name, code, description..." value={nameFilter} onChange={handleNameFilterChange} sx={{ minWidth: 250 }} />
          <Button variant="outlined" onClick={handleSearch} startIcon={<SearchIcon />} sx={{ height: '40px' }}>Search</Button>
          <Button variant="contained" onClick={() => { setSelectedItem(null); setOpen(true); }}>Add Civil Status</Button>
        </Box>
      </Grid>

      <div style={{ height: 500, marginTop: 20 }}>
        <DataGrid rows={filteredItems} columns={columns} pageSize={10} getRowId={(row) => row.id} disableSelectionOnClick />
      </div>

      {open && (
        <CivilStatusFormModal open={open} onClose={handleClose} civilStatus={selectedItem} onRefresh={fetchItems} />
      )}
    </Paper>
  );
};

export default CivilStatusPage;