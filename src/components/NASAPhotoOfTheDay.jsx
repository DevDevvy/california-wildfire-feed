import { useEffect, useState } from "react";
import "./NASAPhotoOfTheDay.css";

const NASAPhotoOfTheDay = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = import.meta.env.VITE_NASA_API_KEY; // Replace with your actual API key
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        );
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching NASA APOD data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showDetailsClick = () => {
    setDetails(!details);
  };

  if (loading) {
    return (
      <div className="card loading">
        <div className="loading-bar short"></div>
        <div className="loading-bar medium"></div>
        <div className="loading-bar"></div>
      </div>
    );
  }

  if (!data || data.media_type !== "image") {
    return (
      <div className="card">
        <p>Could not load image data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>{data.title}</h2>
        <p>
          {data.date} -{" "}
          {data.copyright ? `© ${data.copyright}` : "Public Domain"}
        </p>
      </div>
      <div className="card-image">
        <img src={data.url} alt={data.title} />
      </div>
      <button className="space-photo-button" onClick={() => showDetailsClick()}>
        Details
      </button>
      {details ? (
        <div className="card-content">
          <p>{data.explanation}</p>
        </div>
      ) : null}
    </div>
  );
};

export default NASAPhotoOfTheDay;
