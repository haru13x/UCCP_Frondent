// src/components/SnackbarContext.jsx
import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        type: "success", // success | error | warning | info
    });

    const showSnackbar = ({ message, type = "success" }) => {
        setSnackbar({
            open: true,
            message,
            type,
        });
    };

    const handleClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }} // ✅ Right side
                sx={{
                    maxWidth: "100%",
                    marginTop: '10vh' // Allow full width
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbar.type}
                    sx={{
                        width: "400px", // ✅ Make it wider
                        boxShadow: 6,

                        fontSize: "1.1rem",
                    }}
                    elevation={6}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </SnackbarContext.Provider>
    );
};
