import { useEffect, useState } from "react";
import axios from "axios";
import IncidentList from "./components/IncidentsList";
import MapView from "./components/MapView";
import Footer from "./components/Footer";
import Header from "./components/Header";
import FireResponses from "./components/RiversideFireDepartmentResponseList";
import CrimeResponses from "./components/RiversideCrimeReportsList";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(false);
  const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const API_URL = `/api/umbraco/api/IncidentApi/GeoJsonList?inactive=${toggle}`;

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await axios.get(API_URL);
        setIncidents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 30000); // Update every 30 seconds
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
