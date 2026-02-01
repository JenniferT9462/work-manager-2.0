import { useState, useEffect } from "react";

export default function GetMeetings() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${import.meta.env.VITE_CALENDLY_ACCESS_TOKEN}`
      );
      

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      let response = await fetch(
        `https://api.calendly.com/scheduled_events?user=${import.meta.env.VITE_CALENDLY_URI}`,
        requestOptions
      );
      if (!response.ok) {
        if (response.status === 429) {
          console.error("Rate Limit Hit!");
          return;
        }
        throw new Error(`Error: ${response.status}`);
      }
      let data = await response.json();

      let sessionInfo = [];
      for (let i = 0; i < data.collection.length; i++) {
        const event = data.collection[i];

        let inviteeRes = await fetch(`${event.uri}/invitees`, requestOptions);

        if (inviteeRes.ok) {
          let inviteeData = await inviteeRes.json();
          sessionInfo.push({
            event: event,
            invitee: inviteeData.collection[0],
          });
        }
      }
      setSessions(sessionInfo);
      setIsLoading(false);
    }

    fetchSessions();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {sessions.map((item, index) => (
        <div
          key={index}
          style={{
            borderBottom: "1px solid var(--color-headings)",
            margin: "10px",
          }}
        >
          <h3>{item.event.name}</h3>
          <p>Person: {item.invitee?.name || "No one booked"}</p>
          <p>Time: {new Date(item.event.start_time).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
