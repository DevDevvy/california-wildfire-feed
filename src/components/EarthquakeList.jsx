import { useState, useEffect } from "react";
import { fetchEarthquakes } from "../api/data";

const EarthquakeComponent = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("all_hour"); // Default to one hour

  useEffect(() => {
    const getEarthquakeData = async () => {
      try {
        const data = await fetchEarthquakes(timeframe);
        setEarthquakes(data.features);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getEarthquakeData();
    const intervalId = setInterval(getEarthquakeData, 60000); // Fetch data every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [timeframe]);

  const getSeverityColor = (magnitude) => {
    if (magnitude < 3.0) return "#d4edda"; // Light green for minor quakes
    if (magnitude < 5.0) return "#fff3cd"; // Light yellow for light quakes
    if (magnitude < 7.0) return "#f8d7da"; // Light red for moderate quakes
    return "#f5c6cb"; // Dark red for strong quakes
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="earthquake-container">
      <h2>Recent Earthquakes (Global)</h2>
      <div className="timeframe-buttons">
        <button
          onClick={() => setTimeframe("all_hour")}
          disabled={timeframe === "all_hour"}
        >
          Last Hour
        </button>
        <button
          onClick={() => setTimeframe("all_day")}
          disabled={timeframe === "all_day"}
        >
          Last Day
        </button>
      </div>
      <table
        border="1"
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Magnitude</th>
            <th>Location</th>
            <th>Time</th>
            <th>Depth (km)</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody style={{ color: "#333" }}>
          {earthquakes.map((quake) => (
            <tr
              key={quake.id}
              style={{
                backgroundColor: getSeverityColor(quake.properties.mag),
              }}
            >
              <td>{quake.properties.mag}</td>
              <td>{quake.properties.place}</td>
              <td>{new Date(quake.properties.time).toLocaleString()}</td>
              <td>{quake.geometry.coordinates[2].toFixed(3)}</td>
              <td>
                <a
                  href={quake.properties.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  More Info
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EarthquakeComponent;
