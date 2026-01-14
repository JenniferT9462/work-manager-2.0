import LogHoursForm from "../components/LogHoursForm";
import HoursSummary from "../components/HoursSummary";
import { supabase } from "../components/services/supabaseClient";
import { useState, useEffect, useCallback } from "react";
import LogList from "../components/LogList";
import QuickActions from "../components/dashboard/QuickActions";

export default function TimeLogs({ session }) {
  // connect real data from Supabase to the summary section.

  const [logs, setLogs] = useState([]);
  const [archivedLogs, setArchivedLogs] = useState([]);

  const fetchLogs = useCallback(async () => {
    // Prevent redirect error
    const userId = session?.user?.id;
    if (!userId) return;
    //Fetch current logs
    const { data: currentData, error: currentError } = await supabase
      .from("logged-hours")
      .select("*")
      .eq("user_id", session.user.id)
      .order("date", { ascending: true });
    // if (error) {
    //   console.error("Error Fetching Logs: ", error);
    // } else {
    //
    // }

    // Fetch Archived logs
    const { data: archiveData, error: archiveError } = await supabase
      .from("logged-hours-archive")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (currentError)
      console.error("Error Fetching Active Logs: ", currentError);
    if (archiveError)
      console.error("Error Fetching Archived Logs: ", archiveError);
    setLogs(currentData || []);
    setArchivedLogs(archiveData || []);
  }, [session]);

  // To make the squiggles vanish, use the useCallback
  //  hook.This "freezes" the function so it doesn't
  //  change unless the session changes.
  //   TODO: Fix!!!
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "50px",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Time Tracker</h1>
        {/* <QuickActions /> */}
      </div>

      <div
        style={{ display: "flex", justifyContent: "space-around", gap: "24px" }}
      >
        <LogHoursForm session={session} onLogAdded={fetchLogs} />
        <HoursSummary session={session} logs={logs} archivedLogs={archivedLogs} />
      </div>
      <LogList session={session} logs={logs} />
    </div>
  );
}
