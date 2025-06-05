import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  Avatar,
  Divider,
  Grid,
} from "@mui/material";
 import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import usersData from "../data/users";
import { SearchOffSharp, UploadFile } from "@mui/icons-material";

const UserPage = () => {
  const [users, setUsers] = useState(usersData);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
  });
 

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  // Your existing even row style
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity,
        ),
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },

  // Add header background color here
  [`& .${gridClasses.columns}`]: {
    backgroundColor: theme.palette.grey[800], // blue header background
    color: theme.palette.common.black, // white text color
    fontWeight: 'bold',
    
  },
}));

  const handleOpenForm = (user = null) => {
    setIsEdit(!!user);
    setSelectedUser(user);
    setFormData(user || { name: "", email: "", role: "", phone: "" });
    setOpenForm(true);
  };

  const handleSave = () => {
    if (formData.name && formData.email && formData.role) {
      if (isEdit) {
        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? { ...u, ...formData } : u))
        );
      } else {
        const id = users.length + 1;
        setUsers([...users, { id, ...formData }]);
      }
      setOpenForm(false);
      setFormData({ name: "", email: "", role: "", phone: "" });
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setOpenView(true);
  };

  const columns = [
   
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View">
            <IconButton color="primary" onClick={() => handleView(params.row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              color="secondary"
              onClick={() => handleOpenForm(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
  <Box
  sx={{
   
    backgroundImage: "url(/assets/user-bg.svg)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right bottom",
    transition: "margin-left 0.3s",
  
  }}
>
 

     <Paper elevation={3} sx={{  p:1 }}>

  
<Box sx={{ maxWidth: 7800, }}>
  <Grid container px={{display:'flex', alignItems:'center',justifyContent:'left'}} md={12} spacing={2}>
    <Typography minWidth={150} variant="h6" gutterBottom fontWeight="medium">
             Manage Users
            </Typography>
            
    <Grid item width={500} xs={12} md={6} sm={8} >
      <TextField
        fullWidth
        label="Search Name"
        size="small"
        margin="dense"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
    </Grid>
      <Grid item xs={12} sm={4}>
      <Button
        variant="contained"
        startIcon={<SearchOffSharp />}
        fullWidth
        onClick={handleOpenForm}
         size="small"
        margin="dense"
      >
       Search
      </Button>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        fullWidth
        onClick={handleOpenForm}
         size="small"
        margin="dense"
      >
        Add User
      </Button>
    </Grid>
        <Grid item xs={12} sm={4}>
      <Button
        variant="contained"
        startIcon={<UploadFile />}
        fullWidth
       
         size="small"
        margin="dense"
      >
        Upload User
      </Button>
    </Grid>
  </Grid>
</Box>


      <Paper elevation={3} sx={{}}>
       <StripedDataGrid
          rows={users}
          columns={columns}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5]}
           getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        />
      </Paper>
    </Paper>
      {/* Add/Edit User Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            fullWidth
          />
          <TextField
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} fullWidth maxWidth="xs">
        <DialogTitle>👁️ View User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                py: 3,
              }}
            >
              <Avatar sx={{ width: 80, height: 80 }}>
                <PersonIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6" fontWeight="bold">{selectedUser.name}</Typography>
              <Typography color="textSecondary">{selectedUser.email}</Typography>
              <Divider sx={{ width: "100%", my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                  <Typography>{selectedUser.phone || "N/A"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Role</Typography>
                  <Typography>{selectedUser.role}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPage;
