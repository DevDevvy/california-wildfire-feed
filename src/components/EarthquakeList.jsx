import { useState, useEffect } from "react";

const EarthquakeComponent = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/earthquakes/feed/v1.0/summary/all_hour.geojson"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEarthquakes(data.features);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000); // Fetch data every 30 seconds

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
