import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Typography,
} from "@mui/material";
import { UseMethod } from "../../composables/UseMethod";
const RoleFormModal = ({ open, onClose, role }) => {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    permissions: [],
  });
  const [groupedPermissions, setGroupedPermissions] = useState([]);

  // Preload role for editing
  useEffect(() => {
    if (role) {
      setForm({
        name: role.name || "",
        slug: role.slug || "",
        description: role.description || "",
        permissions: role.role_permissions?.map((rp) => rp.permission_id) || [],
      });
    } else {
      setForm({ name: "", slug: "", description: "", permissions: [] });
    }
  }, [role]);

  // Fetch all permissions grouped
  useEffect(() => {
    const fetchPermissions = async () => {
      const res = await UseMethod("get", "permissions?with_group=true");
      if (res?.data) setGroupedPermissions(res.data);
    };
    fetchPermissions();
  }, []);

  const handleCheckbox = (id) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter((pid) => pid !== id)
        : [...prev.permissions, id],
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      created_by: 1,
    };

    const method = role ? "put" : "post";
    const url = role ? `roles/${role.id}` : "roles";

    const res = await UseMethod(method, url, payload);
    if (res) {
      alert(role ? "Role updated successfully" : "Role created successfully");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: "#1976d2",
          color: "white",
          fontWeight: "bold",
          px: 3,
          py: 2,
        }}
      >
        {role ? "Edit Role" : "Create New Role"}
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: "#f9f9f9", px: 3, py: 2 }}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{md:6}}>
            <TextField
              label="Name"
              fullWidth
              size="small"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Grid>
          <Grid size={{md:6}}>
            <TextField
              label="Slug"
              fullWidth
              size="small"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </Grid>
          <Grid size={{md:12}}>
            <TextField
              label="Description"
              fullWidth
              size="small"
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Grid>

          <Grid size={{md:12}}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold", mt: 1 }}
            >
              Permissions
            </Typography>

            <Grid container spacing={1}>
              {groupedPermissions.map((group) => (
                <Grid size={{md:6}} key={group.group} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "medium",
                      backgroundColor: "#e3f2fd",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {group.group}
                  </Typography>

                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {group.permissions.map((perm) => (
                      <Grid size={{md:6}} sm={6} md={4} key={perm.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={form.permissions.includes(perm.id)}
                              onChange={() => handleCheckbox(perm.id)}
                            />
                          }
                          label={perm.name}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, backgroundColor: "#f5f5f5" }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ fontWeight: "bold" }}
        >
          {role ? "Update Role" : "Save Role"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleFormModal;
