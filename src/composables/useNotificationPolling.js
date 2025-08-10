// src/composables/useNotificationPolling.js
import { useEffect } from "react";
import { UseMethod } from "./UseMethod"; // your helper
import { useSnackbar } from "../component/event/SnackbarProvider"; // assuming this is your snackbar hook

export default function useNotificationPolling() {
  const { showSnackbar } = useSnackbar(); // from your SnackbarProvider

  useEffect(() => {
    const fetchNotifications = async () => {
      const authToken = localStorage.getItem("api_token");
      if (!authToken) return; // only run if logged in

      const res = await UseMethod("get", "notifications/new"); // Laravel endpoint

      if (res?.data?.status && res.data.data?.length > 0) {
        res.data.data.forEach((notif) => {
          showSnackbar(`${notif.title}: ${notif.body}`, "info");
        });
      }
    };

    // Fetch immediately on mount
    fetchNotifications();

    // Poll every 1 minute
    const interval = setInterval(fetchNotifications, 60000);

    return () => clearInterval(interval);
  }, [showSnackbar]);
}
