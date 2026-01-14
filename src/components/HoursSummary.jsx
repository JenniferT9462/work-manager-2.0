import SummaryCard from "./SummaryCard";

export default function HoursSummary({ session, logs, archivedLogs = [] }) {
  if (!session?.user) return;

  const calculateTotals = (data) => {
    const totals = {
      totalEarned: 0,
      totalTime: 0,
      // Track hours
      totalLiveClass: 0,
      totalMentoring: 0,
      totalMeetings: 0,
      officeHours: 0,

      // Track earnings
      earnedMeetings: 0,
      earnedMentoring: 0,
      earnedClass: 0,
      earnedOfficeHours: 0,
    };

    data.forEach((log) => {
      const minToHours = parseFloat(log.duration) / 60;
      const logEarnings = parseFloat(minToHours) * log.rate;

      totals.totalEarned += logEarnings;
      totals.totalTime += log.duration;

      //Check the type of each log
      // Add to the hours and earnings state
      if (log.type === "Live Class") {
        totals.totalLiveClass += log.duration;
        totals.earnedClass += logEarnings;
      } else if (log.type === "Mentoring") {
        totals.totalMentoring += log.duration;
        totals.earnedMentoring += logEarnings;
      } else if (log.type === "Office Hours") {
        totals.officeHours += log.duration;
        totals.earnedOfficeHours += log.rate;
      } else {
        totals.totalMeetings += log.duration;
        totals.earnedMeetings += logEarnings;
      }
    });
    return totals;
  };

  const current = calculateTotals(logs);
  const previous = calculateTotals(archivedLogs);

  // Get month name to be able to change according
  // to the current month in the earnings summary section.
  const today = new Date();
  const currentMonthName= today.toLocaleString("default", { month: "long" });

  // Get the name of the previous month
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(today.getMonth() - 1);
  const previousMonthName = lastMonthDate.toLocaleString("default", {
    month: "long",
  });

  // TODO: Archive old entries

  // TODO: Render Archive Months

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {/* Current Month */}
      <SummaryCard title={`${currentMonthName} (Current)`} data={current} logCount={logs.length}/>

      {/* Previous Month  */}
      <SummaryCard title={`${previousMonthName} (Achieved)`} data={previous} logCount={archivedLogs.length}/>
    </div>
  );
}


