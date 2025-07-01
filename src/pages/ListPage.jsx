import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Stack,
    Chip,
    Divider,
    Avatar,
    Card,
    CardContent,
    Skeleton,
} from "@mui/material";
import {
    Event as EventIcon,
    Groups as MeetingIcon,
    CalendarToday,
} from "@mui/icons-material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { UseMethod } from "../composables/UseMethod";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 2,
    },
    tablet: {
        breakpoint: { max: 1024, min: 640 },
        items: 1,
    },
    mobile: {
        breakpoint: { max: 640, min: 0 },
        items: 1,
    },
};

const ListPage = () => {
    const [loading, setLoading] = useState(true);
    const [todayCombined, setTodayCombined] = useState([]);
    const [upcomingCombined, setUpcomingCombined] = useState([]);

    const formatDateTime = (dateStr, timeStr) => {
        if (!dateStr || !timeStr) return "";
        const date = new Date(`${dateStr}T${timeStr}`);
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    };

    const fetchData = async () => {
        setLoading(true);
        const [todayE, upcomingE, todayM, upcomingM] = await Promise.all([
            UseMethod("get", "events/today"),
            UseMethod("get", "events/upcoming"),
            UseMethod("get", "meetings/today"),
            UseMethod("get", "meetings/upcoming"),
        ]);

        const mergedToday = [
            ...(todayE?.data || []).map((item) => ({ ...item, type: "event" })),
            ...(todayM?.data || []).map((item) => ({ ...item, type: "meeting" })),
        ];
        const mergedUpcoming = [
            ...(upcomingE?.data || []).map((item) => ({ ...item, type: "event" })),
            ...(upcomingM?.data || []).map((item) => ({ ...item, type: "meeting" })),
        ];

        setTodayCombined(mergedToday);
        setUpcomingCombined(mergedUpcoming);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderCard = (item) => {
        const isEvent = item.type === "event";
        const bgColor = isEvent ? "#e8f5e9" : "#e3f2fd";
        const iconColor = isEvent ? "#2e7d32" : "#1565c0";
        const icon = isEvent ? <EventIcon /> : <MeetingIcon />;
        const label = isEvent ? "Event" : "Meeting";

        return (
            <Card
                key={`${item.type}-${item.id}`}
                sx={{
                    backgroundColor: bgColor,
                    m: 1,
                    transition: "0.3s",
                    "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-4px)",
                    },
                }}
            >
                <Stack direction="row" spacing={2} p={2}>
                    <Avatar sx={{ bgcolor: iconColor }}>{icon}</Avatar>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h6">{item.title}</Typography>
                            <Chip
                                label={label}
                                size="small"
                                variant="outlined"
                                color={isEvent ? "success" : "primary"}
                            />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                            {isEvent
                                ? `${formatDateTime(item.start_date, item.start_time)} - ${formatDateTime(
                                    item.end_date,
                                    item.end_time
                                )}`
                                : `${item.start_date} - ${item.end_date}`}
                        </Typography>
                        {item.description && (
                            <Typography variant="body2" mt={1}>
                                {item.description}
                            </Typography>
                        )}
                    </CardContent>
                </Stack>
            </Card>
        );
    };

    const renderSkeletons = () =>
        [...Array(2)].map((_, i) => (
            <Card key={i} sx={{ m: 1, p: 2 }}>
                <Stack direction="row" spacing={2}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width="30%" />
                        <Skeleton variant="text" width="30%" />
                        <Skeleton variant="text" width="40%" />
                    </Box>
                </Stack>
            </Card>
        ));

    return (
        <Box p={3}>
            {/* Header and Legend */}
            {/* <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}> */}
            {/* <Typography variant="h4" fontWeight={700}>
          Events & Meetings
        </Typography> */}

            {/* </Stack> */}

            {/* Today Section */}
            <Box >

                <Typography variant="h5" fontWeight={600} mb={2}>
                    Today
                </Typography>
                {loading ? (
                    renderSkeletons()
                ) : todayCombined.length > 0 ? (
                    <Carousel responsive={responsive} infinite>
                        {todayCombined.map((item) => renderCard(item))}
                    </Carousel>
                ) : (
                    <Typography>No today items found.</Typography>
                )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Upcoming Section */}
            <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                    Upcoming
                </Typography>
                {loading ? (
                    renderSkeletons()
                ) : upcomingCombined.length > 0 ? (
                    <Box>
                        <Carousel responsive={responsive} infinite>
                            {upcomingCombined.map((item) => renderCard(item))}
                        </Carousel>
                    </Box>
                ) : (
                    <Typography>No upcoming items found.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default ListPage;
