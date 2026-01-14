import { useState } from "react";
import leftArrow from '../../assets/left.png';
import rightArrow from '../../assets/right.png';

function MiniCalendar({ meetings, schedule }) {
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
  const [viewDate, setViewDate] = useState(new Date());
  const [isHover, setIsHover] = useState(false);


  // Mon Dec 29 2025 23:46:10 GMT-0600
  // const today = new Date();

  // We need useEffect to prevent refire
  // useEffect(() => {
  //   // Mon Dec 29 2025 23:46:10 GMT-0600 (Central Standard Time)
  //   const today = new Date();
  //   console.log(today);
  // },[]);

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();

  // Arrow key functions for calendar nav
  const handlePreMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // ===
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  // Check which days has meetings or work?
  const hasLog = (day) => {
    // 2025-12-29 - get the right date format
    const dateStr = `${viewDate.getFullYear()}-${String(
      viewDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // Loops through the meetings data and checks each date...
    // compares it to the current date (dateStr)
    const hasMeeting = meetings.some((m) => m.date === dateStr);
    // Loops through the schedule data and checks each date & start time...
    // compares it to the current date.
    const hasWork = schedule.some((s) => {
      const itemDate = s.date || s.start_time || s.startTime;
      return itemDate && itemDate.toString().startsWith(dateStr);
    });

    return { hasMeeting, hasWork };
  };

  // TODO: Understand This!!
  // Add blanks to the days for unused grids.
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);



  // Check if hovered, use the style variable to pass in the style attribute
  const style = isHover ? { ...calendarNavStyle, ...hoverStyle } : calendarNavStyle;

  
  return (
    <div style={calendarCard}>
      {/* Current month name and nav */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <span onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} onClick={handlePreMonth} style={style}><img src={leftArrow} style={{ width: "22px"}}/></span>
        <h3 style={{ color: "var(--color-bg)" }}>
          {viewDate.toLocaleString("default", { month: "long" })}
        </h3>
        <span onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} onClick={handleNextMonth} style={style}><img src={rightArrow} style={{ width: "22px"}}/></span>
      </div>


      {/* Render the days of the week */}
      <div style={gridStyle}>
        {dayLabels.map((label, index) => (
          <div key={`label-${index}`} style={labelStyle}>
            {label}
          </div>
        ))}

        {/* TODO: Understand This!! */}
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} style={{ ...dayStyle, border: "none" }} />
        ))}
        {daysArray.map((day) => {
          const { hasMeeting, hasWork } = hasLog(day);
          const realToday = new Date();
          const isToday =
            day === realToday.getDate() &&
            month === realToday.getMonth() &&
            year === realToday.getFullYear();
          return (
            <div
              key={day}
              style={{
                ...dayStyle,
                border: isToday
                  ? "3px solid var(--color-text-primary)"
                  : "1px solid var(--color-accent)",
                backgroundColor: isToday ? "var(--color-bg)" : "transparent",
                flexDirection: "column", // Stack number over dots
                position: "relative",
              }}
            >
              <span
                style={{
                  fontWeight:
                    isToday || hasMeeting || hasWork ? "bold" : "normal",
                  color: isToday ? "#007bff" : "var(--color-text-secondary)",
                }}
              >
                {day}
              </span>
              {/* Dots - yellow = live class blue = sessions */}
              <div style={dotContainerStyle}>
                {hasMeeting && (
                  <div style={{ ...dotStyle, backgroundColor: "#007bff" }} />
                )}
                {hasWork && (
                  <div style={{ ...dotStyle, backgroundColor: "#ffc107" }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Styles
const labelStyle = {
  textAlign: "center",
  fontSize: "0.7rem",
  fontWeight: "bold",
  color: "#888",
  paddingBottom: "5px",
  textTransform: "uppercase",
};
const dayStyle = {
  aspectRatio: "1 / 1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.8rem",
  borderRadius: "8px", 
  cursor: "default",
  border: "1px solid var(--color-accent)",
  color: "var(--color-text-secondary)",
};

const dotContainerStyle = {
  display: "flex",
  gap: "2px",
  marginTop: "2px", // Space between number and dots
  height: "4px", // Reserves space even if no dots are there
};

const dotStyle = {
  width: "4px",
  height: "4px",
  borderRadius: "50%",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "4px",
};

const calendarCard = {
  background: "var(--color-bg-secondary)",
  padding: "12px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  width: "360px",
};
const calendarNavStyle = {
  cursor: "pointer",
  padding: "4px",
  borderRadius: "50%",
 
}
const hoverStyle = {
   boxShadow: "0 8px 16px rgba(0,0,0,0.20)"
}

export default MiniCalendar;
