import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Paper,
  IconButton,
  Grid,
  Box,
  Dialog,
  Card,
  TextField,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility, Edit, Add, Search } from "@mui/icons-material";
import RoleFormModal from "../../../component/users/RoleFormModal";
import { UseMethod } from "../../../composables/UseMethod";
import VisibilityIcon from "@mui/icons-material/Visibility";
const RolePage = () => {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await UseMethod("get", "get-roles");
      if (res?.data) setRoles(res.data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setLoading(false);
    }
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
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                color: "white",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "600",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                },
              }}
              onClick={() => {
                setSelectedRole(params.row);
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
    setSelectedRole(null);
    fetchRoles();
  };

  const filteredRoles = roles.filter((role) =>
    role.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    role.slug?.toLowerCase().includes(searchText.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchText.toLowerCase())
  );

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
