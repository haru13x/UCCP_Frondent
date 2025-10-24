import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    Grid,
    Card
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { UseMethod } from '../../composables/UseMethod';
import { useSnackbar } from '../../component/event/SnackbarProvider ';

export default function RequestTable() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
    const [statusFilter, setStatusFilter] = useState('1'); // Default to pending
    const { showSnackbar } = useSnackbar();

    const fetchData = async (search = '') => {
        setLoading(true);
        try {
            const response = await UseMethod('post', 'request-registration', { 
                search,
                status: statusFilter 
            });
            if (response?.data) {
                const formatted = response.data.map((user) => {
                    const fullName =
                        user.details?.first_name && user.details?.last_name
                            ? `${user.details.first_name} ${user.details.last_name}`
                            : user.name;

                    const group = user.group?.description || user.account_type?.[0]?.account_group?.description || 'N/A';
                    const location = user.location?.name || 'N/A';
                    const date = new Date(user.created_at);
                    const role = user?.role?.name;
                    const options = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                    };

                    let status;
                    switch (user.is_request) {
                        case 2:
                            status = 'Declined';
                            break;
                        case 1:
                        default:
                            status = 'Pending';
                    }

                    return {
                        id: user.id,
                        role,
                        user: fullName,
                        group,
                        registerDate: date.toLocaleString('en-US', options),
                        location,
                        status,
                        is_request: user.is_request
                    };
                });

                setRows(formatted);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
            showSnackbar({
                message: 'Failed to fetch registration requests',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Initial load with default pending status

    const handleConfirmClick = (user) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleDeclineClick = (user) => {
        setSelectedUser(user);
        setDeclineDialogOpen(true);
    };

    const handleConfirm = async () => {
        if (!selectedUser) return;
        try {
            await UseMethod('post', `approve-request/${selectedUser.id}`);
            showSnackbar({
                message: `User ${selectedUser.user} approved successfully! An email notification has been sent.`,
                type: 'success',
            });
            fetchData(searchText); // Refresh table
        } catch (err) {
            console.error('Failed to approve:', err);
            showSnackbar({
                message: `Failed to approve user ${selectedUser.user}. Please try again.`,
                type: 'error',
            });
        } finally {
            setDialogOpen(false);
            setSelectedUser(null);
        }
    };

    const handleDecline = async () => {
        if (!selectedUser || !declineReason) return;
        try {
            await UseMethod('post', `decline-request/${selectedUser.id}`, {
                reason: declineReason
            });
            showSnackbar({
                message: `User ${selectedUser.user} request declined. An email notification has been sent.`,
                type: 'warning',
            });
            fetchData(searchText); // Refresh table
        } catch (err) {
            console.error('Failed to decline:', err);
            showSnackbar({
                message: `Failed to decline user ${selectedUser.user}. Please try again.`,
                type: 'error',
            });
        } finally {
            setDeclineDialogOpen(false);
            setSelectedUser(null);
            setDeclineReason('');
        }
    };

    const columns = [
        { field: 'user', headerName: 'Name', flex: 1 },
        { field: 'group', headerName: 'Account Group', flex: 1 },
        { field: 'location', headerName: 'Location', flex: 1 },
        { field: 'registerDate', headerName: 'Register Date', flex: 1 },
        { 
            field: 'status',
            headerName: 'Status',
            flex: 0.7,
            renderCell: (params) => (
                <Typography
                    sx={{
                        textAlign: 'center',
                        padding: 1,
                        color: params.value === 'Approved' 
                            ? 'success.main'
                            : params.value === 'Declined'
                            ? 'error.main'
                            : 'warning.main',
                        fontWeight: 'medium'
                    }}
                >
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'action',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <Stack direction="row" sx={{ justifyContent: 'center' , padding:1}} spacing={1}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        
                        onClick={() => handleConfirmClick(params.row)}
                    >
                        Approve
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                       
                        onClick={() => handleDeclineClick(params.row)}
                    >
                        Decline
                    </Button>
                </Stack>
            ),
        },
    ];

    const handleSearchClick = () => {
        fetchData(searchText);
    };

    return (
        <Box sx={{ p: 1 }}>
            <Card sx={{ p: 2 }}>
                <Grid container>
                    <Grid size={{ md: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            User Registration Requests
                        </Typography>
                    </Grid>
                    {/* Search and Filter */}
                    <Grid size={{ md: 7 }} container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ md: 7 }} item xs={4}>
                            <TextField
                                variant="outlined"
                                placeholder="Search by name, group, type…"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                fullWidth
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSearchClick();
                                }}
                                size='small'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    fetchData(searchText);
                                }}
                                SelectProps={{
                                    native: true
                                }}
                            >
                                <option value="1">Pending</option>
                                <option value="2">Declined</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={2}>
                            <Button 
                                variant="contained" 
                                onClick={handleSearchClick}
                                fullWidth
                            >
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                {/* Table */}
                <Box sx={{ height: 520, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        disableRowSelectionOnClick

                        slots={{
                            loadingOverlay: () => (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <CircularProgress />
                                </Box>
                            ),
                        }}
                    />
                </Box>
            </Card>
            {/* Confirm Dialog */}
            <Dialog
                fullWidth
                open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>
                    <CheckCircleIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Confirm Approval
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        <strong>Name:</strong> {selectedUser?.user}
                    </Typography>
                    <Typography gutterBottom>
                        <strong>Role:</strong> {selectedUser?.role}
                    </Typography>
                    <Typography gutterBottom>
                        <strong>Account Group:</strong> {selectedUser?.group}
                    </Typography>
                    <Typography gutterBottom>
                        <strong>Location:</strong> {selectedUser?.location}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirm} variant="contained" color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Decline Dialog */}
            <Dialog
                fullWidth
                open={declineDialogOpen}
                onClose={() => setDeclineDialogOpen(false)}
            >
                <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
                    Decline Registration Request
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        <strong>Name:</strong> {selectedUser?.user}
                    </Typography>
                    <Typography gutterBottom>
                        <strong>Role:</strong> {selectedUser?.role}
                    </Typography>
                    <Typography gutterBottom>
                        <strong>Account Group:</strong> {selectedUser?.group}
                    </Typography>
                    <Typography gutterBottom>
                        <strong>Location:</strong> {selectedUser?.location}
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Reason for Decline"
                        fullWidth
                        multiline
                        rows={4}
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        required
                        error={!declineReason}
                        helperText={!declineReason ? "Please provide a reason for declining" : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setDeclineDialogOpen(false);
                        setDeclineReason('');
                    }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDecline}
                        variant="contained"
                        color="error"
                        disabled={!declineReason}
                    >
                        Decline Request
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
