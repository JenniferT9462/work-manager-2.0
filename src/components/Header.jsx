// Weather Widget: Current temp and icon (via OpenWeatherMap API).

//Daily Greeting: "You have 3 sessions today. You've earned $450 so far this month."

// const weather = {
//   name: "Sunny",
//   temp: 51,
//   icon: sunnyIcon
// };

function Header({ session, user, logs, weatherData }) {
  if (!session?.user) return;

  let currentEarnings = logs.reduce((total, log) => total + log.earned, 0);

  function getWeatherCodeName(code) {
    //Found codes on the weather api docs
    const weathercodes = {
      0: "sunny",
      1: "partly-cloudy",
      2: "partly-cloudy",
      3: "overcast",
      45: "fog",
      48: "fog",
      51: "drizzle",
      53: "drizzle",
      55: "drizzle",
      56: "drizzle",
      57: "drizzle",
      61: "rain",
      63: "rain",
      65: "rain",
      66: "rain",
      67: "rain",
      71: "snow",
      73: "snow",
      75: "snow",
      77: "snow",
      80: "rain",
      81: "rain",
      82: "rain",
      85: "snow",
      86: "snow",
      95: "storm",
      96: "storm",
      99: "storm",
    };
    return weathercodes[code];
  }
  if (!weatherData) {
  return <header>Loading weather...</header>;
}
  return (
    <div style={headerStyle}>
      <div>
        <h2>Good Morning! - {user}</h2>
        <p>
          You've earned <strong>${currentEarnings.toFixed(2)}</strong> so far
          this month.
        </p>
      </div>

      {weatherData && (
        <div style={{ display: "flex", gap: "15px" }}>
          <img
            src={`/src/assets/${getWeatherCodeName(weatherData.current.weather_code)}.png`}
            alt="weather"
            height={40}
            width={40}
          />
          <p>
            {Math.round(weatherData.current.temperature_2m)}°F -{" "}
            {getWeatherCodeName(weatherData.current.weather_code)}
          </p>
        </div>
      )}
    </div>
  );
}

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
  backgroundColor: "#fff",
  borderRadius: "15px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

export default Header;
