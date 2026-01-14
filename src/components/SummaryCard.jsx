export default function SummaryCard({ title, data, logCount}) {
    return (
    <div style={summaryCard}>
      <h2>{title}</h2>

      <div style={logStyle}>
        <h3>
          Current <span style={monthStyle}> {data.month} </span> Totals
        </h3>
        <p>Total Logs: {logCount}</p>
        <p>Total Time: {data.totalTime} mins</p>
        <p>
          Total Earned:
          <span style={totalEarnedStyle}>${data.totalEarned.toFixed(2)}</span>
        </p>
      </div>
      <div style={logStyle}>
        <h4>By Work Type</h4>

        <p>
          Mentoring Time: {data.totalMentoring} mins (${data.earnedMentoring.toFixed(2)})
        </p>
        <p>
          Class Time: {data.totalLiveClass} mins (${data.earnedClass.toFixed(2)})
        </p>
        {/* Edge Case: Ternary for when the hours are 1 */}
        <p>
          Office Hours: {data.officeHours}
          <span>{data.officeHours <= 1 ? "wk" : "wks"} </span>($
          {data.earnedOfficeHours.toFixed(2)})
        </p>
        {/* Ternary for when there are no meetings */}
        <p>
          Meetings:
          {data.totalMeetings === 0 
            ? "No Meetings"
            : `${data.totalMeetings} mins ($${data.earnedMeetings.toFixed(2)})`}
        </p>
      </div>
    </div>
    )
}

// Styles
const summaryCard = {
  border: "4px solid var(--color-accent)",
  padding: "18px",
  width: "360px",
  borderRadius: "8px",
};

const logStyle = {
  borderBottom: "solid 4px var(--color-accent)",
};

const monthStyle = {
  color: "var(--color-text-secondary)",
  fontSize: "1.5rem",
  fontFamily: "Lora",
  fontWeight: "900",
};

const totalEarnedStyle = {
  fontWeight: "900",
  fontSize: "1.5rem",
  fontFamily: "Roboto",
  color: "var(--color-text-secondary)",
};