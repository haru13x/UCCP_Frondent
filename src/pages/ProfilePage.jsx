import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Box,
  IconButton,
  Card,
  CardContent,
  Divider,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  InputAdornment,
  Fade,
  Chip,
  MenuItem
} from '@mui/material';
import { 
  Edit, 
  PhotoCamera, 
  Save, 
  Cancel, 
  Person, 
  Lock, 
  Email, 
  Phone, 
  LocationOn,
  CalendarToday,
  Visibility,
  VisibilityOff,
  Security,
  AccountCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { UseMethod } from '../composables/UseMethod';

const ProfileHeader = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: `3px solid ${theme.palette.common.white}`,
  boxShadow: theme.shadows[8],
  fontSize: '2.5rem',
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-4px)'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)'
    }
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  minHeight: 48,
  '&.Mui-selected': {
    color: theme.palette.primary.main
  }
}));

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ProfilePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    username: '',
    email: '',
    mobile: '',
    birthdate: '',
    gender: '',
    address: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('api_token');
      
      if (token) {
        const response = await UseMethod('get', 'profile');
        
        if (response?.data) {
          const responseData = response.data;
          // Backend returns nested structure with 'data' and 'role' properties
          const userData = responseData.data || responseData;
          const userRole = responseData.role;
          
          // Store complete user profile including role
          setUserDetails({ ...userData, role: userRole });
          setForm({
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            middle_name: userData.middle_name || '',
            username: userData.username || '',
            email: userData.email || '',
            mobile: userData.phone_number || '',
            birthdate: userData.birthdate || '',
            gender: userData.sex_id || '',
            address: userData.address || ''
          });
        }
      } else {
        // Fallback to localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        // Handle both old and new data structures
        const userData = user.details ? { ...user.details, email: user.email, username: user.username } : user;
        setUserDetails(userData);
        setForm({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          middle_name: userData.middle_name || '',
          username: userData.username || '', // Now from user table
          email: userData.email || '', // Now from user table
          mobile: userData.phone_number || '',
          birthdate: userData.birthdate || '',
          gender: userData.sex_id || '',
          address: userData.address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showSnackbar('Error loading profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return '';
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Reset form to original values when canceling
      setForm({
        first_name: userDetails.first_name || '',
        last_name: userDetails.last_name || '',
        middle_name: userDetails.middle_name || '',
        username: userDetails.username || '', // Now from user table
        email: userDetails.email || '', // Now from user table
        mobile: userDetails.phone_number || '',
        birthdate: userDetails.birthdate || '',
        gender: userDetails.sex_id || '',
        address: userDetails.address || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('api_token');
      
      // Debug token information
      console.log('Token check:', {
        tokenExists: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? token.substring(0, 10) + '...' : 'null'
      });
      
      if (!token) {
        showSnackbar('Please login to update profile', 'error');
        return;
      }

      // Prepare form data with sex_id instead of gender and phone_number instead of mobile
      // Backend now expects username and handles firstname/lastname -> name mapping
      const formData = new FormData();
      formData.append('first_name', form.first_name);
      formData.append('last_name', form.last_name);
      formData.append('middle_name', form.middle_name || '');
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('phone_number', form.mobile || '');
      formData.append('birthdate', form.birthdate || '');
      formData.append('address', form.address || '');
      formData.append('sex_id', form.gender || '');
      
      // Add image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await axios.post('http://localhost:8000/api/profile?_method=PUT', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        const updatedUser = response.data.data;
        const userRole = response.data.role;
        // Include role information in user details
        const completeUserData = { ...updatedUser, role: userRole };
        setUserDetails(completeUserData);
        // Update localStorage with fresh data from backend including role
        localStorage.setItem('user', JSON.stringify(completeUserData));
        // Dispatch custom event to notify other components of user data update
        window.dispatchEvent(new CustomEvent('userDataUpdated'));
        // Clear image selection after successful upload
        setSelectedImage(null);
        setImagePreview(null);
        setEditMode(false);
        showSnackbar('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Display backend error message if available
      if (error.response && error.response.data && error.response.data.message) {
        showSnackbar(error.response.data.message, 'error');
        
        // Log debug information if available
        if (error.response.data.debug) {
          console.log('Backend debug info:', error.response.data.debug);
        }
      } else {
        showSnackbar('Error updating profile', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showSnackbar('New passwords do not match', 'error');
      return;
    }
    
    if (passwordForm.new_password.length < 6) {
      showSnackbar('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('api_token');
      
      if (!token) {
        showSnackbar('Please login to change password', 'error');
        return;
      }
      
      const response = await axios.post('http://localhost:8000/api/change-password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        new_password_confirmation: passwordForm.confirm_password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
        showSnackbar('Password changed successfully!');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showSnackbar(error.response?.data?.message || 'Error changing password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      {/* Compact Profile Header */}
      <ProfileHeader elevation={0}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item sx={{ xs: 4, sm: 4, md: 3, textAlign: { xs: 'center', sm: 'left' } }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <StyledAvatar
                   src={imagePreview || (userDetails.image ? `http://localhost:8000/storage/${userDetails.image}` : null)}
                 >
                   {!imagePreview && !userDetails.image && getInitials(userDetails.first_name, userDetails.last_name)}
                 </StyledAvatar>
                <input
                  id="image-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  disabled={!editMode}
                />
                {editMode && (
                   <IconButton
                     onClick={() => document.getElementById('image-upload-input').click()}
                     sx={{
                       position: 'absolute',
                       bottom: -5,
                       right: -5,
                       backgroundColor: 'white',
                       color: 'primary.main',
                       '&:hover': { backgroundColor: 'grey.100' },
                       boxShadow: 2,
                       width: 32,
                       height: 32
                     }}
                     size="small"
                   >
                     <PhotoCamera fontSize="small" />
                   </IconButton>
                 )}
              </Box>
            </Grid>
            <Grid item sx={{ xs: 12, sm: 8, md: 9 }}>
              <Typography variant="h4" fontWeight="700" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                {`${userDetails.first_name || ''} ${userDetails.last_name || ''}`}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                {userDetails.email}
              </Typography>
              {userDetails.role && (
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, color: 'primary.main', fontWeight: 500 }}>
                  Role: {userDetails.role.name}
                </Typography>
              )}
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Manage your profile and security settings
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </ProfileHeader>

      {/* Navigation Tabs */}
      <ProfileCard>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ px: 3 }}
          >
            <StyledTab 
              icon={<AccountCircle />} 
              iconPosition="start" 
              label="Personal Information" 
            />
            <StyledTab 
              icon={<Security />} 
              iconPosition="start" 
              label="Security" 
            />
          </Tabs>
        </Box>

        {/* Personal Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="600" color="primary">
                Personal Information
              </Typography>
              <Button
                variant={editMode ? "outlined" : "contained"}
                color={editMode ? "error" : "primary"}
                startIcon={editMode ? <Cancel /> : <Edit />}
                onClick={toggleEditMode}
                sx={{ borderRadius: 2, px: 2.5, py: 1 }}
                size="small"
              >
                {editMode ? 'Cancel' : 'Edit'}
              </Button>
            </Box>

            <Grid container spacing={{ xs: 2, sm: 2, md: 2 }}>
              {[
                { label: "First Name", key: "first_name", icon: <Person />, xs: 12, sm: 6, md: 4 },
                { label: "Last Name", key: "last_name", icon: <Person />, xs: 12, sm: 6, md: 4 },
                { label: "Middle Name", key: "middle_name", icon: <Person />, xs: 12, sm: 6, md: 4 },
                { label: "Username", key: "username", icon: <AccountCircle />, xs: 12, sm: 6, md: 4 },
                { label: "Email Address", key: "email", icon: <Email />, xs: 12, sm: 6, md: 4 },
                { label: "Phone Number", key: "mobile", icon: <Phone />, xs: 12, sm: 6, md: 4 },
                { label: "Date of Birth", key: "birthdate", icon: <CalendarToday />, xs: 12, sm: 6, md: 4, type: "date" },
                { label: "Age", key: "age", icon: <CalendarToday />, xs: 12, sm: 6, md: 4, readonly: true },
                { label: "Gender", key: "gender", icon: <Person />, xs: 12, sm: 6, md: 4, type: "select", options: [{ value: 1, label: 'Male' }, { value: 2, label: 'Female' }] },
                { label: "Address", key: "address", icon: <LocationOn />, xs: 12, sm: 12, md: 12 },
              ].map(({ label, key, icon, xs, sm, md, type, readonly, options }) => (
                <Grid item size={{md:md}} key={key}>
                  <Typography variant="caption" fontWeight="600" color="text.secondary" mb={0.5} display="block">
                    {label}
                  </Typography>
                  {editMode ? (
                    readonly ? (
                      <StyledTextField
                        fullWidth
                        size="small"
                        value={key === 'age' ? calculateAge(form.birthdate) : (form[key] || '')}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>{icon}</Box>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiInputBase-input': { backgroundColor: '#f5f5f5' } }}
                      />
                    ) : type === 'select' ? (
                      <StyledTextField
                        fullWidth
                        size="small"
                        name={key}
                        select
                        value={form[key] || ''}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>{icon}</Box>
                            </InputAdornment>
                          ),
                        }}
                      >
                        {options?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    ) : (
                      <StyledTextField
                        fullWidth
                        size="small"
                        name={key}
                        type={type || "text"}
                        value={form[key] || ''}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>{icon}</Box>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )
                  ) : (
                    // <Box
                    //   sx={{
                    //     display: 'flex',
                    //     alignItems: 'center',
                    //     p: 1.5,
                    //     borderRadius: 1.5,
                    //     border: '1px solid',
                    //     borderColor: 'grey.300',
                    //     bgcolor: 'grey.50',
                    //     minHeight: 40,
                    //     transition: 'all 0.2s ease',
                    //     boxSizing: 'border-box'
                    //   }}
                    // >
                    //   <Box sx={{ mr: 1.5, color: 'text.secondary', fontSize: '1.1rem', flexShrink: 0 }}>{icon}</Box>
                    //   <Typography variant="body2" sx={{ fontWeight: 500, flex: 1, wordBreak: 'break-word' }}>
                    //     {userDetails[key] || 'Not provided'}
                    //   </Typography>
                    // </Box>
                      <StyledTextField
                        fullWidth
                        size="small"
                        value={key === 'age' ? calculateAge(form.birthdate) : key === 'gender' ? (options?.find(opt => opt.value === form[key])?.label || form[key] || 'Not provided') : (form[key] || 'Not provided')}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>{icon}</Box>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiInputBase-input': { backgroundColor: '#f9f9f9' } }}
                      />
                  )}
                </Grid>
              ))}
            </Grid>

            {editMode && (
              <Fade in={editMode}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={toggleEditMode}
                    sx={{ borderRadius: 2, px: 2.5 }}
                    size="small"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                    sx={{ borderRadius: 2, px: 3 }}
                    size="small"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Fade>
            )}
          </CardContent>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={1}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" fontWeight="600" color="primary" mb={3}>
              Change Password
            </Typography>
            
            <Grid container spacing={{ xs: 2, sm: 2.5 }} sx={{ maxWidth: { xs: '100%', sm: 500 } }}>
              <Grid size={{md:12}} item xs={12}>
                <Typography variant="caption" fontWeight="600" color="text.secondary" mb={0.5} display="block">
                  Current Password
                </Typography>
                <StyledTextField
                  fullWidth
                  size="small"
                  name="current_password"
                  type={showPassword.current ? "text" : "password"}
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('current')}
                          edge="end"
                          size="small"
                        >
                          {showPassword.current ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid size={{md:12}} item xs={12}>
                <Typography variant="caption" fontWeight="600" color="text.secondary" mb={0.5} display="block">
                  New Password
                </Typography>
                <StyledTextField
                  fullWidth
                  size="small"
                  name="new_password"
                  type={showPassword.new ? "text" : "password"}
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('new')}
                          edge="end"
                          size="small"
                        >
                          {showPassword.new ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid size={{md:12}} item xs={12}>
                <Typography variant="caption" fontWeight="600" color="text.secondary" mb={0.5} display="block">
                  Confirm New Password
                </Typography>
                <StyledTextField
                  fullWidth
                  size="small"
                  name="confirm_password"
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirm')}
                          edge="end"
                          size="small"
                        >
                          {showPassword.confirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid size={{md:12}} item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Security />}
                  onClick={handlePasswordSubmit}
                  disabled={loading || !passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password}
                  sx={{ borderRadius: 2, px: 3, mt: 1.5 }}
                  size="small"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>
      </ProfileCard>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
