import { useState, useEffect } from "react";
import { fetchRiversideData } from "../api/data";

const FireResponses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const datasetId = 18;
  const query = "sort=Incident+Number&order=desc";

  useEffect(() => {
    const getFireResponseData = async () => {
      try {
        const data = await fetchRiversideData(datasetId, query);
        setResponses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getFireResponseData();
    const intervalId = setInterval(getFireResponseData, 120000); // Fetch data every 2 minutes

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
      <h2>Fire Department Responses</h2>
      <table
        border="1"
        style={{
          width: "100%",
          padding: "1em",
          borderCollapse: "collapse",
          fontSize: "0.8em",
        }}
      >
        <thead>
          <tr>
            <th>Incident Date</th>
            <th>Address</th>
            <th>Response Type</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response) => (
            <tr key={response._id}>
              <td>{response["Incident Date"]}</td>
              <td>{response.Address}</td>
              <td>{response["Response Type"] || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FireResponses;
