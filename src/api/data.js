
import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const fetchIncidents = async (inactive) => {
    try {
        const response = await axios.get(`/api/umbraco/api/IncidentApi/GeoJsonList?inactive=${inactive}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching incidents:", error);
        throw error;
    }
};


export const fetchEarthquakes = async (timeframe = "all_hour") => {
    try {
        const response = await fetch(`/earthquakes/feed/v1.0/summary/${timeframe}.geojson`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching earthquake data:", error);
        throw error;
    }
};

export const fetchRiversideData = async (datasetId, query = "") => {
    try {
        const response = await fetch(
            `/riverside/transparency/data/dataset/json/${datasetId}?${query}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching Riverside data for dataset ${datasetId}:`, error);
        throw error;
    }
};



export const fetchAQI = async (latitude, longitude) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        );
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        throw error;
    }
};

/*const response = await fetch(
    `https://api.weather.gov/alerts/active.json?point=${latitude}%2C${longitude}`
);*/

export const fetchWeatherAlerts = async (latitude, longitude) => {
    try {
        const response = await fetch(
            `https://api.weather.gov/alerts/active.json?point=${latitude}%2C${longitude}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch weather alerts.");
        }
        const data = await response.json();
        const actualAlerts = data.features.filter(
            (alert) => alert.properties.status === "Actual"
        );
        return actualAlerts;
    } catch (error) {
        console.error("Error fetching weather alerts:", error);
        throw error;
    }
}