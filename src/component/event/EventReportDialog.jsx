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
  CircularProgress,
  Box,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import {
  GetApp as DownloadIcon,
  Assessment as ReportIcon,
  DateRange as DateIcon,
  LocationOn as LocationIcon,
  CheckCircle as StatusIcon,
} from "@mui/icons-material";
import { UseMethod } from "../../composables/UseMethod";

export default function EventReportDialog({ open, onClose, onGenerate }) {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "1", // Default: Active
    locationId: "",
  });
  const [locations, setLocations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const fetchLocations = async () => {
      const res = await UseMethod("get", `get-church-locations`);
      setLocations(res?.data || []);
    }
    fetchLocations();
  }, [open])
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(filters);
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        // Prevent closing on backdrop click or when generating
        if (reason !== "backdropClick" && !isGenerating) onClose();
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderRadius: '12px 12px 0 0'
      }}>
        <ReportIcon />
        <Typography variant="h6" component="div">
          📊 Generate Event Report
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure your report parameters below. All fields are optional - leave empty for comprehensive data.
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Box>
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item size={{md:6}} xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DateIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" color="primary">Date Range</Typography>
            </Box>
            <TextField
              name="fromDate"
              label="From Date"
              type="date"
              size="medium"
              fullWidth
              value={filters.fromDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#3b82f6',
                  },
                }
              }}
            />
          </Grid>
          <Grid item size={{md:6}} xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DateIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" color="primary">End Date</Typography>
            </Box>
            <TextField
              name="toDate"
              label="To Date"
              type="date"
              size="medium"
              fullWidth
              value={filters.toDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#3b82f6',
                  },
                }
              }}
            />
          </Grid>
          <Grid item size={{md:6}} xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <StatusIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" color="primary">Event Status</Typography>
            </Box>
            <TextField
              name="status"
              label="Status Filter"
              size="medium"
              select
              fullWidth
              value={filters.status}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#3b82f6',
                  },
                }
              }}
            >
              <MenuItem value="1">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label="Active" color="success" size="small" />
                  Active Events
                </Box>
              </MenuItem>
              <MenuItem value="2">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label="Cancelled" color="error" size="small" />
                  Cancelled Events
                </Box>
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item size={{md:6}} xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" color="primary">Location Filter</Typography>
            </Box>
            <TextField
              name="locationId"
              label="Select Location"
              size="medium"
              select
              fullWidth
              value={filters.locationId}
              onChange={handleChange}
              SelectProps={{
                renderValue: (selected) => {
                  if (selected === '') {
                    return '🌍 All Locations';
                  }
                  const location = locations.find((loc) => String(loc.id) === String(selected));
                  return location ? `📍 ${location.name}` : '';
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#3b82f6',
                  },
                }
              }}
            >
              <MenuItem value="">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  🌍 <strong>All Locations</strong>
                </Box>
              </MenuItem>
              {locations.map((location) => (
                <MenuItem key={location.id} value={String(location.id)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    📍 {location.name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, background: '#f8fafc' }}>
        <Button 
          onClick={onClose} 
          disabled={isGenerating}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleGenerate} 
          variant="contained" 
          disabled={isGenerating}
          startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
          sx={{ 
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)'
            },
            '&:disabled': {
              background: '#94a3b8',
              color: 'white'
            }
          }}
        >
          {isGenerating ? 'Generating Report...' : '📊 Generate PDF Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
