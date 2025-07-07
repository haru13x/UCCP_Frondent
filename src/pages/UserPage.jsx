import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import UserFormDialog from "../component/users/UserFormDialog";
import UserViewDialog from "../component/users/UserViewDialog";
import { UseMethod } from "../composables/UseMethod";
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

  // Dummy fetch simulation
  const fetchUsers = async () => {
    try {
      const response = await UseMethod('get', 'get-users');

      setUsers(response.data);
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
    setFormData(user);
    setOpenForm(true);
  };

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setOpenView(true);
  };

  const handleSave = async () => {
    if (isEdit) {
      setUsers((prev) =>
        prev.map((u) => (u.id === formData.id ? formData : u))
      );
    } else {
      try {
        const payload = {
          ...formData,
          role: formData.role, // should be role ID
        };
        const response = await UseMethod('post', 'register', payload);
        if (response) {
          fetchUsers();
          setOpenForm(false);
        }

      } catch (error) {
        console.error("Failed to save user:", error);
        alert("Error saving user. Check the console for details.");
      }
    }
    // setOpenForm(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          px={2}
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
        <div style={{ height: "75vh", overflowY: "auto" }}>
          <Table size="small" >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#1f6306",
                  fontSize: "1rem",
                  color: "white",
                }}
              >
                <TableCell
                  sx={{ fontSize: "1rem", color: "white", fontWeight: "bold" }}
                >
                  {" "}
                  #
                </TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", color: "white", fontWeight: "bold" }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", color: "white", fontWeight: "bold" }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", color: "white", fontWeight: "bold" }}
                >
                  Phone
                </TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", color: "white", fontWeight: "bold" }}
                >
                  Gender
                </TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", color: "white", fontWeight: "bold" }}
                >
                  Role
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: "1rem", color: "white", fontWeight: "bold" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>{user?.details?.phone_number}</TableCell>
                  <TableCell>{user?.details?.sex?.name}</TableCell>
                  <TableCell>{user?.role.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenView(user)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleOpenEdit(user)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
