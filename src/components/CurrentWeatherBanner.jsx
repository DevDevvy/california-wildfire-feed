import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faCloudSun,
  faCloudMoon,
  faCloudRain,
  faCloudMoonRain,
  faCloudSunRain,
  faCloudBolt,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";
import { faCloudversify } from "@fortawesome/free-brands-svg-icons";
import "./CurrentWeatherBanner.css";

const iconMapping = {
  "01d": faSun,
  "01n": faMoon,
  "02d": faCloudSun,
  "02n": faCloudMoon,
  "03d": faCloudSun,
  "03n": faCloudMoon,
  "04d": faCloudSun,
  "04n": faCloudMoon,
  "09d": faCloudRain,
  "09n": faCloudMoonRain,
  "10d": faCloudSunRain,
  "10n": faCloudMoonRain,
  "11d": faCloudSunRain,
  "11n": faCloudBolt,
  "13d": faSnowflake,
  "13n": faSnowflake,
  "50d": faCloudversify,
  "50n": faCloudversify,
};

const CurrentWeatherBanner = () => {
  const { userLocation } = useContext(UserContext);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      if (userLocation) {
        try {
          const { latitude, longitude } = userLocation;
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
          );
          if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
          }
          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWeather();
  }, [userLocation, API_KEY]);

  if (loading) return <div>Loading weather data...</div>;

  if (!weatherData)
    return <div>Error fetching weather data. Please try again later.</div>;

  const {
    weather,
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed, gust } = {},
    clouds,
    rain,
    snow,
    name,
  } = weatherData;

  const weatherIcon = iconMapping[weather[0].icon];

  return (
    <div className="weather-banner">
      <div className="weather-header">
        <h3>{name}</h3>
        {weatherIcon && <FontAwesomeIcon icon={weatherIcon} size="2x" />}
        <p>
          {weather[0].main} - {weather[0].description}
        </p>
      </div>
      <div className="weather-details">
        <p>
          <strong>Temperature:</strong> {temp.toFixed(1)}°F (Feels like{" "}
          {feels_like.toFixed(1)}°F)
        </p>
        <p>
          <strong>Min/Max:</strong> {temp_min.toFixed(1)}°F /{" "}
          {temp_max.toFixed(1)}°F
        </p>
        <p>
          <strong>Humidity:</strong> {humidity}%
        </p>
        <p>
          <strong>Wind:</strong> {speed.toFixed(1)} mph
          {gust && ` (Gusts up to ${gust.toFixed(1)} mph)`}
        </p>
        {clouds && (
          <p>
            <strong>Cloud Cover:</strong> {clouds.all}%
          </p>
        )}
        {rain && rain["1h"] && (
          <p>
            <strong>Rain (last 1h):</strong> {rain["1h"].toFixed(2)} mm
          </p>
        )}
        {snow && snow["1h"] && (
          <p>
            <strong>Snow (last 1h):</strong> {snow["1h"].toFixed(2)} mm
          </p>
        )}
      </div>
    </div>
  );
};

export default CurrentWeatherBanner;
