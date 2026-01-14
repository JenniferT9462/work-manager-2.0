import { useState, useEffect } from "react";

export default function GetMeetings() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzY2OTc2OTU2LCJqdGkiOiJlZGE5OTU3Ny04OTE5LTRlNDEtOGZiNS05NjZhMmUzOWE2MGEiLCJ1c2VyX3V1aWQiOiI4NDQxOGMxMy1mM2ViLTQ0ZjEtODBlNi1mOWYzODgxMTBjNjYifQ.27D1y6sfQ9se4QqrJWSgsGQjWnqvYY__BNurEwDoyqd8GcmiZHeDuB2J61uXp-v3nKH_gsyCLYoSWAFAn-YFwg"
      );
      myHeaders.append(
        "Cookie",
        "__cf_bm=fRm1.psLqZpINjPk7fHjyKEs3ZSRZfZmQUwc5.RcBnI-1766978181-1.0.1.1-Tr6anqlN20Ru1cJqeHjVm2Qo5sH.bfis3xMLjXDn78fA54LmpgX62agGccxMPApXy4MAtYse_Sojqi_90p5iWrdo16xgvJa2huHBNNl_1cY; _cfuvid=_hZxVSoNblviSzTkRV5MyRIvapgBepSmhdD.8gKdXDc-1766977225424-0.0.1.1-604800000"
      );

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      let response = await fetch(
        "https://api.calendly.com/scheduled_events?user=https://api.calendly.com/users/84418c13-f3eb-44f1-80e6-f9f388110c66&sort=start_time:desc",
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
