import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  IconButton,
  Box,
  Grid,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import UserFormDialog from "../../component/users/UserFormDialog";
import UserViewDialog from "../../component/users/UserViewDialog"
import { UseMethod } from "../../composables/UseMethod";
import { DataGrid } from "@mui/x-data-grid";
import UploadExcelDialog from "../../component/users/UploadExcelDialog";
import { Lock, LockOpen, OpenInBrowser, UnfoldLess } from "@mui/icons-material";
import { fi } from "date-fns/locale";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [excelDialogOpen, setExcelDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // ✅ Fetch and flatten nested user data
  const fetchUsers = async (search = '') => {
    setLoading(true);
    try {
      const response = await UseMethod("post", "get-users", { search });
      const flatUsers = response.data.map((user) => ({
        ...user,
        phone: user.details?.phone_number || "N/A",
        gender: user.details?.sex?.name || "N/A",
        roleName: user.role?.name || "N/A",
        status: user.status_id,
      }));
      setUsers(flatUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setFormData({ name: "", email: "", phone: "", role: "" });
    setOpenForm(true);
  };

  const handleOpenEdit = (user) => {
    setIsEdit(true);
    setFormData({
      user_id: user.id,
      username: user.username,
      email: user.email,
      password: "",
      
      firstName: user.details?.first_name || "",
      middleName: user.details?.middle_name || "",
      lastName: user.details?.last_name || "",
      birthdate: user.details?.birthdate || "",
      address: user.details?.address || "",
      phone: user.details?.phone_number || "",
      gender: user.details?.sex_id || "",
      role: user.role?.id || "",
      accountGroupId: user.account_type[0]?.group_id || "",
      account_type_id: user.account_type.map((t) => t.account_type_id)


    });

    setOpenForm(true);
  };

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setOpenView(true);
  };
  const handleDisabled = async (user) => {
    setSelectedUser(user);
    setOpenCancel(true);
  }
  const handleSave = async () => {
    try {
      const payload = { ...formData, role: formData.role };
      const url = isEdit ? "update-users" : "register";
      const response = await UseMethod("post", url, payload);

      if (response) {
        fetchUsers();
        setOpenForm(false);
      }
    } catch (error) {
      console.error("Failed to save user:", error);
      alert("Error saving user. Check the console for details.");
    }
  };
  const handleSubmitDisabled = async () => {
    try {
      const response = await UseMethod("post", "update-user-status", {
        user_id: selectedUser.id,
        status: 3, // Assuming 3 is the status for disabled
      });
      if (response) {
        fetchUsers();
        setOpenCancel(false);
      }
    } catch (error) {
      console.error("Failed to disable user:", error);
      alert("Error disabling user. Check the console for details.");
    }
    finally {
      setOpenCancel(false);
    }
  };
  const handleSubmitEnabled = async () => {
    try {
      const response = await UseMethod("post", "update-user-status", {
        user_id: selectedUser.id,
        status: 1, // Assuming 1 is the status for enabled
      });
      if (response) {
        fetchUsers();
        setOpenCancel(false);

      }
    } catch (error) {
      console.error("Failed to enable user:", error);
      alert("Error enabling user. Check the console for details.");
    }
    finally {
      setOpenCancel(false);
    }
  };

  const handleSearchClick = () => {
    fetchUsers(searchText);
  };
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    // { field: "phone", headerName: "Phone", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    { field: "roleName", headerName: "Role", flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 305,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
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
          <Button size="small"
            variant="outlined"
            color="primary" onClick={() => handleOpenView(params.row)}
            startIcon={<VisibilityIcon />}>
            View
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary" onClick={() => handleOpenView(params.row)}
            startIcon={<EditIcon />}>
            Edit
          </Button>
          {params.row.status === 1 && (
            <Button
              size="small"
              variant="contained"
              color="error" onClick={() => handleDisabled(params.row)}
              startIcon={<Lock />}>
              Disabled
            </Button>

          )}
          {params.row.status !== 1 && (
            <Button
              size="small"
              variant="contained"
              color="success" onClick={() => handleSubmitEnabled(params.row)}
              startIcon={<LockOpen />}>
              Enable
            </Button>
          )}
        </Box>
      ),
      
    },
  ];

return (
  <Box sx={{ p: 1 }}>
    <Card sx={{ px: 1 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={2}
      >
        <Typography variant="h6">User Management</Typography>

        <Grid
          width={'40vw'}
          sx={{
            display: 'flex',
            gap: 2

          }}>

          <TextField
            variant="outlined"
            placeholder="Search by name, group, type…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            fullWidth
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchClick();
            }}
            size='small'
          />
          <Button variant="contained" onClick={handleSearchClick}>
            Search
          </Button>
        </Grid>
        <Grid sx={{
          display: 'flex',
          gap: 2
        }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
          >
            Add User
          </Button>
          <Button variant="outlined" onClick={() => setExcelDialogOpen(true)}>
            Upload Excel
          </Button>
        </Grid>

      </Box>

      <Box sx={{ height: "75vh", width: "100%" }}>
        <DataGrid
          rows={Array.isArray(users) ? users : []}
          getRowId={(row) => row.id}
          loading={loading}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableRowSelectionOnClick
        />
      </Box>
    </Card>

    <UserFormDialog
      open={openForm}
      onClose={() => setOpenForm(false)}
      onSave={handleSave}
      formData={formData}
      setFormData={setFormData}
      isEdit={isEdit}
    />

    <UserViewDialog
      open={openView}
      onClose={() => setOpenView(false)}
      user={selectedUser}
    />


    <UploadExcelDialog
      open={excelDialogOpen}
      onClose={() => setExcelDialogOpen(false)}
    />
    <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
      <DialogTitle>Disabled Account User </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to disable this user account? This action cannot be undone.
          <Divider />
          <br />
          Account will be disabled and user will not be able to login.
        </DialogContentText>
        <DialogContentText>
          User: {selectedUser ? selectedUser.name : "N/A"}
        </DialogContentText>
        <DialogContentText>
          Email: {selectedUser ? selectedUser.email : "N/A"}
        </DialogContentText>
        <DialogContentText>
          Phone: {selectedUser ? selectedUser.phone : "N/A"}

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenView(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmitDisabled} color="secondary">
          Disable
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
);
};

export default UserPage;
