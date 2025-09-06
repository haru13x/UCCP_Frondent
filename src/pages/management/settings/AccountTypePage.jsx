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
import { UseMethod } from "../../../composables/UseMethod";
import AccountTypeFormModal from "../../../component/users/AccountTypeFormModal";

const AccountTypePage = () => {
  const [open, setOpen] = useState(false);
  const [accountTypes, setAccountTypes] = useState([]);
  const [selectedAccountType, setSelectedAccountType] = useState(null);

  const fetchAccountTypes = async () => {
    const res = await UseMethod("get", "account-types");
    if (res?.data) {
      setAccountTypes(res.data);
    }
  };

  useEffect(() => {
    fetchAccountTypes();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "code", headerName: "Code", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "group_name",
      headerName: "Group",
      flex: 1,
      renderCell: (params) => params?.row?.group?.description || "N/A",
    },
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
              setSelectedAccountType(params.row);
              setOpen(true);
            }}
            startIcon={<Edit />}
          >
            Edit
          </Button>
        </Box>
      ),
    },
  ];

  const handleClose = () => {
    setOpen(false);
    setSelectedAccountType(null);
    fetchAccountTypes();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Account Type Management</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedAccountType(null);
            setOpen(true);
          }}
        >
          Add Account Type
        </Button>
      </Grid>

      <div style={{ height: 500, marginTop: 20 }}>
        <DataGrid rows={accountTypes} columns={columns} pageSize={10} />
      </div>

      {open && (
        <AccountTypeFormModal
          open={open}
          onClose={handleClose}
          accountType={selectedAccountType}
          onRefresh={fetchAccountTypes}
        />
      )}
    </Paper>
  );
};

export default AccountTypePage;