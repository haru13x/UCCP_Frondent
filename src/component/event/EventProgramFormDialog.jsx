import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import SponsorFormDialog from "./SponsorFormDialog";
import { Edit, Delete } from "@mui/icons-material";
import { UseMethod } from "../../composables/UseMethod";
const EventProgramFormDialog = ({ open, onClose, eventId, programs: initialPrograms = [], sponsors: initialSponsors = [] }) => {
  const [programs, setPrograms] = useState([]);
  const [eventSponsors, setEventSponsors] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "warning" });
//   useEffect(() => {
//     if (open) {
//       setPrograms(initialPrograms);
//       setEventSponsors(initialSponsors);
      
//     }
//   }, [open, initialPrograms, initialSponsors]);
  const [programData, setProgramData] = useState({
    start_time: "",
    end_time: "",
    activity: "",
    speaker: "",
  });

  const [openSponsorDialog, setOpenSponsorDialog] = useState(false);
  const [editingSponsorIndex, setEditingSponsorIndex] = useState(null);

  const showSnackbar = (message, severity = "warning") => {
    setSnack({ open: true, message, severity });
  };

  const isOverlapping = (start, end, ignoreIndex = null) => {
    const startTime = start;
    const endTime = end;

    return programs.some((p, i) => {
      if (i === ignoreIndex) return false;
      return (
        (startTime >= p.start_time && startTime < p.end_time) ||
        (endTime > p.start_time && endTime <= p.end_time) ||
        (startTime <= p.start_time && endTime >= p.end_time)
      );
    });
  };

  const handleAddOrUpdateProgram = () => {
    const { start_time, end_time, activity } = programData;
    if (!start_time || !end_time || !activity) {
      showSnackbar("Please fill out required fields (Start, End, Activity)", "error");
      return;
    }

    if (start_time >= end_time) {
      showSnackbar("Start time must be before end time", "error");
      return;
    }

    if (isOverlapping(start_time, end_time, editIndex)) {
      showSnackbar("Overlapping time slot detected!", "error");
      return;
    }

    if (editIndex !== null) {
      const updated = [...programs];
      updated[editIndex] = programData;
      setPrograms(updated.sort((a, b) => a.start_time.localeCompare(b.start_time)));
      setEditIndex(null);
    } else {
      const updated = [...programs, programData].sort((a, b) =>
        a.start_time.localeCompare(b.start_time)
      );
      setPrograms(updated);
    }

    setProgramData({ start_time: "", end_time: "", activity: "", speaker: "" });
  };

  const handleEditProgram = (index) => {
    setProgramData(programs[index]);
    setEditIndex(index);
  };

  const handleDeleteProgram = (index) => {
    setPrograms(programs.filter((_, i) => i !== index));
  };

  const handleSaveSponsor = (sponsor) => {
    if (editingSponsorIndex !== null) {
      const updated = [...eventSponsors];
      updated[editingSponsorIndex] = sponsor;
      setEventSponsors(updated);
      setEditingSponsorIndex(null);
    } else {
      setEventSponsors((prev) => [...prev, sponsor]);
    }
  };

  const handleEditSponsor = (index) => {
    setEditingSponsorIndex(index);
    setOpenSponsorDialog(true);
  };

  const handleDeleteSponsor = (index) => {
    setEventSponsors(eventSponsors.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    const payload = {
      programs,
      event_id : eventId
    };
    const res  = await UseMethod('post', 'test', payload);
    setPrograms([]);
    alert(eventId);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>📋 Event Program Schedule</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} mb={2}>
            <Grid size={{md:3}}>
              <TextField
                type="time"
                label="Start Time"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={programData.start_time}
                onChange={(e) =>
                  setProgramData({ ...programData, start_time: e.target.value })
                }
              />
            </Grid>
           
            <Grid size={{md:3}}>
              <TextField
                type="time"
                label="End Time"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={programData.end_time}
                onChange={(e) =>
                  setProgramData({ ...programData, end_time: e.target.value })
                }
              />
            </Grid>
            <Grid size={{md:6}}>
              <TextField
                label="Activity"
                size="small"
                fullWidth
                value={programData.activity}
                onChange={(e) =>
                  setProgramData({ ...programData, activity: e.target.value })
                }
              />
            </Grid>
            <Grid size={{md:6}}>
              <TextField
                label="Speaker"
                size="small"
                fullWidth
                value={programData.speaker}
                onChange={(e) =>
                  setProgramData({ ...programData, speaker: e.target.value })
                }
              />
            </Grid>
            <Grid size={{md:6}}>
         <Button variant="contained" onClick={handleAddOrUpdateProgram}>
            {editIndex !== null ? "✏️ Update Program" : "➕ Add Program"}
          </Button>

          {/* <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => {
              setEditingSponsorIndex(null);
              setOpenSponsorDialog(true);
            }}
          >
            🤝 Add Sponsor
          </Button> */}
            </Grid>
          </Grid>

 

          {/* Programs Table */}
          {programs.length > 0 && (
            <Paper elevation={2} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Start</strong></TableCell>
                    <TableCell><strong>End</strong></TableCell>
                    <TableCell><strong>Activity</strong></TableCell>
                    <TableCell><strong>Speaker</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {programs.map((prog, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{prog.start_time}</TableCell>
                      <TableCell>{prog.end_time}</TableCell>
                      <TableCell>{prog.activity}</TableCell>
                      <TableCell>{prog.speaker}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleEditProgram(idx)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteProgram(idx)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}

          {/* Sponsors List */}
          {eventSponsors.length > 0 && (
            <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
              <strong>Event Sponsors:</strong>
              <ul>
                {eventSponsors.map((s, i) => (
                  <li key={i}>
                    🏷 Sponser Name : {s.name} -  {s.donated || ""}
                    <IconButton size="small" onClick={() => handleEditSponsor(i)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteSponsor(i)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </li>
                ))}
              </ul>
            </Paper>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveAll}>
            💾 Save All
          </Button>
        </DialogActions>
      </Dialog>

      <SponsorFormDialog
        open={openSponsorDialog}
        onClose={() => setOpenSponsorDialog(false)}
        onSave={handleSaveSponsor}
        defaultData={
          editingSponsorIndex !== null ? eventSponsors[editingSponsorIndex] : null
        }
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} variant="filled" sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EventProgramFormDialog;
