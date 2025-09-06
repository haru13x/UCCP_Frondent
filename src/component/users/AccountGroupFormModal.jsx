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

const AccountGroupFormModal = ({ open, onClose, accountGroup }) => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    is_active: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accountGroup) {
      setFormData({
        code: accountGroup.code || "",
        description: accountGroup.description || "",
        is_active: accountGroup.is_active !== undefined ? accountGroup.is_active : 1,
      });
    } else {
      setFormData({
        code: "",
        description: "",
        is_active: 1,
      });
    }
  }, [accountGroup]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = accountGroup ? "put" : "post";
      const url = accountGroup
        ? `account-groups/${accountGroup.id}`
        : "account-groups";

      const response = await UseMethod(method, url, formData);

      if (response?.status === 200 || response?.status === 201) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving account group:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {accountGroup ? "Edit Account Group" : "Add Account Group"}
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

export default AccountGroupFormModal;