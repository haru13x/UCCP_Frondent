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
    const { showSnackbar } = useSnackbar();
    const fetchData = async (search = '') => {
        setLoading(true);
        try {
            const response = await UseMethod('post', 'request-registration', { search });
            if (response?.data) {
                const formatted = response.data.map((user) => {
                    const fullName =
                        user.details?.first_name && user.details?.last_name
                            ? `${user.details.first_name} ${user.details.last_name}`
                            : user.name;

                    const accountTypes = user.account_type?.map(at => at.account_type?.description || 'N/A') || [];
                    const group = user.account_type?.[0]?.account_group?.description || 'N/A';
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
                    return {
                        id: user.id,
                        role,
                        user: fullName,
                        group,
                        registerDate: date.toLocaleString('en-US', options), // e.g., "July 2, 2025, 2:00 PM"
                        accountType: accountTypes.join(', '),
                        status: user.status_id === 1 ? 'Approved' : 'Pending',
                    };
                });

                setRows(formatted);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleConfirmClick = (user) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleConfirm = async () => {
        if (!selectedUser) return;
        try {
            await UseMethod('post', `approve-request/${selectedUser.id}`);
            showSnackbar({
                message: `User ${selectedUser.user} approved successfully!`,
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

    const handleSearchClick = () => {
        fetchData(searchText);
    };

    const columns = [
        { field: 'user', headerName: 'Name', flex: 1 },
        { field: 'group', headerName: 'Account Group', flex: 1 },
        { field: 'accountType', headerName: 'Account Type(s)', flex: 1 },
        { field: 'registerDate', headerName: 'Register Date', flex: 1 },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    disabled={params.row.status === 'Approved'}
                    onClick={() => handleConfirmClick(params.row)}
                >
                    Confirm
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ p: 1 }}>
            <Card sx={{ p: 2 }}>
                <Grid container>
                    <Grid size={{ md: 5 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            User Registration Requests
                        </Typography>
                    </Grid>
                    {/* Search Field */}
                    <Grid size={{ md: 5 }} direction="row" spacing={2} sx={{ mb: 2 }}>
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
                    <Grid sx={{ ml: 2 }}>
                        <Button variant="contained" onClick={handleSearchClick}>
                            Search
                        </Button>
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
                        <strong>Account Type(s):</strong> {selectedUser?.accountType}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirm} variant="contained" color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
