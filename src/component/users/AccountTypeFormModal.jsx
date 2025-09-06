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
  Autocomplete,
} from "@mui/material";
import { UseMethod } from "../../composables/UseMethod";

const AccountTypeFormModal = ({ open, onClose, accountType, onRefresh }) => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    group_id: null,
    is_active: 1,
  });
  const [accountGroups, setAccountGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accountType) {
      setFormData({
        code: accountType.code || "",
        description: accountType.description || "",
        group_id: accountType.group_id || null,
        is_active: accountType.is_active !== undefined ? accountType.is_active : 1,
      });
    } else {
      setFormData({
        code: "",
        description: "",
        group_id: null,
        is_active: 1,
      });
    }
  }, [accountType]);

  useEffect(() => {
    const fetchAccountGroups = async () => {
      try {
        const response = await UseMethod("get", "account-groups");
        if (response?.data) {
          setAccountGroups(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch account groups:", error);
      }
    };
    if (open) {
      fetchAccountGroups();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleGroupChange = (event, value) => {
    setFormData((prev) => ({
      ...prev,
      group_id: value ? value.id : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = accountType ? "put" : "post";
      const url = accountType
        ? `account-types/${accountType.id}`
        : "account-types";

      const response = await UseMethod(method, url, formData);

      if (response?.status === 200 || response?.status === 201) {
        if (onRefresh) onRefresh();
        onClose();
      }
    } catch (error) {
      console.error("Error saving account type:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedGroup = accountGroups.find(group => group.id === formData.group_id) || null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {accountType ? "Edit Account Type" : "Add Account Type"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              name="code"
              label="Code"
              value={formData.code}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            <Autocomplete
              options={accountGroups}
              getOptionLabel={(option) => option.description || option.name || ""}
              value={selectedGroup}
              onChange={handleGroupChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Account Group"
                  required
                  fullWidth
                />
              )}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="is_active"
                  checked={formData.is_active === 1}
                  onChange={handleChange}
                />
              }
              label="Active Status"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AccountTypeFormModal;