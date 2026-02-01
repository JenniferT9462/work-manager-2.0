import { supabase } from "../components/services/supabaseClient";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import MiniCalendar from "../components/dashboard/MiniCalendar";
import TodaysAgenda from "../components/dashboard/TodaysAgenda";
import QuickActions from "../components/dashboard/QuickActions";
import WorkHoursForm from "../components/WorkHoursForm";
import LogHoursForm from "../components/LogHoursForm";
import UploadImage from "../components/UploadImage";
import TimeLogs from "./TimeLogs";
import Meetings from "./Meetings";
import { Routes, Route } from "react-router-dom";
import Schedule from "./Schedule";
import { syncSessions } from "../components/services/CalendlyService";

export default function Dashboard({ session }) {
  const [meetings, setMeetings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [logs, setLogs] = useState([]);
  const [weather, setWeather] = useState(null);
  const [calendlySessions, setCalendlySessions] = useState([]);

  // Directly fetch to Calendly first
  const fetchCalendlyDirect = async () => {
    try {
      const token = import.meta.env.VITE_CALENDLY_ACCESS_TOKEN;
      const info = new Date();
      info.setHours(0, 0, 0, 0);
      const minTime = info.toISOString();

      const response = await fetch(
        `https://api.calendly.com/scheduled_events?user=${encodeURIComponent(
          import.meta.env.VITE_CALENDLY_URI,
        )}&min_start_time=${minTime}&status=active&sort=start_time:asc`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const json = await response.json();
      console.log(json);
      if (json.collection) {
        setCalendlySessions(json.collection);
        return json.collection; // Return it so we can sync it if needed
      }
    } catch (err) {
      console.error("Calendly Fetch Error:", err);
    }
  };

  const handleSync = async () => {
    // Pull fresh data from Calendly and update UI state immediately
    const freshData = await fetchCalendlyDirect();

    if (freshData) {
      // Sync to Supabase just for backup/logging
      await syncSessions(freshData);
      alert("Synced with Calendly!");
    }
  };

  // Get meetings and work schedule from supabase and store in their states
  useEffect(() => {
    if (!session?.user.id || weather) return;
    // Load everything once when the component mounts or user changes
    const loadData = async () => {
      // Fetch Schedule
      const { data: scheduleData } = await supabase
        .from("work-schedule")
        .select("*")
        .eq("user_id", session.user.id)
        .order("startTime", { ascending: true });
      setSchedule(scheduleData || []);


      // Fetch Logs
      const { data: logsData } = await supabase
        .from("logged-hours")
        .select("*")
        .eq("user_id", session.user.id);
      setLogs(logsData || []);

      //Fetch Calendly directly not supabase mock data
      fetchCalendlyDirect();



      // Fetch Weather (only if we don't have it yet to avoid loops)
      if (!weather) {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=30.464063&longitude=-91.18879&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code,apparent_temperature&current=temperature_2m,relative_humidity_2m,weather_code&timezone=America%2FChicago&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch",
        );
        const weatherData = await res.json();
        setWeather(weatherData);
      }
    };


    loadData();

  
  }, [session?.user?.id]); // session dependency to prevent un-logged in users.



  return (
    <div>
      <Header
        session={session}
        user={session?.user?.email}
        logs={logs}
        weatherData={weather}
      />
      <QuickActions />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div style={calendarAgendaStyle}>
                <button onClick={handleSync}>Sync Calendly</button>
                <MiniCalendar
                  meetings={meetings}
                  schedule={schedule}
                  calendlySessions={calendlySessions}
                />
                <TodaysAgenda meetings={calendlySessions} schedule={schedule} />
              </div>
              <div style={calendarAgendaStyle}>
                <WorkHoursForm session={session} />
                <LogHoursForm session={session} />
              </div>

              <UploadImage session={session} />
            </>
          }
        />
        <Route path="/timeLogs" element={<TimeLogs session={session} />} />
        <Route path="/meetings" element={<Meetings session={session} />} />
        <Route path="/schedule" element={<Schedule session={session} />} />
        {/* route for 404 pages */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  );
}

// Styles

const calendarAgendaStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
};
