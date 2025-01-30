import { useState, useEffect } from "react";
import { fetchRiversideData } from "../api/data";

const CrimeResponses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const datasetId = 27;
  const query = "sort=offenseDate&order=asc&sort=callTime&sort=asc";

  useEffect(() => {
    const getCrimeData = async () => {
      try {
        const data = await fetchRiversideData(datasetId, query);

        setResponses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getCrimeData();
    const intervalId = setInterval(getCrimeData, 120000); // Fetch data every 2 minutes

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      style={{
        padding: "1em",
        border: "1px solid #ccc",
        height: "400px",
        overflowY: "auto",
      }}
    >
      <h2>Crime Responses</h2>
      <table
        border="1"
        style={{ fontSize: "0.8em", width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Block Address</th>
            <th>NPC</th>
            <th>Premise</th>
            <th>Call Time</th>
            <th>Report Date</th>
            <th>Offense Date</th>
            <th>Crime Type</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response) => (
            <tr key={response._id}>
              <td>{response.blockAddress}</td>
              <td>{response.npc}</td>
              <td>{response.premise}</td>
              <td>{response.callTime}</td>
              <td>{response.reportDate}</td>
              <td>{response.offenseDate}</td>
              <td>{response.crimeType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrimeResponses;
