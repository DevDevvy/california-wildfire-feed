import { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import PropTypes from "prop-types";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 34.0522, // Center of Los Angeles
  lng: -118.2437,
};

function MapView({ incidents }) {
  const [selectedIncident, setSelectedIncident] = useState(null);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
        {incidents.map((incident) => (
          <Marker
            key={incident.UniqueId}
            position={{ lat: incident.Latitude, lng: incident.Longitude }}
            onClick={() => setSelectedIncident(incident)}
          />
        ))}

        {selectedIncident && (
          <InfoWindow
            position={{
              lat: selectedIncident.Latitude,
              lng: selectedIncident.Longitude,
            }}
            onCloseClick={() => setSelectedIncident(null)}
          >
            <div>
              <h3>{selectedIncident.Name}</h3>
              <p>
                <strong>Acres Burned:</strong> {selectedIncident.AcresBurned}
              </p>
              <p>
                <strong>Percent Contained:</strong>{" "}
                {selectedIncident.PercentContained}%
              </p>
              <p>
                <strong>Location:</strong> {selectedIncident.Location}
              </p>
              <a
                href={selectedIncident.Url}
                target="_blank"
                rel="noopener noreferrer"
              >
                More Info
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

MapView.propTypes = {
  incidents: PropTypes.arrayOf(
    PropTypes.shape({
      UniqueId: PropTypes.string.isRequired,
      Latitude: PropTypes.number.isRequired,
      Longitude: PropTypes.number.isRequired,
      Name: PropTypes.string.isRequired,
      AcresBurned: PropTypes.number.isRequired,
      PercentContained: PropTypes.number,
      Location: PropTypes.string.isRequired,
      Url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MapView;
