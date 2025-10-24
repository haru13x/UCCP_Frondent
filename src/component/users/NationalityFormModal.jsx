import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { UseMethod } from "../../composables/UseMethod";

const NationalityFormModal = ({ open, onClose, nationality, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    is_active: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (nationality) {
      setFormData({
        name: nationality.name || "",
        code: nationality.code || "",
        description: nationality.description || "",
        is_active: nationality.status_id !== undefined ? (nationality.status_id === 1 ? 1 : 0) : 1,
      });
    } else {
      setFormData({ name: "", code: "", description: "", is_active: 1 });
    }
  }, [nationality]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = nationality ? "put" : "post";
      const url = "nationalities";
      const params = nationality ? nationality.id : null;
      const response = await UseMethod(method, url, formData, params);
      if (response?.status === 200 || response?.status === 201) {
        if (onRefresh) onRefresh();
        onClose();
      }
    } catch (error) {
      console.error("Error saving nationality:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{nationality ? "Edit Nationality" : "Add Nationality"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField name="name" label="Name" value={formData.name} onChange={handleChange} required fullWidth />
            <TextField name="code" label="Code" value={formData.code} onChange={handleChange} fullWidth />
            <TextField name="description" label="Description" value={formData.description} onChange={handleChange} multiline rows={3} fullWidth />
            <FormControlLabel
              control={<Checkbox name="is_active" checked={formData.is_active === 1} onChange={handleChange} />}
              label="Active Status"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NationalityFormModal;