import { useState } from "react";
import PropTypes from "prop-types";
import GaugeChart from "react-gauge-chart";

function IncidentList({ incidents, toggle, setToggle }) {
  const [sortField, setSortField] = useState("Name");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedIncidents = [...incidents].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  const toggleState = toggle ? "Inactive" : "Active";

  return (
    <div
      style={{
        maxWidth: "30vw",
        overflowY: "scroll",
        padding: "1em",
        height: "100vh",
      }}
    >
      <h2>{toggleState} Wildfires</h2>

      <button className="toggle-button" onClick={() => setToggle(!toggle)}>
        {toggle ? "Show Active Fires" : "Show Inactive Fires"}
      </button>

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

      {sortedIncidents.map((incident) => (
        <div key={incident.UniqueId} className="incident-card">
          <h3>
            {incident.Name} ({incident.Type})
          </h3>
          <GaugeChart
            id="gauge-chart1"
            percent={incident.PercentContained / 100}
            textColor="#000"
            animate={false}
            style={{ width: "10em", height: "5em" }}
            colors={["#f03d16", "#f0dc16", "#16f030"]}
          />
          <p>
            <strong>County:</strong> {incident.County}
          </p>
          <p>
            <strong>Location:</strong> {incident.Location}
          </p>
          <p>
            <strong>Acres Burned:</strong> {incident.AcresBurned}
          </p>
          <p>
            <strong>Percent Contained:</strong>{" "}
            {incident.PercentContained !== null &&
            incident.PercentContained !== undefined
              ? `${incident.PercentContained}%`
              : "N/A"}
          </p>
          <p>
            <strong>Started:</strong>{" "}
            {new Date(incident.Started).toLocaleString()}
          </p>
          <p>
            <strong>Last Update:</strong>{" "}
            {new Date(incident.Updated).toLocaleString()}
          </p>
          {incident.AdminUnit && (
            <p>
              <strong>Admin Unit:</strong> {incident.AdminUnit}
            </p>
          )}
          {incident.AgencyNames && (
            <p>
              <strong>Agencies:</strong> {incident.AgencyNames}
            </p>
          )}
          {incident.ControlStatement && (
            <p>
              <strong>Control Statement:</strong> {incident.ControlStatement}
            </p>
          )}
          {incident.ExtinguishedDate && (
            <p>
              <strong>Extinguished:</strong>{" "}
              {new Date(incident.ExtinguishedDate).toLocaleString()}
            </p>
          )}
          {incident.CalFireIncident && (
            <p>
              <em>CalFire Incident</em>
            </p>
          )}
          <a href={incident.Url} target="_blank" rel="noopener noreferrer">
            More Info
          </a>
        </div>
      ))}
    </div>
  );
}

IncidentList.propTypes = {
  incidents: PropTypes.arrayOf(
    PropTypes.shape({
      UniqueId: PropTypes.string.isRequired,
      Name: PropTypes.string.isRequired,
      Location: PropTypes.string.isRequired,
      AcresBurned: PropTypes.number.isRequired,
      PercentContained: PropTypes.number,
      Started: PropTypes.string.isRequired,
      Latitude: PropTypes.number.isRequired,
      Longitude: PropTypes.number.isRequired,
      Url: PropTypes.string.isRequired,
    })
  ).isRequired,
  toggle: PropTypes.bool.isRequired,
  setToggle: PropTypes.func.isRequired,
};

export default IncidentList;
