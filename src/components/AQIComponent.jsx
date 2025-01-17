import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import "../App.css";
import { fetchAQI } from "../api/data";

const AQIComponent = () => {
  const { userLocation } = useContext(UserContext);
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    const getAQI = async () => {
      if (userLocation) {
        try {
          const { latitude, longitude } = userLocation;
          const data = await fetchAQI(latitude, longitude);
          setAqiData(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching AQI data:", error);
          setLoading(false);
        }
      }
    };

    getAQI();
  }, [userLocation, API_KEY]);

  const getColorForValue = (pollutant, value) => {
    const ranges = {
      AQI: [1, 2, 3, 4],
      SO2: [20, 80, 250, 350],
      NO2: [40, 70, 150, 200],
      PM10: [20, 50, 100, 200],
      PM2_5: [10, 25, 50, 75],
      O3: [60, 100, 140, 180],
      CO: [4400, 9400, 12400, 15400],
    };

    const thresholds = ranges[pollutant];
    if (!thresholds) return "#d3d3d3"; // Default if pollutant is missing

    if (value < thresholds[0]) return "#00e400"; // Good
    if (value < thresholds[1]) return "#ffff00"; // Fair
    if (value < thresholds[2]) return "#ff7e00"; // Moderate
    if (value < thresholds[3]) return "#ff0000"; // Poor
    return "#99004c"; // Very Poor
  };

  return (
    <div className="aqi-container">
      <h2>Air Quality Index (AQI)</h2>
      {loading ? (
        <p>Loading AQI data...</p>
      ) : aqiData && aqiData.list && aqiData.list.length > 0 ? (
        <>
          <div className="banner">
            <div
              className="pollutant"
              style={{
                color: getColorForValue("AQI", aqiData.list[0].main.aqi),
              }}
            >
              AQI: {aqiData.list[0].main.aqi}
            </div>
            {Object.entries(aqiData.list[0].components).map(([key, value]) => (
              <div
                key={key}
                className="pollutant"
                style={{
                  color: getColorForValue(key.toUpperCase(), value),
                }}
              >
                {key.toUpperCase()}: {value.toFixed(2)} µg/m³
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowTable(!showTable)}
            className="toggle-button"
          >
            {showTable ? "Hide Severity Table" : "Show AQI Severity Table"}
          </button>
          {showTable && (
            <div className="severity-table">
              <h4>Air Quality Severity Table</h4>
              <table>
                <thead>
                  <tr>
                    <th>Quality</th>
                    <th>Index</th>
                    <th>SO2 (Sulfur Dioxide)</th>
                    <th>NO2 (Nitrogen Dioxide)</th>
                    <th>PM10 (Particulate Matter ≤ 10 micrometers)</th>
                    <th>PM2.5 (Particulate Matter ≤ 2.5 micrometers)</th>
                    <th>O3 (Ozone)</th>
                    <th>CO (Carbon Monoxide)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Good</td>
                    <td>1</td>
                    <td>0-20</td>
                    <td>0-40</td>
                    <td>0-20</td>
                    <td>0-10</td>
                    <td>0-60</td>
                    <td>0-4400</td>
                  </tr>
                  <tr>
                    <td>Fair</td>
                    <td>2</td>
                    <td>20-80</td>
                    <td>40-70</td>
                    <td>20-50</td>
                    <td>10-25</td>
                    <td>60-100</td>
                    <td>4400-9400</td>
                  </tr>
                  <tr>
                    <td>Moderate</td>
                    <td>3</td>
                    <td>80-250</td>
                    <td>70-150</td>
                    <td>50-100</td>
                    <td>25-50</td>
                    <td>100-140</td>
                    <td>9400-12400</td>
                  </tr>
                  <tr>
                    <td>Poor</td>
                    <td>4</td>
                    <td>250-350</td>
                    <td>150-200</td>
                    <td>100-200</td>
                    <td>50-75</td>
                    <td>140-180</td>
                    <td>12400-15400</td>
                  </tr>
                  <tr>
                    <td>Very Poor</td>
                    <td>5</td>
                    <td>≥350</td>
                    <td>≥200</td>
                    <td>≥200</td>
                    <td>≥75</td>
                    <td>≥180</td>
                    <td>≥15400</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <p>No AQI data available.</p>
      )}
    </div>
  );
};

export default AQIComponent;
