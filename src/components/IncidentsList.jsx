// IncidentList.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import GaugeChart from "react-gauge-chart";

function IncidentList({ featureCollection, toggle, setToggle }) {
  const [sortField, setSortField] = useState("Name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Safely extract array of Features
  const features = featureCollection?.features || [];

  // Optional: filter features by "IsActive" if you want the toggle to show
  // active vs. inactive fires on the client side
  const filteredFeatures = features.filter((feature) => {
    const isActive = feature.properties?.IsActive;
    return toggle ? !isActive : isActive;
  });

  // Sort by the chosen `sortField` in ascending or descending order
  const sortedFeatures = [...filteredFeatures].sort((a, b) => {
    const aVal = a.properties[sortField];
    const bVal = b.properties[sortField];
    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const toggleStateLabel = toggle ? "Inactive" : "Active";

  return (
    <div style={{ maxWidth: "30vw", overflowY: "scroll", padding: "1em" }}>
      <h2>{toggleStateLabel} Wildfires</h2>

      {/* Toggle button */}
      <button className="toggle-button" onClick={() => setToggle(!toggle)}>
        {toggle ? "Show Active Fires" : "Show Inactive Fires"}
      </button>

      {/* Sorting UI */}
      <div style={{ margin: "1em 0" }}>
        <label htmlFor="sortField">Sort By: </label>
        <select
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="Name">Name</option>
          <option value="County">County</option>
          <option value="Updated">Updated</option>
          <option value="AcresBurned">Acres Burned</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      {/* Render each feature’s properties */}
      {sortedFeatures.map((feature) => {
        const props = feature.properties;
        const key = props.UniqueId || `${props.Name}-${props.Started}`;

        return (
          <div key={key} className="incident-card">
            <h3>
              {props.Name} {props.Type ? `(${props.Type})` : ""}
            </h3>

            {/* GaugeChart for % contained */}
            <GaugeChart
              id={`gauge-chart-${key}`}
              percent={(props.PercentContained || 0) / 100}
              textColor="#000"
              animate={false}
              style={{ width: "10em", height: "5em" }}
              colors={["#f03d16", "#f0dc16", "#16f030"]}
            />

            <p>
              <strong>County:</strong> {props.County}
            </p>
            <p>
              <strong>Location:</strong> {props.Location}
            </p>
            <p>
              <strong>Acres Burned:</strong> {props.AcresBurned}
            </p>
            <p>
              <strong>Percent Contained:</strong>{" "}
              {props.PercentContained !== null &&
              props.PercentContained !== undefined
                ? `${props.PercentContained}%`
                : "N/A"}
            </p>
            <p>
              <strong>Started:</strong>{" "}
              {props.Started ? new Date(props.Started).toLocaleString() : "N/A"}
            </p>
            <p>
              <strong>Last Update:</strong>{" "}
              {props.Updated ? new Date(props.Updated).toLocaleString() : "N/A"}
            </p>

            {/* Optional fields */}
            {props.AdminUnit && (
              <p>
                <strong>Admin Unit:</strong> {props.AdminUnit}
              </p>
            )}
            {props.AgencyNames && (
              <p>
                <strong>Agencies:</strong> {props.AgencyNames}
              </p>
            )}
            {props.ControlStatement && (
              <p>
                <strong>Control Statement:</strong> {props.ControlStatement}
              </p>
            )}
            {props.ExtinguishedDate && (
              <p>
                <strong>Extinguished:</strong>{" "}
                {new Date(props.ExtinguishedDate).toLocaleString()}
              </p>
            )}
            {props.CalFireIncident && (
              <p>
                <em>CalFire Incident</em>
              </p>
            )}

            {/* Link */}
            {props.Url && (
              <a href={props.Url} target="_blank" rel="noopener noreferrer">
                More Info
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

IncidentList.propTypes = {
  featureCollection: PropTypes.shape({
    type: PropTypes.string,
    features: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        geometry: PropTypes.object,
        properties: PropTypes.object,
      })
    ),
  }),
  toggle: PropTypes.bool.isRequired,
  setToggle: PropTypes.func.isRequired,
};

export default IncidentList;
