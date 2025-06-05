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
import usersData from "../data/users";
import UserFormDialog from "../component/UserFormDialog";
import UserViewDialog from "../component/UserViewDialog";
const UserPage = () => {
 const [users, setUsers] = useState(usersData);
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

  const handleSave = () => {
    if (isEdit) {
      setUsers((prev) =>
        prev.map((u) => (u.id === formData.id ? formData : u))
      );
    } else {
      setUsers((prev) => [
        ...prev,
        { ...formData, id: prev.length + 1 },
      ]);
    }
    setOpenForm(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">User Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
            >
              Add User
            </Button>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.role}</TableCell>
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
        </CardContent>
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
