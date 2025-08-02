import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { UseMethod } from '../../composables/UseMethod';

const UploadExcelDialog = ({ open, onClose }) => {
  const [uploadForm, setUploadForm] = useState({
    role: '',
    accountGroupId: '',
    accountTypeId: [], // make it array
    file: null,
  });

  const [accountGroups, setAccountGroups] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [roles, setRoles] = useState([]);

  React.useEffect(() => {
    if (open) {
      (async () => {
        const groupRes = await UseMethod('get', 'account-groups');
        const roleRes = await UseMethod('get', 'get-roles');
        setAccountGroups(groupRes?.data || []);
        setRoles(roleRes?.data || []);
      })();
    }
  }, [open]);

  const handleGroupChange = async (groupId) => {
    setUploadForm((prev) => ({ ...prev, accountGroupId: groupId, accountTypeId: [] }));
    const res = await UseMethod('get', `account-types/${groupId}`);
    setAccountTypes(res?.data || []);
  };

  const handleInputChange = (key, value) => {
    setUploadForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e) => {
    setUploadForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('role', uploadForm.role);
    formData.append('account_group_id', uploadForm.accountGroupId);
    uploadForm.accountTypeId.forEach((typeId) => {
      formData.append('account_type_id[]', typeId); // array syntax
    });
    formData.append('file', uploadForm.file);

    try {
      const res = await UseMethod('post', 'upload-users', formData, null, true);

      if (res?.data) {
        alert('✅ Excel uploaded successfully!');
        if (res?.data?.existing_emails?.length) {
          alert('⚠️ These emails already exist:\n' + res.data.existing_emails.join('\n'));
        }
        onClose();
      } else {
        alert('❌ Failed to upload Excel.');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      alert('An error occurred while uploading.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>📥 Upload Excel</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            select
            label="Select Role"
            value={uploadForm.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            fullWidth
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Select Account Group"
            value={uploadForm.accountGroupId}
            onChange={(e) => handleGroupChange(e.target.value)}
            fullWidth
          >
            {accountGroups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.description}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Select Account Types"
            value={uploadForm.accountTypeId}
            onChange={(e) => handleInputChange('accountTypeId', e.target.value)}
            SelectProps={{
              multiple: true,
              renderValue: (selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const found = accountTypes.find((t) => t.id === id);
                    return <Chip key={id} label={found?.description || id} />;
                  })}
                </Box>
              ),
            }}
            fullWidth
            disabled={!uploadForm.accountGroupId}
          >
            {accountTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.description}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="outlined" component="label">
            📄 Choose Excel File
            <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileChange} />
          </Button>
          {uploadForm.file && (
            <Typography variant="body2" color="textSecondary">
              Selected file: {uploadForm.file.name}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={
            !uploadForm.role ||
            !uploadForm.accountGroupId ||
            uploadForm.accountTypeId.length === 0 ||
            !uploadForm.file
          }
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadExcelDialog;
