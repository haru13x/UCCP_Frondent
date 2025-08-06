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
    Divider,
    IconButton,
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

    // Fetch users based on search
    const fetchUsers = async (query = "") => {
        setLoading(true);
        try {
            const payload = { search: query.trim(), event_id: eventId };
            const res = await UseMethod("post", `search-users`, payload);
            setUsers(res?.data || []);
        } catch (err) {
            console.error("Error fetching users:", err);
            showSnackbar({ message: "Failed to load users.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmed = search.trim();
        await fetchUsers(trimmed);

        if (trimmed === "") {
            showSnackbar({ message: "Showing all users.", type: "info" });
        }
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
        if (selectedUsers.length === 0) return;

        const userIds = selectedUsers.map((u) => u.id);
        try {
            const res = await UseMethod("post", `event-registration-multiple`, {
                users: userIds,
                event_id: eventId,
            });
            if (res) {
                showSnackbar({ message: "Users registered successfully!", type: "success" });
                handleClose();
            }
        } catch (err) {
            console.error("Registration error:", err);
            showSnackbar({ message: "Error registering users.", type: "error" });
        }
    };

    const handleClose = () => {
        setSelectedUsers([]);
        setSearch("");
        setUsers([]);
        onClose();
    };

    const isRegistered = (user) => user?.is_registered;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            width="xl"
            fullScreen

            sx={{
                "& .MuiDialog-paper": {

                    boxShadow: 6,

                },
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: "white",
                    backgroundColor: "#005b9f",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 4,
                    py: 2,
                }}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    🧑‍🤝‍🧑 Register Users for Event #{eventId}
                </Box>
                <IconButton onClick={handleClose} sx={{ color: "white" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    bgcolor: "#f0f4f8",

                    p: 3,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3,
                    height: { xs: "auto", md: "70vh" },
                }}
            >
                {/* Left: Search & User List */}
                <Box sx={{ flex: 1, display: "flex", marginTop: 2, flexDirection: "column" }}>
                    {/* Search Form */}
                    <form onSubmit={handleSearch}>
                        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                            <TextField
                                label="Search by Name or ID"
                                size="small"
                                variant="outlined"
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="e.g. John Doe or 12345"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    flexGrow: 1,
                                    maxWidth: { xs: "100%", sm: 400 },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 8,
                                    },
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                sx={{ borderRadius: 8, minWidth: 100 }}
                            >
                                {loading ? "Searching..." : "Search"}
                            </Button>
                        </Box>
                    </form>

                    {/* User List */}
                    <Paper
                        sx={{
                            borderRadius: 3,
                            boxShadow: 2,

                            maxHeight: "100vh", // Adjust based on screen height
                            overflowY: "auto", // Enables vertical scrolling
                            border: "1px solid #e0e0e0",
                            bgcolor: "background.paper",
                        }}
                    >
                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                                <CircularProgress color="primary" />
                            </Box>
                        ) : users.length === 0 ? (
                            <Box textAlign="center" py={6}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    🔍 No users found
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Try searching with a name or ID.
                                </Typography>
                            </Box>
                        ) : (
                            <List disablePadding>
                                {users.map((user) => (
                                    <React.Fragment key={user.id}>
                                        <ListItem
                                            sx={{
                                                overflow: "auto",
                                                px: 3,
                                                py: 1.5,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                borderBottom: "1px solid #f0f0f0",
                                                bgcolor: "background.paper",
                                                opacity: isRegistered(user) ? 0.7 : 1,
                                                pointerEvents: isRegistered(user) ? "none" : "auto",
                                                "&:hover": {
                                                    bgcolor: isRegistered(user) ? "background.paper" : "action.hover",
                                                },
                                            }}
                                        >
                                            {/* Avatar */}
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: isRegistered(user) ? "success.main" : "primary.main",
                                                        width: 52,
                                                        height: 52,
                                                    }}
                                                >
                                                    {user.details?.first_name?.[0]?.toUpperCase() || <PersonIcon />}
                                                </Avatar>
                                            </ListItemAvatar>

                                            {/* User Info */}
                                            <ListItemText

                                                primary={
                                                    <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                                                        {user.details?.first_name || "Unknown"} {user.details?.last_name || ""}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box component="div" sx={{ mt: 0.5 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            📱 {user.details?.phone_number || "No Number"} • 🚻 {user.details?.sex?.name || "N/A"}
                                                        </Typography>
                                                        <Typography variant="body2" color={isRegistered(user) ? "success.main" : "error.main"}>
                                                            {isRegistered(user) ? "✅ Already Registered" : " Not Registered"}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />

                                            {/* Checkbox or Chip */}
                                            {isRegistered(user) ? (
                                                <Chip
                                                    icon={<CheckCircleIcon fontSize="small" />}
                                                    label="Registered"
                                                    color="success"
                                                    size="small"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            ) : (
                                                <Checkbox
                                                    edge="end"
                                                    checked={selectedUsers.some((u) => u.id === user.id)}
                                                    onChange={() => toggleSelect(user)}
                                                    color="primary"
                                                />
                                            )}
                                        </ListItem>
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Box>

                {/* Right: Selected Users */}
                <Box
                    sx={{
                        width: { xs: "100%", md: "45%" },
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "auto", // Enables vertical scrolling
                        border: "1px solid #e0e0e0", 
                        maxHeight: "100vh",
                        padding: 1,

                    }}
                    
                >
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        color="primary"
                        mb={2}
                        display="flex"
                        alignItems="center"
                        gap={1}
                    >
                        ✅ Selected ({selectedUsers.length})
                    </Typography>

                    {selectedUsers.length === 0 ? (
                        <Box
                            textAlign="center"
                            py={6}
                            sx={{
                                border: "2px dashed #e0e0e0",
                                borderRadius: 3,
                                bgcolor: "#f9f9f9",
                                flexGrow: 1,
                                
                            }}
                        >
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                🧩 No users selected
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Choose users from the list to register.
                            </Typography>
                        </Box>
                    ) : (
                        <Paper
                            sx={{
                                borderRadius: 3,
                                boxShadow: 2,
                                overflow: "auto",
                                flexGrow: 1,
                                padding:2,
                                bgcolor: "#f8fdff",
                                border: "1px solid #e3f2fd",
                            }}
                        >
                            <List disablePadding>
                                {selectedUsers.map((user) => (
                                    <ListItem
                                        key={user.id}
                                        sx={{
                                            px: 2,
                                            py: 1.5,
                                            mb: 1,
                                            mx: 1,
                                            borderRadius: 2,
                                            bgcolor: "white",
                                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                                            {user.details?.first_name?.[0]?.toUpperCase() || "U"}
                                        </Avatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {user.details?.first_name} {user.details?.last_name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box >
                                                      <Typography variant="body2" color="text.secondary">
                                                    {user.details?.sex?.name || "N/A"} • {user.email || "N/A"}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {user.details?.phone_number}
                                                </Typography>
                                                </Box>
                                            }
                                        />
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => toggleSelect(user)}
                                            sx={{ ml: "auto" }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>
            </DialogContent>

            {/* Actions */}
            <DialogActions
                sx={{

                    borderTop: "1px solid #e0e0e0",
                    justifyContent: "flex-end",
                    gap: 1,
                }}
            >
                <Button
                    onClick={handleClose}
                    color="error"
                    startIcon={<CloseIcon />}
                    variant="outlined"
                    sx={{ borderRadius: 8, textTransform: "none" }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleRegister}
                    variant="contained"
                    color="success"
                    disabled={selectedUsers.length === 0}
                    sx={{
                        borderRadius: 8,
                        fontWeight: 600,
                        textTransform: "none",
                        px: 3,
                    }}
                >
                    🚀 Register ({selectedUsers.length})
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RegisterUserSelectorModal;