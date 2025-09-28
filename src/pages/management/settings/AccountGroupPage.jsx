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
import AccountGroupFormModal from "../../../component/users/AccountGroupFormModal";
import { UseMethod } from "../../../composables/UseMethod";

const AccountGroupPage = () => {
  const [open, setOpen] = useState(false);
  const [accountGroups, setAccountGroups] = useState([]);
  const [filteredAccountGroups, setFilteredAccountGroups] = useState([]);
  const [selectedAccountGroup, setSelectedAccountGroup] = useState(null);
  const [statusFilter, setStatusFilter] = useState('active');
  const [nameFilter, setNameFilter] = useState('');

  const fetchAccountGroups = async (status = 'active', search = '') => {
    const queryParams = {};
    if (status !== 'all') queryParams.status = status;
    if (search.trim()) queryParams.search = search;
    
    const res = await UseMethod("get", "account-groups", null, "", false, "json", Object.keys(queryParams).length ? queryParams : null);
    if (res?.data) {
      setAccountGroups(res.data);
      setFilteredAccountGroups(res.data);
    }
  };

  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    setStatusFilter(value);
  };

  const handleNameFilterChange = (event) => {
    const value = event.target.value;
    setNameFilter(value);
  };

  const handleSearch = () => {
    fetchAccountGroups(statusFilter, nameFilter);
  };

  useEffect(() => {
    fetchAccountGroups();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "code", headerName: "Code", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.is_active === 1 ? "Active" : "Inactive"}
          color={params.row.is_active === 1 ? "success" : "default"}
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
                setSelectedAccountGroup(params.row);
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
    setSelectedAccountGroup(null);
    fetchAccountGroups();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Account Group Management</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedAccountGroup(null);
            setOpen(true);
          }}
        >
          Add Account Group
        </Button>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{md:2}} item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{md:3}} item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Search by Name"
            placeholder="Search code or description..."
            value={nameFilter}
            onChange={handleNameFilterChange}
          />
        </Grid>
        <Grid size={{md:1}} item xs={12} sm={6} md={2}>
          <Button
            fullWidth
            variant="contained"
            size="medium"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            sx={{ height: '40px' }}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      <div style={{ height: 500 }}>
        <DataGrid rows={filteredAccountGroups} columns={columns} pageSize={10} />
      </div>

      {open && (
        <AccountGroupFormModal
          open={open}
          onClose={handleClose}
          accountGroup={selectedAccountGroup}
        />
      )}
    </Paper>
  );
};

export default AccountGroupPage;