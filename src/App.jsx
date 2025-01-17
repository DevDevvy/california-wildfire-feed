import { useEffect, useState, useContext } from "react";
import { UserContext } from "./context/UserContext";
import axios from "axios";
import IncidentList from "./components/IncidentsList";
import MapView from "./components/MapView";
import Footer from "./components/Footer";
import Header from "./components/Header";
import FireResponses from "./components/RiversideFireDepartmentResponseList";
import CrimeResponses from "./components/RiversideCrimeReportsList";
import EarthquakeComponent from "./components/EarthquakeList";
import { UserProvider } from "./context/UserProvider";
import AQIComponent from "./components/AQIComponent";
import { fetchIncidents } from "./api/data";

function App() {
  const { fetchUserLocation } = useContext(UserContext);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(false);
  const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const API_URL = `/api/umbraco/api/IncidentApi/GeoJsonList?inactive=${toggle}`;

  useEffect(() => {
    fetchUserLocation();
  }, []);

  useEffect(() => {
    const getIncidents = async () => {
      try {
        const response = await fetchIncidents(toggle);
        setIncidents(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    getIncidents();
    const interval = setInterval(fetchIncidents, 120000); // Update every 2 minutes
    return () => clearInterval(interval); // Cleanup interval
  }, [toggle]);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div id="root">
          <Header />
          <main>
            <div className="aqi-component">
              <AQIComponent />
            </div>
            <div className="incidents-map-container">
              <div className="incident-list">
                <IncidentList
                  featureCollection={incidents}
                  toggle={toggle}
                  setToggle={setToggle}
                />
              </div>
              {googleApiKey && (
                <div className="map-view">
                  <MapView geoData={incidents} />
                </div>
              )}
            </div>
            <div className="earthquakes">
              <EarthquakeComponent />
            </div>
            <div className="response-lists">
              <FireResponses />
              <CrimeResponses />
            </div>
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
