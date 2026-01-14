// import { supabase } from "../components/services/supabaseClient";
// import { useState, useEffect } from "react";
import GetMeetings from "../components/services/GetMeetings";
import QuickActions from "../components/dashboard/QuickActions";
import { InlineWidget } from "react-calendly";
// Connect to Calendly

export default function Meetings({ session }) {
  if (!session?.user) return;
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "50px",
        }}
      >
        <h1>Meetings</h1>
        {/* <QuickActions /> */}
      </div>
      <div className="booking-container" style={{ width: "50%"}}>
        <h2>Book a Session</h2>
        <InlineWidget url="https://calendly.com/jennifer-tarleton-codex" />
      </div>

      <GetMeetings />
    </div>
  );
}
