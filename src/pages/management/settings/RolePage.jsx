import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Paper,
  IconButton,
  Grid,
  Dialog,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility, Edit } from "@mui/icons-material";
import RoleFormModal from "../../../component/users/RoleFormModal";
import { UseMethod } from "../../../composables/UseMethod";

const RolePage = () => {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  const fetchRoles = async () => {
    const res = await UseMethod("get", "get-roles");
    if (res?.data) setRoles(res.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "slug", headerName: "Slug", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => {
              setSelectedRole(params.row);
              setOpen(true);
            }}
          >
            <Visibility />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => {
              setSelectedRole(params.row);
              setOpen(true);
            }}
          >
            <Edit />
          </IconButton>
        </>
      ),
    },
  ];

  const handleClose = () => {
    setOpen(false);
    setSelectedRole(null);
    fetchRoles();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Role Management</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedRole(null);
            setOpen(true);
          }}
        >
          Add Role
        </Button>
      </Grid>

      <div style={{ height: 500, marginTop: 20 }}>
        <DataGrid rows={roles} columns={columns} pageSize={10} />
      </div>

      {open && (
        <RoleFormModal
          open={open}
          onClose={handleClose}
          role={selectedRole} // null if creating
        />
      )}
    </Paper>
  );
};

export default RolePage;
