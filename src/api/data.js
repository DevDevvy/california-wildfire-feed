
import axios from "axios";
import Papa from "papaparse";


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

export const fetchCaliforniaRadiationCSV = async (city) => {
    try {
        const response = await fetch(
            `radiation/cdx-radnet-rest/api/rest/csv/2025/fixed/CA/${city}`
        );
        if (!response.ok) {
            throw new Error(
                `Error ${response.status} fetching data for ${city}`
            );
        }
        const csvString = await response.text();

        // Parse CSV with PapaParse
        let sanitized = csvString
            .replace(/\r\n/g, "\n") // Replace CRLF with LF
            .replace(/\r/g, "\n");  // Replace lone CR with LF

        // Now parse the "normalized" string
        const parsed = Papa.parse(sanitized, {
            header: true,
            skipEmptyLines: "greedy",
            newline: "\n"
        });

        console.log("parsed", parsed);
        if (parsed.errors && parsed.errors.length > 0) {
            console.warn("Parsing errors:", parsed.errors);
        }

        // Extract relevant data
        const dataRows = parsed.data.map((row) => ({
            location: row["LOCATION_NAME"],
            dateTime: row["SAMPLE COLLECTION TIME"].split(" ")[0],
            r02: parseFloat(row["GAMMA COUNT RATE R02 (CPM)"]) || 0,
        }));

        const count = dataRows.length;
        const sum = dataRows.reduce((acc, row) => acc + row.r02, 0);
        const avg = sum / count;

        // Sort by date/time to ensure chronological order
        dataRows.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        return { dataRows, avg };
    } catch (error) {
        console.error(`Error fetching Riverside data for radiation dataset:`, error);
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

export const fetchWeatherData = async (latitude, longitude) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
        );
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return response;
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

export const fetchSpaceData = async () => {
    try {
        const response = await fetch(
            "https://services.swpc.noaa.gov/text/advisory-outlook.txt"
        );
        const textData = await response.text();
        return textData;
    } catch (error) {
        console.error("Error fetching space weather data:", error);
    }
}

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