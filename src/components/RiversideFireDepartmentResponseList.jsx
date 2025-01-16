import { useState, useEffect } from "react";

const FireResponses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/riverside/transparency/data/dataset/json/18?sort=Incident+Number&order=desc"
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
      <h2>Fire Department Responses</h2>
      <table
        border="1"
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Incident Number</th>
            <th>Incident Date</th>
            <th>Address</th>
            <th>Response Type</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response) => (
            <tr key={response._id}>
              <td>{response["Incident Number"]}</td>
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
