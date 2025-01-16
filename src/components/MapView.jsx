// MapView.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { GoogleMap, InfoWindow, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%", // or any fixed height so the map is visible
};

const center = {
  lat: 34.0522, // Los Angeles
  lng: -118.2437,
};

function MapView({ geoData }) {
  const [mapRef, setMapRef] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    if (!mapRef || !geoData) return;

    // 1) Clear any existing features so we can cleanly reload
    mapRef.data.forEach((feature) => {
      mapRef.data.remove(feature);
    });

    // 2) Add GeoJSON to the Data layer
    try {
      mapRef.data.addGeoJson(geoData);
    } catch (err) {
      console.error("Error adding GeoJSON to the map:", err);
    }

    // 3) (Optional) Style the points, lines, polygons
    //    For points, we can set a custom icon or color, etc.
    mapRef.data.setStyle(() => {
      return {
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/firedept.png",
          scaledSize: new window.google.maps.Size(32, 32), // or adjust as needed
        },
      };
    });

    // 4) Listen for clicks on Data layer features
    //    (We'll show how to open a custom InfoWindow or simply log the data)
    mapRef.data.addListener("click", (event) => {
      // event.feature is the clicked GeoJSON Feature
      setSelectedFeature(event.feature);
    });
  }, [mapRef, geoData]);

  const renderInfoWindow = () => {
    if (!selectedFeature) return null;

    const name = selectedFeature.getProperty("Name");
    const acresBurned = selectedFeature.getProperty("AcresBurned");
    const percentContained = selectedFeature.getProperty("PercentContained");
    const started = selectedFeature.getProperty("Started");
    const extinguished = selectedFeature.getProperty("ExtinguishedDate");

    // For the geometry, if it's a point, we can get the lat/lng
    const geometry = selectedFeature.getGeometry(); // e.g. type=Point
    const position = geometry.get(); // For points, geometry.get() returns LatLng

    // InfoWindow in @react-google-maps/api is typically a child of <GoogleMap>
    // We'll place it conditionally
    return (
      <InfoWindow
        position={position}
        onCloseClick={() => setSelectedFeature(null)}
      >
        <div>
          <h3>{name}</h3>
          <p>Acres Burned: {acresBurned}</p>
          <p>Percent Contained: {percentContained}%</p>
          <p>Started: {started ? new Date(started).toLocaleString() : "N/A"}</p>
          <p>
            Extinguished:{" "}
            {extinguished ? new Date(extinguished).toLocaleString() : "N/A"}
          </p>
        </div>
      </InfoWindow>
    );
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={8}
        onLoad={(map) => setMapRef(map)}
      >
        {renderInfoWindow()}
      </GoogleMap>
    </LoadScript>
  );
}

MapView.propTypes = {
  geoData: PropTypes.object, // The entire GeoJSON object
};

export default MapView;
