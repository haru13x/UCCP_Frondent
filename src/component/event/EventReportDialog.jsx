import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";

const organizers = [
  { id: 1, name: "Organizer A" },
  { id: 2, name: "Organizer B" },
  { id: 3, name: "Organizer C" },
];

export default function EventReportDialog({ open, onClose, onGenerate }) {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "1", // Default: Active
    organizerId: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    onGenerate(filters);
    // onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        // Prevent closing on backdrop click
        if (reason !== "backdropClick") onClose();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Generate Event Report</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{md:6}} item xs={12} sm={6}>
            <TextField
              name="fromDate"
              label="From Date"
              type="date"
              size="small"
              fullWidth
              value={filters.fromDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid  size={{md:6}}  item xs={12} sm={6}>
            <TextField
              name="toDate"
              label="To Date"
              type="date"
               size="small"
              fullWidth
              value={filters.toDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{md:12}}  item xs={12} sm={6}>
            <TextField
              name="status"
              label="Status"
               size="small"
              select
              fullWidth
              value={filters.status}
              onChange={handleChange}
            >
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="2">Cancelled</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{md:12}}  item xs={12} sm={6}>
            <TextField
              name="organizerId"
              label="Organizer"
               size="small"
              select
              fullWidth
              value={filters.organizerId}
              onChange={handleChange}
            >
              <MenuItem value="">All</MenuItem>
              {organizers.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleGenerate} variant="contained" color="primary">
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
