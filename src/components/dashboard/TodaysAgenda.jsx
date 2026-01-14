function TodaysAgenda({ meetings, schedule }) {
  // For the Today's Agenda Section
  const now = new Date();
  const todaysStr = now.toLocaleDateString('en-CA');


  //Filter meetings and schedule
  const todaysMeetings = meetings.filter(m => m.date === todaysStr);
  const todaysWork = schedule.filter(s => {
    const itemDate = s.date || s.startTime || s.start_time;
    return itemDate?.toString().startsWith(todaysStr);
  });

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Today's Agenda</h2>

      {/* Work Section */}
      <div style={sectionStyle}>
        <p style={labelStyle}>Work Hours</p>
        {todaysWork.length > 0 ? (
          todaysWork.map((work, i) => (
            <div key={i} style={workBadgeStyle}>
              {work.startTime?.slice(0, 5)} - {work.endTime?.slice(0, 5)}
            </div>
          ))
        ) : (
          <p style={emptyStyle}>Off! No Work!</p>
        )}
      </div>

      {/* Sessions/Meetings Section */}
      <div style={sectionStyle}>
        <p style={labelStyle}>Sessions</p>
        {todaysMeetings.length > 0 ? (
          todaysMeetings.map((meet, i) => (
            <div key={i} style={sessionRowStyle}>
              <span style={timeStyle}>{meet.startTime?.slice(0, 5)}</span>
              <span style={studentStyle}>{meet.student}</span>
            </div>
          ))
        ) : (
          <p style={emptyStyle}>No Sessions today</p>
        )}
      </div>
    </div>
  );
}

// Styles
const cardStyle = {
  background: "var(--color-bg-secondary)",
  padding: "20px",
  borderRadius: "16px",
  width: "360px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const titleStyle = {
  margin: "0 0 15px 0",
  fontSize: "1.1rem",
  color: "var(--color-bg)",
};

const sectionStyle = { marginBottom: "20px" };

const labelStyle = {
  fontSize: "0.75rem",
  textTransform: "uppercase",
  color: "#888",
  marginBottom: "8px",
};

const workBadgeStyle = {
  background: "#fff9e6", // Light yellow
  border: "1px solid #ffc107",
  padding: "8px",
  borderRadius: "8px",
  fontSize: "0.9rem",
  fontWeight: "bold",
};

const sessionRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
};

const timeStyle = { fontWeight: "bold", color: "#007bff" };
const studentStyle = { color: "var(--color-text-secondary)" };
const emptyStyle = { fontSize: "0.9rem", color: "#bbb", fontStyle: "italic" };

export default TodaysAgenda;
