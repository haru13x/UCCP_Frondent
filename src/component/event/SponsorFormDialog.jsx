import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

const SponsorFormDialog = ({ open, onClose, onSave, defaultData }) => {
  const [sponsorData, setSponsorData] = useState({
    name: "",
    donated: "",
    logo: "",
    contact_person: "",
  });

  useEffect(() => {
    if (defaultData) {
      setSponsorData(defaultData);
    } else {
      setSponsorData({
        name: "",
        donated: "",
        logo: "",
        contact_person: "",
      });
    }
  }, [defaultData]);

  const handleSave = () => {
    if (!sponsorData.name) return;
    onSave(sponsorData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{defaultData ? "✏️ Edit Sponsor" : "🤝 Add Sponsor"}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{md:6}}>
            <TextField
              label="Sponsor Name"
              fullWidth
              size="small"
              value={sponsorData.name}
              onChange={(e) => setSponsorData({ ...sponsorData, name: e.target.value })}
            />
          </Grid>
          <Grid size={{md:6}}>
            <TextField
              label="Donated"
              fullWidth
              size="small"
              value={sponsorData.donated}
              onChange={(e) => setSponsorData({ ...sponsorData, donated: e.target.value })}
            />
          </Grid>
          <Grid size={{md:6}}>
            <TextField
              label="Logo URL"
              fullWidth
              size="small"
              value={sponsorData.logo}
              onChange={(e) => setSponsorData({ ...sponsorData, logo: e.target.value })}
            />
          </Grid>
          <Grid size={{md:6}}>
            <TextField
              label="Contact Person"
              fullWidth
              size="small"
              value={sponsorData.contact_person}
              onChange={(e) =>
                setSponsorData({ ...sponsorData, contact_person: e.target.value })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          {defaultData ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SponsorFormDialog;
