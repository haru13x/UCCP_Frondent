import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Checkbox,
    List,
    Grid,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    CircularProgress,
    Typography,
    Box,
    InputAdornment,
    Paper,
    Chip,
    useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { UseMethod } from "../../composables/UseMethod";
import { useSnackbar } from "./SnackbarProvider ";


const RegisterUserSelectorModal = ({ open, onClose, eventId }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();
    const isMobile = useMediaQuery("(max-width:768px)");

    const fetchUsers = async (query = "") => {
        setLoading(true);
        try {
            const payload = { search: query.trim(), event_id: eventId };
            const res = await UseMethod("post", `search-users`, payload);
            setUsers(res?.data || []);
        } catch (err) {
            console.error(err);
            showSnackbar({ message: "Failed to load users.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        await fetchUsers(search);
    };

    const toggleSelect = (user) => {
        setSelectedUsers((prev) => {
            const exists = prev.find((u) => u.id === user.id);
            if (exists) {
                return prev.filter((u) => u.id !== user.id);
            } else {
                return [...prev, user];
            }
        });
    };

    const handleRegister = async () => {
        const userIds = selectedUsers.map((u) => u.id);
        try {
            const res = await UseMethod("post", `event-registration-multiple`, {
                users: userIds,
                event_id: eventId,
            });

            if (res) {
                showSnackbar({ message: "Users registered successfully!", type: "success" });
                setSelectedUsers([]);
                setSearch("");
                setUsers([]);
                handleClose();
            } else {
                throw new Error("Registration failed");
            }
        } catch (err) {
            console.error(err);
            showSnackbar({ message: "Error registering users.", type: "error" });
        }
    };
    const handleAlreadyRegistered = () => {
        showSnackbar({ message: "User already registered", type: "warning" });
        return false;
    };
    const handleClose = () => {
        setSelectedUsers([]);
        setSearch("");
        setLoading(false);
        setUsers([]);

        setSearch("");
        onClose();



    }
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xl"

        >
            <DialogTitle
                sx={{
                    fontWeight: "bold",
                    fontSize: 22,
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid #ddd",
                    backgroundColor: "#1976d2",
                    color: "white",
                }}
            >
                Select Users for Event #{eventId}
            </DialogTitle>

            <DialogContent sx={{ p: 3, height: "70vh", m: 2 }}>
                <Grid container spacing={3}>
                    {/* Left Panel: Search + List */}
                    <Grid size={{ md: 7 }} item xs={12} md={7}>
                        <form onSubmit={handleSearch}>
                            <Box display="flex" gap={2} mb={2} sx={{ mt: 1 }}>
                                <TextField
                                    label="Search by Name or User ID"
                                    size="small"
                                    variant="outlined"
                                    fullWidth
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSearch(e);
                                    }}
                                />
                                <Button type="submit" variant="contained" color="primary">
                                    Search
                                </Button>
                            </Box>
                        </form>

                        {loading ? (
                            <Box display="flex" justifyContent="center" mt={4}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    maxHeight: "55vh",
                                    overflowY: "auto",
                                }}
                            >
                                <List dense>
                                    {users.length === 0 ? (
                                        <Typography variant="body2">No users found.</Typography>
                                    ) : (
                                        users.map((user) => {
                                            const isRegistered = user?.is_registered;
                                            return (
                                                <ListItem
                                                    key={user.id}
                                                    divider
                                                    sx={{ opacity: isRegistered ? 0.6 : 1 }}
                                                    secondaryAction={
                                                        isRegistered ? (
                                                            <Chip
                                                                icon={<CheckCircleIcon fontSize="small" />}
                                                                label="Registered"
                                                                color="success"
                                                                size="small"
                                                                onClick={handleAlreadyRegistered}
                                                                sx={{ cursor: "pointer" }}
                                                            />
                                                        ) : (
                                                            <Checkbox
                                                                edge="end"
                                                                checked={selectedUsers.some((u) => u.id === user.id)}
                                                                onChange={() => toggleSelect(user)}
                                                            />

                                                        )
                                                    }
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: "#1976d2" }}>
                                                            {user.details?.first_name?.[0] || <PersonIcon />}
                                                        </Avatar>
                                                    </ListItemAvatar>

                                                    {/* 👇 Updated Text Display */}
                                                    <ListItemText
                                                        primary={
                                                            <Typography fontWeight={600}>
                                                                {user.details?.first_name || "Unknown"}{" "}
                                                                {user.details?.last_name || ""}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <>

                                                                <Typography variant="body2" color="textSecondary">
                                                                    Sex: {user.details?.sex?.name || "N/A"} || Birthdate:{" "}
                                                                    {user.details?.birthdate || "N/A"}
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    color={isRegistered ? "green" : "gray"}
                                                                >
                                                                    {isRegistered ? "Already Registered" : "Not Registered"}
                                                                </Typography>
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                            );
                                        })
                                    )}
                                </List>
                            </Paper>
                        )}
                    </Grid>

                    {/* Right Panel: Selected Users */}
                    <Grid size={{ md: 5 }} sx={{ mt: 6 }} item xs={12} md={5}>
                        {selectedUsers.length > 0 ? (
                            <>
                                <Typography fontWeight="bold" mb={1}>
                                    ✅ Selected Users:
                                </Typography>
                                <Paper
                                    sx={{
                                        p: 2,
                                        maxHeight: "55vh",
                                        overflowY: "auto",
                                        borderRadius: 2,
                                        backgroundColor: "#f9f9f9",
                                    }}
                                >
                                    <List dense>
                                        {selectedUsers.map((user) => (
                                            <ListItem
                                                key={user.id}
                                                sx={{
                                                    mb: 1,
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    backgroundColor: "#fff",
                                                    boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
                                                }}
                                                secondaryAction={
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => toggleSelect(user)}
                                                        sx={{ textTransform: "none", fontSize: 12 }}
                                                    >
                                                        Remove
                                                    </Button>
                                                }
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: "#1976d2" }}>
                                                        {user.details?.first_name?.[0] || <PersonIcon />}
                                                    </Avatar>
                                                </ListItemAvatar>

                                                <ListItemText
                                                    primary={
                                                        <Typography fontWeight="bold">
                                                            {user.details?.first_name || "Unknown"}{" "}
                                                            {user.details?.last_name || ""}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Sex: {user.details?.sex?.name || "N/A"} || Birthdate: {user.details?.birthdate || "N/A"}
                                                            </Typography>

                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>

                            </>
                        ) : (
                            <Box mt={4} textAlign="center">
                                <img
                                    src="no_data.svg" // change this to the actual path of your image
                                    alt="No Data"
                                    style={{ maxWidth: "290px", marginBottom: 8 }}
                                />
                                <Typography variant="body2" color="textSecondary">
                                    No users selected.
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: "1px solid #ddd" }}>
                <Button
                    onClick={handleClose}
                    color="error"
                    startIcon={<CloseIcon />}
                    sx={{ fontWeight: 600 }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    disabled={selectedUsers.length === 0}
                    onClick={handleRegister}
                    sx={{ fontWeight: 600 }}
                >
                    Register Selected ({selectedUsers.length})
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RegisterUserSelectorModal;
