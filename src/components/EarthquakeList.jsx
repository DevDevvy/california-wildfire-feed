import { useState, useEffect } from "react";
import { fetchEarthquakes } from "../api/data";

const EarthquakeComponent = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEarthquakeData = async () => {
      try {
        const data = await fetchEarthquakes();
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
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Recent Earthquakes</h2>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Magnitude</th>
            <th>Location</th>
            <th>Time</th>
            <th>Depth (km)</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {earthquakes.map((quake) => (
            <tr key={quake.id}>
              <td>{quake.properties.mag}</td>
              <td>{quake.properties.place}</td>
              <td>{new Date(quake.properties.time).toLocaleString()}</td>
              <td>{quake.geometry.coordinates[2]}</td>
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
