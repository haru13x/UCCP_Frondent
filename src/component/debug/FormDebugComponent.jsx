import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Autocomplete,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { UseMethod } from '../../composables/UseMethod';

const FormDebugComponent = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    isconference: false,
    conference_locations: []
  });
  const [locations, setLocations] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await UseMethod('get', 'get-church-locations');
        console.log('Locations response:', res);
        if (res?.data) {
          setLocations(res.data);
          setDebugInfo(prev => prev + `\nLocations loaded: ${res.data.length} items`);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setDebugInfo(prev => prev + `\nError loading locations: ${error.message}`);
      }
    };
    
    if (open) {
      fetchLocations();
    }
  }, [open]);

  const handleConferenceChange = (e) => {
    const checked = e.target.checked;
    setFormData(prev => ({ ...prev, isconference: checked }));
    setDebugInfo(prev => prev + `\nConference checkbox changed: ${checked}`);
  };

  const handleLocationChange = (e, values) => {
    const locationIds = values.map(v => v.id);
    setFormData(prev => ({ ...prev, conference_locations: locationIds }));
    setDebugInfo(prev => prev + `\nLocations selected: ${JSON.stringify(locationIds)}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Form Debug Test</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isconference || false}
                  onChange={handleConferenceChange}
                  color="primary"
                />
              }
              label="This is a conference event (multiple locations)"
            />
          </Grid>
          
          {formData.isconference && (
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={locations}
                getOptionLabel={(option) => option.name || option.slug}
                value={locations.filter(location => 
                  formData.conference_locations?.includes(location.id)
                )}
                onChange={handleLocationChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Conference Locations"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Typography variant="h6">Debug Info:</Typography>
            <Box sx={{ 
              backgroundColor: '#f5f5f5', 
              p: 2, 
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              whiteSpace: 'pre-wrap'
            }}>
              Form Data: {JSON.stringify(formData, null, 2)}
              {debugInfo}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Button onClick={onClose} variant="contained">
              Close
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default FormDebugComponent;