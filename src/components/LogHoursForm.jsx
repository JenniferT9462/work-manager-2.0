import { supabase } from "./services/supabaseClient";
import { useState } from "react";

export default function LogHoursForm({ session, onLogAdded }) {
  const [type, setType] = useState("Mentoring");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [rate, setRate] = useState(18);
  const [flatRate, setFlatRate] = useState(60);

  async function handleLogTime(e) {
    e.preventDefault();

    if (!session?.user?.id) {
      alert("You must be logged in to save hours.");
      return;
    }

    const minToHours = parseFloat(duration) / 60;
    console.log(minToHours);

    let totalEarned;
    let payload;

    if (type === "Office Hours") {
      totalEarned = flatRate;
      payload = {
        date: date,
        type: type,
        duration: 0,
        rate: flatRate,
        earned: totalEarned,
        user_id: session.user.id,
      };
    } else {
      totalEarned = parseFloat(minToHours) * parseFloat(rate);
      payload = {
        date: date,
        type: type,
        duration: parseFloat(duration),
        rate: parseFloat(rate),
        earned: totalEarned,
        user_id: session.user.id,
      };
    }

    const { error } = await supabase.from("logged-hours").insert([payload]);
    console.log("Final Payload being sent:", payload);

    if (error) {
      console.error("Supabase Error Details:", error.message, error.hint);
      alert("Error: " + error.message);
    } else {
      alert("Success!");
      setDuration("");
      if (onLogAdded) onLogAdded();
    }
  }
  return (
    <form onSubmit={handleLogTime} style={formStyle}>
      <h3>Time Logger</h3>

      <label>Date</label>
      <input
        style={inputStyle}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <label>Type of work</label>
      <select
        style={inputStyle}
        name="type"
        id="type"
        onChange={(e) => setType(e.target.value)}
      >
        <option value="Mentoring">Mentoring</option>
        <option value="Live Class">Live Class</option>
        <option value="Meeting">Meeting</option>
        <option value="Office Hours">Office Hours</option>
      </select>

      <label>Minutes</label>
      <input
        style={inputStyle}
        type="number"
        step="0.5"
        placeholder="0.0"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <label>Flat Rate: </label>
      <input
        type="number"
        value={flatRate}
        onChange={(e) => setFlatRate(e.target.value)}
        style={inputStyle}
      />

      <label>Hourly Rate</label>
      <input
        style={inputStyle}
        type="number"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />

      <button style={buttonStyle} type="submit">
        Save Log
      </button>
    </form>
  );
}
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
  border: "none",
};

const buttonStyle = {
  backgroundColor: "var(--color-bg-secondary)",
  color: "var(--color-text-primary)",
  marginTop: "10px",
  borderRadius: "4px",
  padding: "8px",
  border: "none",
};
