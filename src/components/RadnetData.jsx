import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchCaliforniaRadiationCSV } from "../api/data";

// Map user-friendly city labels to the exact strings required for the API
const CITY_ENDPOINTS = {
  Anaheim: "ANAHEIM",
  Bakersfield: "BAKERSFIELD",
  Eureka: "EUREKA",
  Fresno: "FRESNO",
  "Los Angeles": "LOS ANGELES",
  Riverside: "RIVERSIDE",
  Sacramento: "SACRAMENTO",
  "San Bernardino County": "SAN BERNARDINO",
  "San Diego": "SAN DIEGO",
  "San Francisco": "SAN FRANCISCO",
  "San Jose": "SAN JOSE",
};

// Define severity levels for color coding
function getSeverity(cpmValue) {
  if (cpmValue <= 2500) {
    return { level: "Good", color: "green" };
  } else if (cpmValue <= 3000) {
    return { level: "OK", color: "blue" };
  } else if (cpmValue <= 3500) {
    return { level: "Moderate", color: "goldenrod" }; // "goldenrod" is easier to see than plain yellow
  } else if (cpmValue <= 4000) {
    return { level: "Elevated", color: "orange" };
  } else {
    return { level: "Bad", color: "red" };
  }
}

export default function RadnetData() {
  const [selectedCity, setSelectedCity] = useState("Riverside"); // Default city
  const [radiationData, setRadiationData] = useState([]);
  const [latestReading, setLatestReading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch and parse CSV data when the component mounts or the selected city changes
  useEffect(() => {
    async function fetchAndParseCsv() {
      setLoading(true);
      setErrorMsg("");
      setRadiationData([]);
      setLatestReading(null);

      try {
        // Encode the city name for URL (e.g., "LOS ANGELES" → "LOS%20ANGELES")
        const citySlug = encodeURIComponent(CITY_ENDPOINTS[selectedCity]);
        const dataRows = await fetchCaliforniaRadiationCSV(citySlug);

        setRadiationData(dataRows);

        // Get the latest reading (last row in sorted array)
        if (dataRows.length > 0) {
          setLatestReading(dataRows[dataRows.length - 1]);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAndParseCsv();
  }, [selectedCity]); // Runs when the selected city changes

  // Render logic
  if (loading) {
    return <div>Loading data...</div>;
  }
  if (errorMsg) {
    return <div style={{ color: "red" }}>Error: {errorMsg}</div>;
  }
  if (!radiationData || radiationData.length === 0) {
    return (
      <div>
        <CityDropdown
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
        <p>No data available.</p>
      </div>
    );
  }

  // Determine severity for the latest reading
  let severityLabel = "Unknown";
  let severityColor = "gray";
  if (latestReading) {
    const { level, color } = getSeverity(latestReading.r02);
    severityLabel = level;
    severityColor = color;
  }

  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #ccc",
        margin: "1rem",
      }}
    >
      <CityDropdown
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />

      <h2>RadNet Data for {radiationData[0]?.location ?? selectedCity}</h2>

      {/* Latest Reading */}
      {latestReading && (
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <p>
            <strong>Latest Timestamp:</strong> {latestReading.dateTime}
          </p>
          <p>
            <strong>Gamma Count Rate (R02) (CPM):</strong>{" "}
            {latestReading.r02.toFixed(2)}
          </p>
          <p style={{ color: severityColor }}>
            <strong>Severity:</strong> {severityLabel}
          </p>
        </div>
      )}
      <ResponsiveContainer width="100%" height={300}>
        {/* Historical Line Chart */}
        <LineChart
          height={300}
          width={1000}
          data={radiationData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dateTime" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="r02"
            stroke="#8884d8"
            name="Gamma R02 (CPM)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// City selection dropdown
function CityDropdown({ selectedCity, setSelectedCity }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ marginRight: "0.5rem" }}>Select City: </label>
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        {Object.keys(CITY_ENDPOINTS).map((cityLabel) => (
          <option key={cityLabel} value={cityLabel}>
            {cityLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

CityDropdown.propTypes = {
  selectedCity: PropTypes.string,
  setSelectedCity: PropTypes.func,
};
