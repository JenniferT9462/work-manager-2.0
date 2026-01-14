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

export default function Dashboard({ session }) {
  const [meetings, setMeetings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [logs, setLogs] = useState([]);
  const [weather, setWeather] = useState(null);

  // Get meetings and work schedule from supabase and store in their states
  useEffect(() => {
    if (!session?.user) return;
    async function fetchMeetings() {
      const { data, error } = await supabase
        .from("sessions-schedule")
        .select("*")
        .eq("user_id", session.user.id)
        .order("date", { ascending: false });
      if (error) {
        console.error("Error fetching logs:", error);
      } else {
        setMeetings(data);
      }
    }
    async function fetchSchedule() {
      const { data, error } = await supabase
        .from("work-schedule")
        .select("*")
        .eq("user_id", session.user.id)
        .order("startTime", { ascending: true });
      if (error) {
        console.error("Error fetching logs:", error);
      } else {
        setSchedule(data);
      }
    }

    async function fetchTotalPay() {
      const { data, error } = await supabase
        .from("logged-hours")
        .select("*")
        .eq("user_id", session.user.id)
        .order("date", { ascending: true });
      if (error) {
        console.error("Error Fetching Logs: ", error);
      } else {
        setLogs(data);
      }
    }

    async function fetchWeather() {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=30.464063&longitude=-91.18879&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code,apparent_temperature&current=temperature_2m,relative_humidity_2m,weather_code&timezone=America%2FChicago&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch"
      );
      const weatherData = await response.json();

      if (!response.ok) {
        console.error("Error Fetching Logs");
      } else {
        setWeather(weatherData);
        console.log(weatherData);
      }
    }

    // connect real data from Supabase to the summary section.

    fetchMeetings();
    fetchSchedule();
    fetchTotalPay();
    fetchWeather();
  }, [session]); // session dependency to prevent un-logged in users.

  //TODO: connect real data from Supabase to the summary section.

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
                <MiniCalendar meetings={meetings} schedule={schedule} />
                <TodaysAgenda meetings={meetings} schedule={schedule} />
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
