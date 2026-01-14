export default function LogList({ session, logs }) {
  if (!session?.user) return;

  

  return (
    <div>
      <h2>Current Month Entries</h2>

      {logs.map((log, index) => (
      
        <div key={index} style={entriesStyle}>
          <h3>Date: {log.date}</h3>
          {/* Edge Case: check if duration is less than or equal to 1 */}
          <p>
            Time: {log.duration} mins{" "}
            | Pay Rate: ${log.rate}/hr
          </p>
          <h4>Pay: ${log.type === "Office Hours" ? log.rate.toFixed(2) : ((parseFloat(log.duration) / 60) * parseFloat(log.rate)).toFixed(2)} </h4>
        </div>
      ))}
    </div>
  );
}

const entriesStyle = {
  borderBottom: "solid 4px var(--color-accent)",
};
