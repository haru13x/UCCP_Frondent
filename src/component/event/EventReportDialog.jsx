import React, { useEffect, useState } from "react";
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
import { UseMethod } from "../../composables/UseMethod";



export default function EventReportDialog({ open, onClose, onGenerate }) {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "1", // Default: Active
    organizerId: "",
  });
  const [organizers, setOrganizer] = useState([]);
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const fetchOrganizer = async () => {
      const res = await UseMethod("get", `get-organizer`);
      setOrganizer(res?.data || []);
    }
    fetchOrganizer();
  }, [open])
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
          <Grid size={{ md: 6 }} item xs={12} sm={6}>
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
          <Grid size={{ md: 6 }} item xs={12} sm={6}>
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
          <Grid size={{ md: 12 }} item xs={12} sm={6}>
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
          <Grid size={{ md: 12 }} item xs={12} sm={6}>
         <TextField
  name="organizerId"
  label="Organizer"
  size="small"
  select
  fullWidth
  value={filters.organizerId}
  onChange={handleChange}
  SelectProps={{
    renderValue: (selected) => {
      if (selected === '') {
        return 'All'; // Show this when "All" is selected
      }
      const org = organizers.find((o) => String(o.id) === String(selected));
      return org ? org.name : '';
    },
  }}
>
  <MenuItem value="">All</MenuItem>
  {organizers.map((org) => (
    <MenuItem key={org.id} value={String(org.id)}>
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
