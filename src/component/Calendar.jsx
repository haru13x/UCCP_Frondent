import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';

const Calendar = ({ events = [], onDateClick, selectedDate, onMonthChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date
  


  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigate months
  const goToPreviousMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    setCurrentDate(newDate);
    if (onMonthChange) {
      onMonthChange(newDate);
    }
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    setCurrentDate(newDate);
    if (onMonthChange) {
      onMonthChange(newDate);
    }
  };

  // Check if a date has events
  const hasEvents = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    

    
    return events.some(event => {
      const eventDate = event.start_date || event.date;
      const matches = eventDate === dateStr;
      

      
      return matches;
    });
  };

  // Get events count for a specific date
  const getEventsCount = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => {
      const eventDate = event.start_date || event.date;
      return eventDate === dateStr;
    }).length;
  };

  // Check if date is today
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Check if date is selected
  const isSelected = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return selectedDate === dateStr;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(
        <Box
          key={`empty-${i}`}
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasEvent = hasEvents(day);
      const eventsCount = getEventsCount(day);
      const todayFlag = isToday(day);
      const selectedFlag = isSelected(day);

      days.push(
        <Box
          key={day}
          onClick={() => {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (onDateClick) {
              onDateClick(dateStr);
            }
          }}
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderRadius: '50%',
            cursor: 'pointer',
            backgroundColor: todayFlag ? 'primary.main' : 
                           selectedFlag ? 'primary.light' : 'transparent',
            color: todayFlag ? 'white' : 
                   selectedFlag ? 'primary.main' : 'text.primary',
            '&:hover': {
              backgroundColor: todayFlag ? 'primary.dark' : 'action.hover',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: todayFlag ? 'bold' : 'normal',
              fontSize: '14px',
            }}
          >
            {day}
          </Typography>
          {hasEvent && (
            <Box
              onClick={(e) => {
                e.stopPropagation();
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                if (onDateClick) {
                  onDateClick(dateStr);
                }
              }}
              sx={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: eventsCount > 1 ? 16 : 8,
                height: eventsCount > 1 ? 16 : 8,
                borderRadius: '50%',
                backgroundColor: todayFlag ? 'white' : 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: todayFlag ? '1px solid' : 'none',
                borderColor: todayFlag ? 'primary.main' : 'transparent',
                '&:hover': {
                  transform: 'scale(1.2)',
                  boxShadow: 2,
                },
                transition: 'all 0.2s ease',
                zIndex: 2,
              }}
            >
              {eventsCount > 1 && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: todayFlag ? 'primary.main' : 'white',
                    lineHeight: 1,
                  }}
                >
                  {eventsCount > 9 ? '9+' : eventsCount}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      );
    }

    return days;
  };

  if (isMobile) {
    return null; // Hide calendar on mobile
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        width: 320,
        backgroundColor: 'background.paper',
        borderRadius: 2,
      }}
    >
      {/* Calendar Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <IconButton
          onClick={goToPreviousMonth}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <ChevronLeft />
        </IconButton>
        
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            textAlign: 'center',
            minWidth: 180,
          }}
        >
          {monthNames[currentMonth]} {currentYear}
        </Typography>
        
        <IconButton
          onClick={goToNextMonth}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Day Names Header */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        gap={0.5}
        mb={1}
      >
        {dayNames.map((dayName) => (
          <Box
            key={dayName}
            sx={{
              width: 40,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 'bold',
                color: 'text.secondary',
                fontSize: '12px',
              }}
            >
              {dayName}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        gap={0.5}
      >
        {generateCalendarDays()}
      </Box>

      {/* Legend */}
      <Box mt={2} pt={2} borderTop={1} borderColor="divider">
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Has Events
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Calendar;