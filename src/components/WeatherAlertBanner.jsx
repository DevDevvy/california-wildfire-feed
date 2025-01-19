import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import "./WeatherAlertBanner.css";
import { fetchWeatherAlerts } from "../api/data";

const WeatherAlertBanner = () => {
  const { userLocation } = useContext(UserContext);
  const [alertData, setAlertData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const latitude = userLocation?.latitude;
  const longitude = userLocation?.longitude;

  useEffect(() => {
    if (!latitude || !longitude) return; // Wait until location is available

    const getWeatherAlerts = async () => {
      try {
        const alerts = await fetchWeatherAlerts(latitude, longitude);
        setAlertData(alerts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getWeatherAlerts();
  }, [latitude, longitude]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Minor":
        return "#d1e7dd"; // Light green
      case "Moderate":
        return "#fff3cd"; // Light yellow
      case "Severe":
        return "#f8d7da"; // Light red
      case "Extreme":
        return "#f5c2c7"; // Darker red
      default:
        return "#f8f9fa"; // Light gray
    }
  };

  if (loading) return <div>Loading weather alerts...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!alertData || alertData.length === 0)
    return <div>No active weather alerts at your location.</div>;

  return (
    <div className="weather-alert-banner-container">
      {alertData.map((alert) => (
        <div
          className="weather-alert-banner"
          key={alert.id}
          style={{
            backgroundColor: getSeverityColor(alert.properties.severity),
          }}
        >
          <div className="weather-alert-header">
            <h4 className="weather-alert-headline">
              {alert.properties.headline}
            </h4>
            <p className="weather-alert-timing">
              <strong>Active:</strong>{" "}
              {new Date(alert.properties.effective).toLocaleString()}
              <br />
              <strong>Ends:</strong>{" "}
              {new Date(alert.properties.ends).toLocaleString()}
            </p>
          </div>
          <div className="weather-alert-details-button">
            <button onClick={() => setShowDetails((prev) => !prev)}>
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
          </div>
          {showDetails && (
            <div className="weather-alert-details">
              <p>
                <strong>Description:</strong> {alert.properties.description}
              </p>
              <p>
                <strong>Instructions:</strong> {alert.properties.instruction}
              </p>
              <p>
                <strong>Severity:</strong> {alert.properties.severity}
              </p>
              <p>
                <strong>Urgency:</strong> {alert.properties.urgency}
              </p>
              <p>
                <strong>Category:</strong> {alert.properties.category}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WeatherAlertBanner;
