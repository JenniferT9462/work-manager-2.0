import { supabase } from "./services/supabaseClient";
import { useState } from "react";

export default function WorkHoursForm({ session, onLogWork }) {
    
  //startTime, endTime, date, user_id, isActive
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  // const [isActive, setIsActive] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  async function handleWorkSchedule(e) {
    e.preventDefault();

   

    const payload = {
        date: date,
        startTime: startTime,
        endTime: endTime,
        isActive: true,
        user_id: session.user.id,
    }

    const { error } = await supabase.from('work-schedule').insert([payload]);
    if (error) {
      console.error("Supabase Error Details:", error.message, error.hint);
      alert("Error: " + error.message);
    } else {
      alert("Success!");
    
      if(onLogWork)
        onLogWork();
    }
  }

  return (
    <form onSubmit={handleWorkSchedule} style={formStyle}>
      <h3>Work Schedule</h3>
      <label htmlFor="date">Date</label>
      <input
        style={inputStyle}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <label htmlFor="startTime">Start Time: </label>
      <input
        style={inputStyle}
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      <label htmlFor="endTime">End Time</label>
      <input
        style={inputStyle}
        type="time"
        name="endTime"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />

      <button type="submit" style={buttonStyle}>Schedule</button>
    </form>
  );
}

//Styles
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "360px",
  padding: "20px",
  border: "4px solid var(--color-accent)",
  borderRadius: "8px",
  marginTop: "50px",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "4px",
  color: "var(--color-text-secondary)",
  border: "none"
}

const buttonStyle = {
  backgroundColor: "var(--color-bg-secondary)",
  color: "var(--color-text-primary)",
  marginTop: "10px",
  borderRadius: "4px",
  padding: "8px",
  border: "none"

}

