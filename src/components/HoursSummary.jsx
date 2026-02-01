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
      const duration = parseFloat(log.duration) || 0;
      const rate = parseFloat(log.rate) || 0;

      const hourlyEarnings = (duration / 60) * rate;

      totals.totalTime += duration;

      // totals.totalEarned += logEarnings;
      // totals.totalTime += log.duration;

      //Check the type of each log
      // Add to the hours and earnings state
      if (log.type === "Live Class") {
        totals.totalLiveClass += duration;
        totals.earnedClass += hourlyEarnings;
      } else if (log.type === "Mentoring") {
        totals.totalMentoring += duration;
        totals.earnedMentoring += hourlyEarnings;
      } else if (log.type === "Office Hours") {
        totals.officeHours += 1;
        totals.earnedOfficeHours += rate;
      } else {
        totals.totalMeetings += duration;
        totals.earnedMeetings += hourlyEarnings;
      }
    });
    totals.totalEarned = totals.earnedClass + totals.earnedMentoring + totals.earnedOfficeHours + totals.earnedMeetings;
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


