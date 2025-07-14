import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import UserFormDialog from "../component/users/UserFormDialog";
import UserViewDialog from "../component/users/UserViewDialog";
import { UseMethod } from "../composables/UseMethod";
import { DataGrid } from "@mui/x-data-grid";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Fetch and flatten nested user data
  const fetchUsers = async () => {
    try {
      const response = await UseMethod("get", "get-users");
      const flatUsers = response.data.map((user) => ({
        ...user,
        phone: user.details?.phone_number || "N/A",
        gender: user.details?.sex?.name || "N/A",
        roleName: user.role?.name || "N/A",
      }));
      setUsers(flatUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
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
    });
    setOpenForm(true);
  };

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setOpenView(true);
  };

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

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    { field: "roleName", headerName: "Role", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleOpenView(params.row)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleOpenEdit(params.row)}>
            <EditIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={2}
        >
          <Typography variant="h6">User Management</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
          >
            Add User
          </Button>
        </Box>

        <Box sx={{ height: "75vh", width: "100%" }}>
          <DataGrid
            rows={Array.isArray(users) ? users : []}
            getRowId={(row) => row.id}
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
    </Box>
  );
};

export default UserPage;
