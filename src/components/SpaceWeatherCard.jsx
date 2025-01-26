import { useEffect, useState } from "react";
import "./SpaceWeatherCard.css";

const SpaceWeatherCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://services.swpc.noaa.gov/text/advisory-outlook.txt"
        );
        const textData = await response.text();
        setData(parseSpaceWeatherData(textData));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching space weather data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const parseSpaceWeatherData = (text) => {
    const lines = text.split("\n");
    const summaryIndex = lines.findIndex((line) =>
      line.includes("Summary For")
    );
    const outlookIndex = lines.findIndex((line) =>
      line.includes("Outlook For")
    );

    const summary = lines.slice(summaryIndex + 1, outlookIndex).join(" ");
    const outlook = lines.slice(outlookIndex + 1).join(" ");

    return { summary, outlook };
  };

  if (loading) {
    return (
      <div className="card loading">
        <div className="loading-bar short"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar medium"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Space Weather Advisory</h2>
        <p>Data provided by NOAA Space Weather Prediction Center</p>
      </div>
      <div className="card-content">
        <div className="card-section">
          <h3>Summary</h3>
          <p>{data.summary}</p>
        </div>
        <div className="card-section">
          <h3>Outlook</h3>
          <p>{data.outlook}</p>
        </div>
      </div>
    </div>
  );
};

export default SpaceWeatherCard;
