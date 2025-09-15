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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility, Edit } from "@mui/icons-material";
import AccountGroupFormModal from "../../../component/users/AccountGroupFormModal";
import { UseMethod } from "../../../composables/UseMethod";

const AccountGroupPage = () => {
  const [open, setOpen] = useState(false);
  const [accountGroups, setAccountGroups] = useState([]);
  const [filteredAccountGroups, setFilteredAccountGroups] = useState([]);
  const [selectedAccountGroup, setSelectedAccountGroup] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchAccountGroups = async () => {
    const res = await UseMethod("get", "account-groups");
    if (res?.data) {
      setAccountGroups(res.data);
      setFilteredAccountGroups(res.data);
    }
  };

  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    setStatusFilter(value);
    
    if (value === 'all') {
      setFilteredAccountGroups(accountGroups);
    } else if (value === 'active') {
      setFilteredAccountGroups(accountGroups.filter(group => group.is_active === 1));
    } else if (value === 'inactive') {
      setFilteredAccountGroups(accountGroups.filter(group => group.is_active === 0));
    }
  };

  useEffect(() => {
    fetchAccountGroups();
  }, []);

  useEffect(() => {
    handleStatusFilterChange({ target: { value: statusFilter } });
  }, [accountGroups]);

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
        <Grid item xs={12} sm={6} md={3}>
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