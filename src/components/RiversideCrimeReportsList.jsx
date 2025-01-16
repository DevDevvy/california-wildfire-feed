import { useState, useEffect } from "react";

const CrimeResponses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/riverside/transparency/data/dataset/json/27?sort=offenseDate&order=asc&sort=callTime&sort=asc"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResponses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000); // Fetch data every 30 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "1em", border: "1px solid #ccc" }}>
      <h2>Crime Responses</h2>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Block Address</th>
            <th>NPC</th>
            <th>Premise</th>
            <th>Call Time</th>
            <th>Report Date</th>
            <th>Offense Date</th>
            <th>Crime Type</th>
            <th>Case Number</th>
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
              <td>{response.caseNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrimeResponses;
