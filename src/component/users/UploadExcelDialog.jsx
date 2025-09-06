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
  Paper,
  Divider,
  IconButton,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload,
  Download,
  Close,
  FileUpload,
  CheckCircle,
} from '@mui/icons-material';
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
  const [isUploading, setIsUploading] = useState(false);

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

  const handleDownloadTemplate = () => {
    // Create a sample Excel template
      const templateData = [
      ['Name', 'Email', 'Phone', 'Department'],
      ['John Doe', 'john@example.com', '123-456-7890', 'IT'],
      ['Jane Smith', 'jane@example.com', '098-765-4321', 'HR'],
    ];
    
    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user_upload_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    setIsUploading(true);
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
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 3,
          px: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CloudUpload sx={{ fontSize: 28 }} />
          <Typography variant="h5" component="div" fontWeight="600">
            Upload Excel File
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      {isUploading && <LinearProgress />}
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Alert 
            severity="info" 
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={<Download />}
                onClick={handleDownloadTemplate}
                sx={{ fontWeight: 600 }}
              >
                Download Template
              </Button>
            }
          >
            Download the template file to see the required format for uploading users.
          </Alert>
          
          <Box display="flex" flexDirection="column" gap={3}>
            <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#374151', fontWeight: 600, mb: 2 }}>
                User Configuration
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={2.5}>
                <TextField
                  select
                  size="small"
                  label="Select Role"
                  value={uploadForm.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                    }
                  }}
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
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                    }
                  }}
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
                          return (
                            <Chip 
                              key={id} 
                              label={found?.description || id} 
                              size="small"
                              sx={{ 
                                backgroundColor: '#e0e7ff', 
                                color: '#3730a3',
                                fontWeight: 500
                              }}
                            />
                          );
                        })}
                      </Box>
                    ),
                  }}
                  fullWidth
                  variant="outlined"
                  disabled={!uploadForm.accountGroupId}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                    }
                  }}
                >
                  {accountTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.description}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f0fdf4', borderRadius: 2, border: '2px dashed #10b981' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#065f46', fontWeight: 600, mb: 2 }}>
                File Upload
              </Typography>
              
              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Button 
                  variant="outlined" 
                  component="label"
                  size="large"
                  startIcon={<FileUpload />}
                  sx={{
                    borderRadius: 2,
                    borderColor: '#10b981',
                    color: '#065f46',
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#059669',
                      backgroundColor: '#ecfdf5'
                    }
                  }}
                >
                  Choose Excel File
                  <input type="file" accept=".xlsx, .xls, .csv" hidden onChange={handleFileChange} />
                </Button>
                
                {uploadForm.file && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      p: 2, 
                      backgroundColor: 'white', 
                      borderRadius: 2,
                      border: '1px solid #d1fae5',
                      width: '100%'
                    }}
                  >
                    <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#065f46', fontWeight: 500 }}>
                      Selected: {uploadForm.file.name}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </DialogContent>

      <Divider />
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          size="large"
          sx={{ 
            borderRadius: 2,
            px: 4,
            fontWeight: 600,
            borderColor: '#d1d5db',
            color: '#6b7280'
          }}
          disabled={isUploading}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleUpload}
          variant="contained"
          size="large"
          startIcon={<CloudUpload />}
          disabled={
            isUploading ||
            !uploadForm.role ||
            !uploadForm.accountGroupId ||
            uploadForm.accountTypeId.length === 0 ||
            !uploadForm.file
          }
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.6)',
            },
            '&:disabled': {
              background: '#e5e7eb',
              color: '#9ca3af'
            }
          }}
        >
          {isUploading ? 'Uploading...' : 'Upload Excel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadExcelDialog;
